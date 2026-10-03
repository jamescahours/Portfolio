import { NextResponse } from "next/server";
import { origin, sameOrigin, SESSION } from "../../../../lib/admin";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const response = NextResponse.redirect(`${origin()}/admin`, 303);
  response.cookies.delete(SESSION);
  return response;
}
