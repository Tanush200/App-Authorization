import { NextResponse } from "next/server";

export async function GET() {
  const redirectUri = "https://portfolio-one-beryl-85.vercel.app";
  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("client_id", process.env.LINKEDIN_CLIENT_ID!);
  authUrl.searchParams.append(
    "redirect_uri",
    redirectUri
  );
 authUrl.searchParams.append("scope", "openid profile email");
  authUrl.searchParams.append("state", crypto.randomUUID());

  return NextResponse.redirect(authUrl.toString());
}
