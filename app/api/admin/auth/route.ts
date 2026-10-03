import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import {
  configured,
  cookieOptions,
  FLOW,
  origin,
  seal,
} from "../../../../lib/admin";
export async function GET() {
  if (!configured())
    return NextResponse.redirect(`${origin()}/admin?error=setup`);
  const state = randomBytes(32).toString("base64url"),
    verifier = randomBytes(32).toString("base64url");
  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${origin()}/api/admin/callback`,
    scope: "public_repo",
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
    login: "jamescahours",
  }).toString();
  const response = NextResponse.redirect(url);
  response.cookies.set(FLOW, seal({ state, verifier }, 600), {
    ...cookieOptions,
    maxAge: 600,
  });
  return response;
}
