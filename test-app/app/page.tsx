"use client";
import {
  RealtimeAudio,
  RealtimeAudioVisualizer,
  useWebRTC,
} from "@outspeed/react";
import { ConsoleLogger, createConfig } from "@outspeed/core";

const OutspeedUI = ({ connection }) => {
  return (
    <>
      <RealtimeAudio track={connection.getRemoteAudioTrack()} />
      <button onClick={() => connection.getLocalAudioTrack().pause()}>
        mute
      </button>
      <button onClick={() => connection.getLocalAudioTrack().resume()}>
        unmute
      </button>
      <button onClick={() => connection.dataChannel.send("hello")}>
        send message{" "}
      </button>
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
    connection.connect();
  };

  const disconnectFromOutspeed = () => {
    connection.disconnect();
  };

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <div>
        {connection.connectionStatus === "Connected" ? (
          <button onClick={disconnectFromOutspeed}>Disconnect</button>
        ) : (
          <button onClick={connectToOutspeed}>Connect</button>
        )}
        {connection.connectionStatus === "Connected" && (
          <OutspeedUI connection={connection} />
        )}
      </div>
    </div>
  );
}
