import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  cookieOptions,
  FLOW,
  github,
  origin,
  seal,
  SESSION,
  unseal,
} from "../../../../lib/admin";
export async function GET(request: Request) {
  const flow = unseal((await cookies()).get(FLOW)?.value);
  const params = new URL(request.url).searchParams;
  const fail = () => {
    const response = NextResponse.redirect(`${origin()}/admin?error=signin`);
    response.cookies.delete(FLOW);
    return response;
  };
  if (
    !flow ||
    !params.get("code") ||
    params.get("state") !== flow.state ||
    typeof flow.verifier !== "string"
  )
    return fail();
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: params.get("code"),
          redirect_uri: `${origin()}/api/admin/callback`,
          code_verifier: flow.verifier,
        }),
      },
    );
    const data = await response.json();
    if (!response.ok || typeof data.access_token !== "string") return fail();
    const userResponse = await github(data.access_token, "/user");
    if (!userResponse.ok || (await userResponse.json()).id !== 52476217)
      return fail();
    const result = NextResponse.redirect(`${origin()}/admin`);
    result.cookies.delete(FLOW);
    result.cookies.set(
      SESSION,
      seal({ userId: 52476217, token: data.access_token }, 28800),
      { ...cookieOptions, maxAge: 28800 },
    );
    return result;
  } catch {
    return fail();
  }
}
