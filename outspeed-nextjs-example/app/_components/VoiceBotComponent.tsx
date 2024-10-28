import { RealtimeAudioVisualizer, RealtimeChat, Track } from "@outspeed/react";
import { DataChannel } from "@outspeed/react";
import React from "react";
import { RealtimeAudio } from "@outspeed/react";

export type TMeetingLayoutProps = {
  remoteTrack: Track | null;
  localTrack: Track | null;
  remoteAudioTrack: Track | null;
  localAudioTrack: Track | null;
  onCallEndClick: () => void;
  dataChannel?: DataChannel<unknown> | null;
  title: string;
};

export function MeetingLayout(props: TMeetingLayoutProps) {
  const {
    localAudioTrack,
    remoteAudioTrack,
    remoteTrack,
    onCallEndClick,
    dataChannel,
    title,
  } = props;
  const [isEnabled, setIsEnabled] = React.useState(true);

  function handleOnToggle() {
    if (!localAudioTrack) return;

    if (localAudioTrack.isMute()) {
      localAudioTrack.resume();
    } else {
      localAudioTrack.pause();
    }

    setIsEnabled((prevState) => !prevState);
  }

  return (
    <div className="flex flex-col flex-1 relative max-w-[calc(100vw-32px)] h-full">
      {/* Video and Chat Section */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch py-4 space-y-6 sm:space-y-0 sm:space-x-6">
        {/* Realtime Audio Visualizer Section */}
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-stretch w-full space-y-6 sm:space-y-0 sm:space-x-6">
          {!remoteTrack && (
            <div className="flex-1 flex flex-col items-center border border-gray-300 p-4">
              <div className="w-1/2 h-full">
                <RealtimeAudioVisualizer
                  track={remoteAudioTrack}
                  threshold={120}
                />
              </div>
              <RealtimeAudio track={remoteAudioTrack} />
            </div>
          )}
        </div>

        {/* Realtime Chat Section */}
        {dataChannel && (
          <div
            className="flex-1 flex flex-col h-full w-1/2"
            style={{ height: `${window.innerHeight - 225}px` }}
          >
            <RealtimeChat
              userLabel="You"
              avatarLabel="Outspeed"
              heading="Messages"
              dataChannel={dataChannel}
              noMessage="Your conversation will appear here."
            />
          </div>
        )}
      </div>

      {/* Call Section */}
      <div className="pb-4 flex">
        <div className="flex flex-1 p-4 rounded-md">
          <div className="flex-1 justify-start items-center space-x-4 hidden sm:flex"></div>
          <div className="flex flex-1 space-x-4 justify-center items-center">
            <button
              className="rounded-md px-4 py-2 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-colors duration-300 border border-red-700"
              onClick={onCallEndClick}
            >
              <span className="text-sm">Disconnect</span>
            </button>
            <button
              className="rounded-md px-4 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 border border-blue-700"
              onClick={handleOnToggle}
            >
              <span className="text-sm">{isEnabled ? "Mute" : "Unmute"}</span>
            </button>
          </div>
          <div className="flex-1 justify-end items-center hidden sm:flex">
            <span className="font-bold text-muted">{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
