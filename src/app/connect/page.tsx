"use client";

export default function ConnectLinkedIn() {
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
    </div>
  );
}
