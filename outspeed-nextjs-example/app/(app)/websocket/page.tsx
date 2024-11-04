"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useWebSocket } from "@outspeed/react";
import { Loader2 } from "lucide-react";
import { ConsoleLogger, ERealtimeConnectionStatus } from "@outspeed/react";
import { MeetingLayout } from "../../_components/meeting-layout";
import { useRouter, useSearchParams } from "next/navigation";

export default function WebSocketRealtimeApp() {
  const searchparams = useSearchParams();
  const connectionInitiated = useRef(false);
  const {
    connect,
    response,
    disconnect,
    remoteAudioTrack,
    localAudioTrack,
    dataChannel,
    connectionStatus,
  } = useWebSocket({
    config: {
      functionURL: searchparams.get("functionURL") || "",
      audio: {
        deviceId: searchparams.get("audioDeviceId") || "",
        echoCancellation: true,
      },
      logger: ConsoleLogger.getLogger(),
    },
  });

  const { push } = useRouter();

  useEffect(() => {
    if (!connectionInitiated.current) {
      connectionInitiated.current = true;
      connect();
    }
  }, [connect]);

  const onDisconnect = useCallback(() => {
    push("/?query=websocket");
  }, [push]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
    onDisconnect();
  }, [disconnect, onDisconnect]);

  if (connectionStatus === ERealtimeConnectionStatus.Connecting) {
    return (
      <div className="h-full flex flex-1 justify-center items-center">
        <Loader2 size={48} className="animate-spin" />
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
          title="WebSocket Example"
          onCallEndClick={handleDisconnect}
          localTrack={null}
          remoteTrack={null}
          localAudioTrack={localAudioTrack}
          remoteAudioTrack={remoteAudioTrack}
          dataChannel={dataChannel}
        />
      </div>
    </div>
  );
}
