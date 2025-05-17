// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";
// import SocialAccount from "@/models/SocialAccount";
// import { connectDB } from "@/lib/mongodb";
// import { getToken } from "next-auth/jwt";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const redirectUri =
//       "http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Flinkedin%2Fcallback";
//     const { searchParams } = new URL(req.url);
//     const code = searchParams.get("code");
//     const error = searchParams.get("error");
//     console.log(searchParams);
    

//     if (error) return NextResponse.redirect(`/?error=${error}`);
//     if (!code) return NextResponse.redirect("/?error=no_code");


//     const tokenResponse = await fetch(
//       "https://www.linkedin.com/oauth/v2/accessToken",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           grant_type: "authorization_code",
//           code,
//           client_id: process.env.LINKEDIN_CLIENT_ID!,
//           client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
//           redirect_uri: redirectUri,
//         }),
//       }
//     );

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json();
//       throw new Error(`Token failed: ${JSON.stringify(errorData)}`);
//     }

//     const tokenData = await tokenResponse.json();
//          const token = await getToken({ req });
//          const userId = token?.sub;

//           if (!userId) {
//             return NextResponse.redirect("/login?error=not_authenticated");
//           }


//     const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
//       headers: { Authorization: `Bearer ${tokenData.access_token}` },
//     });
//     if (!profileResponse.ok) throw new Error("Profile fetch failed");
//     const profile = await profileResponse.json();

   
//     await SocialAccount.create({
//       userId: new mongoose.Types.ObjectId(userId), 
//       platform: "linkedin",
//       accessToken: tokenData.access_token,
//       refreshToken: tokenData.refresh_token,
//       expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
//     });

//     // 4. Redirect to dashboard
//     return NextResponse.redirect("/dashboard?success=linkedin_connected");
//   } catch (error) {
//     console.error("LinkedIn callback error:", error);
//     return NextResponse.redirect("/?error=auth_failed");
//   }
// }


//



// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import SocialAccount from "@/models/SocialAccount";
// import { connectDB } from "@/lib/mongodb";
// import { getToken } from "next-auth/jwt";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const code = searchParams.get("code");
//     const error = searchParams.get("error");

//     // Handle LinkedIn errors first
//     if (error) {
//       // Specific handling for scope errors
//       if (error === "unauthorized_scope_error") {
//         const url = new URL("/", req.url);
//         url.searchParams.set("error", "linkedin_scope_not_approved");
//         return NextResponse.redirect(url.toString());
//       }

//       // Generic error handling
//       const errorUrl = new URL("/", req.url);
//       errorUrl.searchParams.set("error", error);
//       return NextResponse.redirect(errorUrl.toString());
//     }

//     if (!code) {
//       const errorUrl = new URL("/", req.url);
//       errorUrl.searchParams.set("error", "no_code");
//       return NextResponse.redirect(errorUrl.toString());
//     }

//     // Get access token
//     const tokenResponse = await fetch(
//       "https://www.linkedin.com/oauth/v2/accessToken",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           grant_type: "authorization_code",
//           code,
//           client_id: process.env.LINKEDIN_CLIENT_ID!,
//           client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
//           redirect_uri: "http://localhost:3000/api/auth/linkedin/callback",
//         }),
//       }
//     );

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json();
//       throw new Error(`Token failed: ${JSON.stringify(errorData)}`);
//     }

//     const tokenData = await tokenResponse.json();
//     const token = await getToken({ req });
//     const userId = token?.sub;

//    if (!userId) {
//      // Redirect to login with proper error handling
//      const loginUrl = new URL("/login", req.url);
//      loginUrl.searchParams.set("error", "not_authenticated");
//      loginUrl.searchParams.set(
//        "message",
//        "Please login first before connecting LinkedIn"
//      );
//      return NextResponse.redirect(loginUrl.toString());
//    }

//     // Get profile data
//     const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
//       headers: { Authorization: `Bearer ${tokenData.access_token}` },
//     });

//     if (!profileResponse.ok) throw new Error("Profile fetch failed");
//     const profile = await profileResponse.json();

//     // NEW: Get email address
//     const emailResponse = await fetch(
//       "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
//       {
//         headers: { Authorization: `Bearer ${tokenData.access_token}` },
//       }
//     );

//     if (!emailResponse.ok) throw new Error("Email fetch failed");
//     const emailData = await emailResponse.json();
//     const email = emailData.elements?.[0]?.["handle~"]?.emailAddress;

//     // Save to database
//     await SocialAccount.create({
//       userId: new mongoose.Types.ObjectId(userId),
//       platform: "linkedin",
//       accessToken: tokenData.access_token,
//       refreshToken: tokenData.refresh_token,
//       expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
//       profileId: profile.id,
//     });

//     // Redirect to dashboard
//     const successUrl = new URL("/dashboard", req.url);
//     successUrl.searchParams.set("success", "linkedin_connected");
//     return NextResponse.redirect(successUrl.toString());
//   } catch (error) {
//     console.error("LinkedIn callback error:", error);
//     const errorUrl = new URL("/", req.url);
//     errorUrl.searchParams.set("error", "auth_failed");
//     return NextResponse.redirect(errorUrl.toString());
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import SocialAccount from "@/models/SocialAccount";
import { connectDB } from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const redirectUri = "https://portfolio-one-beryl-85.vercel.app";
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    console.log(searchParams);

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

    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );
    if (!profileResponse.ok) throw new Error("Profile fetch failed");
    const profile = await profileResponse.json();
    console.log(profile);
    

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