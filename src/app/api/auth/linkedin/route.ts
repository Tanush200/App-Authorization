import { NextResponse } from "next/server";

export async function GET() {
  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("client_id", process.env.LINKEDIN_CLIENT_ID!);
  authUrl.searchParams.append(
    "redirect_uri",
    `${process.env.NEXTAUTH_URL!}/api/auth/linkedin/callback`
  );
  authUrl.searchParams.append("scope", "r_liteprofile w_member_social");
  authUrl.searchParams.append("state", crypto.randomUUID());

  return NextResponse.redirect(authUrl.toString());
}
