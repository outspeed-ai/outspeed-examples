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
    localTrack,
    localAudioTrack,
    remoteAudioTrack,
    remoteTrack,
    onCallEndClick,
    dataChannel,
    title,
  } = props;
  const [isEnabled, setIsEnabled] = React.useState(true);

  const [isChatOpened, setIsChatOpened] = React.useState(true);
  const container = React.useRef<HTMLDivElement>(null);

  const handleResize = React.useCallback(() => {
    if (!container.current) return;

    const parent = container.current.parentElement;
    if (!parent) return;

    container.current.style.maxWidth = parent.clientWidth + "px";
  }, []);

  function handleOnToggle() {
    if (!localAudioTrack) return;

    if (localAudioTrack.isMute()) {
      localAudioTrack.resume();
    } else {
      localAudioTrack.pause();
    }

    setIsEnabled((prevState) => !prevState);
  }

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="flex flex-col flex-1 relative max-w-[calc(100vw-32px)]">
      {/* Video and Chat Section */}
      <div
        className="flex-1 flex flex-col sm:flex-row items-center py-4"
        ref={container}
      >
        <div className="flex-1 flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-6 w-full">
          {/* Realtime Audio Visualizer */}
          {!remoteTrack && (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-32">
                <RealtimeAudioVisualizer
                  track={remoteAudioTrack}
                  threshold={120}
                />
              </div>
              <RealtimeAudio track={remoteAudioTrack} />
            </div>
          )}
          {!localTrack && (
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-32">
                <RealtimeAudioVisualizer
                  track={localAudioTrack}
                  threshold={250}
                />
              </div>
            </div>
          )}
        </div>
        {/* Realtime Chat */}
        {dataChannel && isChatOpened && (
          <div
            className="flex-1 overflow-hidden transition-all self-start sm:flex w-full sm:w-1/3 ml-0 sm:ml-6 opacity-100"
            style={{ height: `${window.innerHeight - 225}px` }}
          >
            <div className="w-full h-full flex">
              <RealtimeChat
                onCloseButtonClick={() => setIsChatOpened(false)}
                userLabel="You"
                avatarLabel="Outspeed"
                heading="Messages"
                dataChannel={dataChannel}
                noMessage="Your conversation will appear here."
              />
            </div>
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
