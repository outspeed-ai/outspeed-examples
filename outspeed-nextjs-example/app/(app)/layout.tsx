"use client";
import React from "react";
import { RealtimeToast } from "@outspeed/react";
import Image from "next/image";

export default function RealtimeAppLayout(props: React.PropsWithChildren) {
  const { children } = props;
  return (
    <div className="flex justify-center h-dvh w-dvw">
      <RealtimeToast />
      <div className="flex flex-1 max-w-[1344px] p-4">
        <div className="flex-1 flex flex-col">
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
          {children}
        </div>
      </div>
    </div>
  );
}
