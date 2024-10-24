"use client"
import { RealtimeAudio, RealtimeAudioVisualizer, useWebRTC } from "@outspeed/react";

const OutspeedUI = ({ connection }) => {
    return (<>
    <RealtimeAudio track={connection.getRemoteAudioTrack()} />
    <button onClick={() => connection.getLocalAudioTrack().pause()}>mute</button>
    <button onClick={() => connection.getLocalAudioTrack().resume()}>unmute</button>
    <button onClick={() => connection.dataChannel.send("hello")}>send message </button>
    </>)
}

export default function Page() {
  const connection = useWebRTC({
    config: {
      functionURL: "https://infra.outspeed.com/run/58179982af68b222891be12b9a2b356d",
      audio: {
        deviceId: "",
        echoCancellation: true,
      },
    },
  });

  const connectToOutspeed = () => {
    connection.connect()
  }

  const disconnectFromOutspeed = () => {
    connection.disconnect()
  }

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <div>
        {connection.connectionStatus === 'Connected' ? (
          <button onClick={disconnectFromOutspeed}>Disconnect</button>
        ) : (
          <button onClick={connectToOutspeed}>Connect</button>
        )}
        {connection.connectionStatus === 'Connected' && (
            <OutspeedUI connection={connection}/>
        )}
      </div>
    </div>
  );
}