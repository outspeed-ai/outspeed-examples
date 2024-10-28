"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WebRTCTakeInput } from "./_components/WebRTCTakeInput";

export default function LandingPage() {
  const { push } = useRouter();

  function onSubmit(
    config: {
      functionURL: string;
      audioDeviceId?: string;
      videoDeviceId?: string;
    },
    targetURL: string
  ) {
    const { functionURL, audioDeviceId, videoDeviceId } = config;
    const sp = new URLSearchParams();
    sp.set("functionURL", functionURL);
    sp.set("audioDeviceId", audioDeviceId || "not-set");
    push(`${targetURL}?${sp.toString()}`);
  }

  return (
    <>
      <div className="mt-2 justify-start p-4">
        <a href="https://outspeed.com">
          <Image
            height={40}
            width={200}
            alt="logo"
            src="/outspeed.svg"
            className="h-10"
          />
        </a>
      </div>
      <div className="flex w-dvw flex-col items-center md:items-stretch md:flex-row">
        <div className="flex-1 flex w-full justify-center bg-background">
          <div className="flex-1 flex flex-col max-w-lg justify-center items-center md:px-10 md:max-w-2xl p-4">
            <div className="mb-4 p-4 text-red-500 text-lg border border-red-500 rounded">
              Please ensure that the app is running and Function URL is correct.
            </div>
            <WebRTCTakeInput
              onSubmit={(config) => onSubmit(config, "/webrtc")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
