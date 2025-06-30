import { twMerge } from "tailwind-merge";

interface CharacterAvatarProps {
  name: string;
  initial: string;
  sessionStarted: boolean;
  isSpeaking: boolean;
  speakingClasses: string;
  silentClasses: string;
  dotClasses: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  name,
  initial,
  sessionStarted,
  isSpeaking,
  speakingClasses,
  silentClasses,
  dotClasses,
}) => {
  const avatarClasses = twMerge(
    "w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-base transition-all duration-500 border-2 relative",
    isSpeaking ? speakingClasses : silentClasses
  );

  const dotBaseClasses = "w-2 h-2 rounded-full animate-pulse";

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div className={avatarClasses}>
          {initial}
          {isSpeaking && (
            <div className="absolute -inset-1 rounded-full border-2 border-current opacity-30 animate-ping"></div>
          )}
        </div>
        <div className="flex justify-center mt-2 h-3">
          {isSpeaking && (
            <div className="flex items-center gap-1">
              <div className={twMerge(dotBaseClasses, dotClasses)}></div>
              <div className={twMerge(dotBaseClasses, dotClasses)} style={{ animationDelay: "0.2s" }}></div>
              <div className={twMerge(dotBaseClasses, dotClasses)} style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</p>

        {sessionStarted && (
          <p
            className={`text-xs font-medium ${
              isSpeaking ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isSpeaking ? "Speaking..." : "Listening"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CharacterAvatar;
