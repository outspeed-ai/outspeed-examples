"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WebRTCTakeInput } from "./WebRTCTakeInput";

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
    <div className="flex h-dvh w-dvw flex-col items-center md:items-stretch md:flex-row">
      <div className="flex-1 bg-[hsl(204,80%,5%)] w-full flex justify-center md:justify-end">
        <div className="flex-1 p-4 flex flex-col max-w-lg md:max-w-2xl">
          {/* Logo */}
          <div className="mt-10 flex justify-start">
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
        </div>
      </div>
      <div className="flex-1 flex w-full justify-center md:justify-start bg-background">
        <div className="flex-1 flex flex-col max-w-lg justify-center md:px-10 md:max-w-2xl p-4">
          <div className="mb-4 p-4 text-red-500 text-lg border border-red-500 rounded">
            Please ensure that the app is running and Function URL is correct.
          </div>
          <WebRTCTakeInput onSubmit={(config) => onSubmit(config, "/webrtc")} />{" "}
        </div>
      </div>
    </div>
  );
}
