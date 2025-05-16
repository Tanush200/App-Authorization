import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import SocialAccount from "@/models/SocialAccount";
import { connectDB } from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const redirectUri = "http://localhost:3000/api/auth/linkedin/callback";
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) return NextResponse.redirect(`/?error=${error}`);
    if (!code) return NextResponse.redirect("/?error=no_code");


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
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token failed: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
         const token = await getToken({ req });
         const userId = token?.sub;

          if (!userId) {
            return NextResponse.redirect("/login?error=not_authenticated");
          }


    const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileResponse.ok) throw new Error("Profile fetch failed");
    const profile = await profileResponse.json();

   
    await SocialAccount.create({
      userId: new mongoose.Types.ObjectId(userId), 
      platform: "linkedin",
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    });

    // 4. Redirect to dashboard
    return NextResponse.redirect("/dashboard?success=linkedin_connected");
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect("/?error=auth_failed");
  }
}
