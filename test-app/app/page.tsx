"use client";
import {
  RealtimeAudio,
  useWebRTC,
  RealtimeAudioVisualizer,
} from "@outspeed/react";
import { createConfig } from "@outspeed/core";
import { ERealtimeConnectionStatus } from "@outspeed/react";
const OutspeedUI = ({ connection }: { connection: any }) => {
  const remoteAudioTrack = connection.remoteAudioTrack;
  return (
    <>
      <RealtimeAudio track={remoteAudioTrack} />
      <button onClick={() => connection.localAudioTrack?.pause()}>mute</button>
      <button onClick={() => connection.localAudioTrack?.resume()}>
        unmute
      </button>
      <button onClick={() => connection.dataChannel.send("hello")}>
        send message{" "}
      </button>
      {remoteAudioTrack && (
        <div style={{ height: "16rem", width: "16rem" }}>
          <RealtimeAudioVisualizer track={remoteAudioTrack} threshold={120} />
        </div>
      )}
    </>
  );
};

export default function Page() {
  const connection = useWebRTC({
    config: createConfig({
      functionURL: "http://0.0.0.0:8080",
      audioDeviceId: "",
      audioConstraints: {
        echoCancellation: true,
      },
    }),
  });

  const connectToOutspeed = () => {
    console.log("connecting");
    connection.connect();
    console.log("connected");
  };

  const disconnectFromOutspeed = () => {
    console.log("disconnecting");
    connection.disconnect();
    console.log("disconnected");
    window.location.reload();
  };

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <div>
        {connection.connectionStatus === ERealtimeConnectionStatus.Connected ? (
          <button onClick={disconnectFromOutspeed}>Disconnect</button>
        ) : (
          <button onClick={connectToOutspeed}>Connect</button>
        )}
        {connection.connectionStatus ===
          ERealtimeConnectionStatus.Connected && (
          <OutspeedUI connection={connection} />
        )}
      </div>
    </div>
  );
}
