import { NextRequest, NextResponse } from "next/server";
import SocialAccount from "@/models/SocialAccount";
import { connectDB } from "@/lib/mongodb";

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(`/?error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect("/?error=no_code");
    }

    // Exchange code for token
    const tokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
          redirect_uri: `${process.env
            .NEXTAUTH_URL!}/api/auth/linkedin/callback`,
        }),
      }
    );

    const tokenData: LinkedInTokenResponse = await tokenResponse.json();

    // Store in MongoDB
    await SocialAccount.create({
      userId: new mongoose.Types.ObjectId(), // Replace with actual user ID
      platform: "linkedin",
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });

    return NextResponse.redirect("/dashboard?success=linkedin_connected");
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect("/?error=auth_failed");
  }
}
