"use client";
import React, { Suspense } from "react";
import { useWebRTC } from "@outspeed/react";
import { ConsoleLogger, createConfig } from "@outspeed/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MeetingLayout } from "../_components/VoiceBotComponent";
import { ERealtimeConnectionStatus } from "@outspeed/react";

export default function WebRTCApp() {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <WebRTCContent />
    </Suspense>
  );
}

function WebRTCContent() {
  const searchparams = useSearchParams();
  const { push } = useRouter();

  const {
    connectionStatus,
    response,
    connect,
    disconnect,
    localAudioTrack,
    localVideoTrack,
    remoteAudioTrack,
    remoteVideoTrack,
    dataChannel,
  } = useWebRTC({
    config: createConfig({
      functionURL: searchparams.get("functionURL") || "",
      audioDeviceId: searchparams.get("audioDeviceId") || undefined,
      logger: ConsoleLogger.getLogger(),
    }),
  });

  React.useEffect(() => {
    connect();
  }, [connect]);

  function handleDisconnect() {
    disconnect();
    push("/?query=webrtc");
  }

  if (connectionStatus === ERealtimeConnectionStatus.Connecting) {
    return (
      <div className="h-full flex flex-1 justify-center items-center">
        Loading...
      </div>
    );
  }

  if (connectionStatus === ERealtimeConnectionStatus.Failed) {
    return (
      <div className="h-full flex flex-1 justify-center items-center">
        <div className="flex items-center space-y-4 flex-col">
          <h2 className="text-3xl font-light">
            Failed to connect.{" "}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(response?.data as any)?.detail || "Please try again."}
          </h2>
          <details className="max-w-lg overflow-auto">
            <summary>See Response</summary>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="language-js text-sm">
                {JSON.stringify(response, undefined, 2)}
              </code>
            </pre>
          </details>
          <button
            className="inline-flex max-w-24"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1">
      <div className="flex-1 flex">
        <MeetingLayout
          title="WebRTC Example"
          onCallEndClick={handleDisconnect}
          localTrack={localVideoTrack}
          remoteTrack={remoteVideoTrack}
          localAudioTrack={localAudioTrack}
          remoteAudioTrack={remoteAudioTrack}
          dataChannel={dataChannel}
        />
      </div>
    </div>
  );
}
