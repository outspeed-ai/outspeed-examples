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
      {/* Video section */}
      <div className="flex-1 items-center flex py-4" ref={container}>
        <div className="flex-1 justify-center overflow-hidden flex flex-col space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
          {!remoteTrack && (
            <>
              <div style={{ height: "16rem", width: "16rem" }}>
                <RealtimeAudioVisualizer
                  track={remoteAudioTrack}
                  threshold={120}
                />
              </div>
              <RealtimeAudio track={remoteAudioTrack} />
            </>
          )}
          {!localTrack && (
            <div style={{ height: "16rem", width: "16rem" }}>
              <RealtimeAudioVisualizer
                track={localAudioTrack}
                threshold={250}
              />
            </div>
          )}
        </div>
        {dataChannel && (
          <div
            className={`overflow-hidden transition-all self-end right-0 hidden sm:flex "w-[350px] ml-6 opacity-100" : "opacity-0 w-0"}`}
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
          <div className="flex flex-1 space-x-4 justify-center">
            <button className="rounded-full w-10 h-10" onClick={onCallEndClick}>
              <span className="h-5 w-5">Disconnect</span>
            </button>
            <button className="rounded-full w-10 h-10" onClick={handleOnToggle}>
              {isEnabled ? "Mute" : "Unmute"}
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
