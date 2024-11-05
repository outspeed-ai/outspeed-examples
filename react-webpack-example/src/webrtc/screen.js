import React from "react";
import {
  RealtimeAudio,
  RealtimeAudioVisualizer,
  RealtimeVideo,
  useWebRTC,
  ERealtimeConnectionStatus,
} from "@outspeed/react";

export function WebRTCScreen(props) {
  const { config, onDisconnect } = props;

  const {
    connect,
    disconnect,
    reset,
    connectionStatus,
    localAudioTrack,
    localVideoTrack,
    remoteAudioTrack,
    remoteVideoTrack,
  } = useWebRTC({ config });

  function makeConnection() {
    connect();
  }

  function handleDisconnect() {
    disconnect();
    onDisconnect();
  }

  React.useEffect(() => {
    connect();
  }, []);

  return (
    <div className="p-4">
      <details className="font-bold">
        <summary>Config</summary>
        <pre>
          <code>{JSON.stringify(config, undefined, 2)}</code>
        </pre>
      </details>
      <h1 className="font-bold my-4 text-xl">
        Connection Status: {connectionStatus}
      </h1>

      <div className="flex flex-col space-x-4">
        <div className="flex space-x-4">
          {connectionStatus === ERealtimeConnectionStatus.Connected && (
            <button
              className="px-4 py-2 border border-teal-500 text-teal-500 font-semibold rounded hover:bg-teal-500 hover:text-black transition duration-150"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          )}
          {connectionStatus === ERealtimeConnectionStatus.New && (
            <button
              className="px-4 py-2 border border-teal-500 text-teal-500 font-semibold rounded hover:bg-teal-500 hover:text-black transition duration-150"
              onClick={makeConnection}
            >
              Connect
            </button>
          )}

          {/* 
            Having this to test retry.
            Will add reset after updating `@outspeed`
          */}
          {connectionStatus !== ERealtimeConnectionStatus.New && (
            <button
              className="px-4 py-2 border border-teal-500 text-teal-500 font-semibold rounded hover:bg-teal-500 hover:text-black transition duration-150"
              onClick={reset}
            >
              Will add Reset after updating `@outspeed`.
            </button>
          )}
        </div>

        {connectionStatus === ERealtimeConnectionStatus.Connected && (
          <div className="flex flex-wrap space-x-2 space-y-2">
            <div>
              <h4>Local video</h4>
              <div className="h-96 w-96">
                <RealtimeVideo track={localVideoTrack} />
              </div>
            </div>
            <div>
              <h4>Remote video</h4>
              <div className="h-96 w-96">
                <RealtimeVideo track={remoteVideoTrack} />
              </div>
            </div>

            <div>
              <h4>Local Audio</h4>
              <div className="h-96 w-96">
                <RealtimeAudioVisualizer track={localAudioTrack} />
              </div>
            </div>

            <div>
              <h4>Remote Audio</h4>
              <div className="h-96 w-96">
                <RealtimeAudioVisualizer track={remoteAudioTrack} />
                <RealtimeAudio track={remoteAudioTrack} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
