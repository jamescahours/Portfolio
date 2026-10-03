import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";

export const SESSION = "portfolio-admin";
export const FLOW = "portfolio-oauth";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
export const origin = () =>
  new URL(process.env.ADMIN_ORIGIN || "https://jamescahours.com").origin;
export const configured = () =>
  Boolean(
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    (process.env.ADMIN_SESSION_SECRET?.length || 0) >= 32,
  );
function key() {
  if (!configured()) throw new Error("Admin setup is incomplete.");
  return createHash("sha256")
    .update(process.env.ADMIN_SESSION_SECRET!)
    .digest();
}
export function seal(value: object, seconds: number) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([
    cipher.update(
      JSON.stringify({ ...value, expires: Date.now() + seconds * 1000 }),
    ),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
}
export function unseal(value?: string): Record<string, unknown> | null {
  try {
    if (!value || value.length > 6000) return null;
    const data = Buffer.from(value, "base64url");
    const cipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
    cipher.setAuthTag(data.subarray(12, 28));
    const payload = JSON.parse(
      Buffer.concat([
        cipher.update(data.subarray(28)),
        cipher.final(),
      ]).toString(),
    );
    return typeof payload.expires === "number" && payload.expires > Date.now()
      ? payload
      : null;
  } catch {
    return null;
  }
}
export async function github(
  token: string,
  path: string,
  init: RequestInit = {},
) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
  });
}
export async function sessionToken() {
  const session = unseal((await cookies()).get(SESSION)?.value);
  return session?.userId === 52476217 && typeof session.token === "string"
    ? session.token
    : null;
}
export async function authorizedToken() {
  const token = await sessionToken();
  if (!token) return null;
  const result = await github(token, "/user");
  if (!result.ok) return null;
  return (await result.json()).id === 52476217 ? token : null;
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === origin();
}
