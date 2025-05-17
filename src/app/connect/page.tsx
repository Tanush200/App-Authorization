"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ConnectLinkedIn() {
  const searchParams = useSearchParams()

    useEffect(() => {
      const error = searchParams.get("error");
      if (error === "linkedin_scope_not_approved") {
        // Show user-friendly message about permissions
        alert(
          "We need additional permissions from LinkedIn to connect your account. Please contact support or try again later."
        );
        // Or use a toast notification or modal instead of alert
      }
    }, [searchParams]);
  const connectLinkedIn = () => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      "/api/auth/linkedin",
      "LinkedInOAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={connectLinkedIn}
        className="cursor-pointer bg-[#0077B5] text-white px-6 py-3 rounded-lg hover:bg-[#006097] transition-colors"
      >
        Connect LinkedIn Account
      </button>
      <button>
        <a href=" https://www.linkedin.com/uas/login?session_redirect=%2Foauth%2Fv2%2Flogin-success%3Fapp_id%3D223167292%26auth_type%3DAC%26flow%3D%257B%2522state%2522%253A%2522dfsgsdgsdgsdgs%2522%252C%2522creationTime%2522%253A1747416809059%252C%2522scope%2522%253A%2522profile%2522%252C%2522appId%2522%253A223167292%252C%2522authorizationType%2522%253A%2522OAUTH2_AUTHORIZATION_CODE%2522%252C%2522redirectUri%2522%253A%2522http%253A%252F%252Flocalhost%253A3000%252Fapi%252Fauth%252Flinkedin%252Fcallback%2522%252C%2522currentStage%2522%253A%2522LOGIN_SUCCESS%2522%252C%2522currentSubStage%2522%253A0%252C%2522authFlowName%2522%253A%2522generic-permission-list%2522%257D&fromSignIn=1&trk=oauth&cancel_redirect=%2Foauth%2Fv2%2Flogin-cancel%3Fapp_id%3D223167292%26auth_type%3DAC%26flow%3D%257B%2522state%2522%253A%2522dfsgsdgsdgsdgs%2522%252C%2522creationTime%2522%253A1747416809059%252C%2522scope%2522%253A%2522profile%2522%252C%2522appId%2522%253A223167292%252C%2522authorizationType%2522%253A%2522OAUTH2_AUTHORIZATION_CODE%2522%252C%2522redirectUri%2522%253A%2522http%253A%252F%252Flocalhost%253A3000%252Fapi%252Fauth%252Flinkedin%252Fcallback%2522%252C%2522currentStage%2522%253A%2522LOGIN_SUCCESS%2522%252C%2522currentSubStage%2522%253A0%252C%2522authFlowName%2522%253A%2522generic-permission-list%2522%257D"></a>
      </button>
    </div>
  );
}
