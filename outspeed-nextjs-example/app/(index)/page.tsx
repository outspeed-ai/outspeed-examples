"use client";
import Image from "next/image";
import { RealtimeExamples } from "../_components/RealtimeExamples";
import { Inputs } from "./inputs";
import { useRouter } from "next/navigation";

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
    sp.set("videoDeviceId", videoDeviceId || "not-set");
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
          {/* Description */}
          <div className="mt-10 text-[#999] pr-10">
            <p>
              Outspeed offers networking and inference infrastructure for
              building fast, real-time voice and video AI applications.
            </p>
            <br />
            <p>
              Choose an example from the list below, update the input form on
              the right, and click {'"Run"'} to see it in action.
            </p>
          </div>
          <RealtimeExamples />
        </div>
      </div>
      <div className="flex-1 flex w-full justify-center md:justify-start bg-background">
        <div className="flex-1 flex flex-col max-w-lg justify-center md:px-10 md:max-w-2xl p-4">
          <div className="mb-4 p-4 text-red-500 text-lg border border-red-500 rounded">
            Please ensure that the app is running and Function URL is correct.
          </div>
          <Inputs onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
