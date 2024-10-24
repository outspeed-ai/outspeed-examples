"use client";
import { AudioLinesIcon, VideoIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect } from "react";

type TExampleData = {
  query: string;
  title: string;
  description: string;
  icons: {
    title: string;
    children: React.ReactNode;
  }[];
};

const data: TExampleData[] = [
  {
    title: "WebRTC",
    description:
      "In this example, we will establish a WebRTC connection to stream both local and remote audio and video tracks.",
    query: "webrtc",
    icons: [
      {
        title: "Audio",
        children: <AudioLinesIcon />,
      },
      {
        title: "Video",
        children: <VideoIcon />,
      },
    ],
  },
  {
    title: "Websocket",
    description:
      "In this example, we will establish a Web Socket connection to stream both local and remote audio tracks.",
    query: "websocket",
    icons: [
      {
        title: "Audio",
        children: <AudioLinesIcon />,
      },
    ],
  },
];

export function RealtimeExamples() {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("query")) {
      push("?query=webrtc");
    }
  }, [push, searchParams]);

  return (
    <div className="flex-1 mt-20">
      <div className="flex flex-wrap gap-4 flex-col md:flex-row">
        {data.map((item) => (
          <div
            className={
              `border flex-1 p-4 rounded cursor-pointer hover:bg-accent hover:border-transparent md:max-w-[250px] md:flex-auto
              ${searchParams.get("query") === item.query && "border-primary hover:!border-primary"}`
            }
            key={item.title}
            onClick={() => push(`?query=${item.query}`)}
          >
            <div className="font-bold mb-4">{item.title}</div>
            <div className="flex space-x-3 mb-4">
              {item.icons.map((icon) => (
                <div key={icon.title}>{icon.children}</div>
              ))}
            </div>
            <div>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
