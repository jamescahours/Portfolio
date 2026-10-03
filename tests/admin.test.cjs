const { test } = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
// Transpile isolated server modules and provide only the Next cookie API boundary.
function load(file, overrides = {}) {
  const absolute = path.resolve(file);
  const source = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (name) =>
    name in overrides
      ? overrides[name]
      : require(
          name.startsWith(".")
            ? path.resolve(path.dirname(absolute), name)
            : name,
        );
  new Function("require", "module", "exports", source)(
    localRequire,
    module,
    module.exports,
  );
  return module.exports;
}
const initial = require("../content/site.json");
const { validateContent } = load("lib/content.ts");
test("existing content remains valid", () =>
  assert.deepEqual(validateContent(initial), initial));
test("unsafe URLs, invalid shape, and excessive input are rejected", () => {
  for (const change of [
    (d) => (d.contact.github = "javascript:alert(1)"),
    (d) => (d.contact.email = "bad address"),
    (d) => (d.categories[0].href = "javascript:alert(1)"),
    (d) => (d.hero.title = ""),
    (d) => (d.hero.copy = "x".repeat(5001)),
    (d) => (d.projects = []),
    (d) => (d.projects[0].className = "arbitrary-class"),
    (d) => (d.secret = "unknown"),
  ]) {
    const data = structuredClone(initial);
    change(data);
    assert.throws(() => validateContent(data));
  }
});
process.env.GITHUB_CLIENT_ID = "local-test";
process.env.GITHUB_CLIENT_SECRET = "local-test";
process.env.ADMIN_SESSION_SECRET =
  "local-test-secret-that-is-more-than-32-characters";
const admin = load("lib/admin.ts", {
  "next/headers": { cookies: async () => ({ get: () => undefined }) },
});
test("session is authenticated, encrypted and expires", () => {
  const sealed = admin.seal(
    { userId: 52476217, token: "private-test-token" },
    60,
  );
  assert.equal(sealed.includes("private-test-token"), false);
  assert.equal(admin.unseal(sealed).token, "private-test-token");
  const bytes = Buffer.from(sealed, "base64url");
  bytes[30] ^= 1;
  assert.equal(admin.unseal(bytes.toString("base64url")), null);
  assert.equal(admin.unseal(admin.seal({ token: "expired" }, -1)), null);
  assert.equal(admin.unseal("malformed"), null);
});
test("missing secrets fail closed and cross-origin writes are rejected", async () => {
  assert.equal(await admin.sessionToken(), null);
  assert.equal(
    admin.sameOrigin(
      new Request("https://jamescahours.com/api/admin/content", {
        headers: { origin: "https://attacker.example" },
      }),
    ),
    false,
  );
  assert.equal(
    admin.sameOrigin(
      new Request("https://jamescahours.com/api/admin/content", {
        headers: { origin: "https://jamescahours.com" },
      }),
    ),
    true,
  );
  const secret = process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(admin.configured(), false);
  assert.throws(() => admin.seal({}, 60));
  process.env.ADMIN_SESSION_SECRET = secret;
});
