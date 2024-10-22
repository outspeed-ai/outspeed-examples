import { MessageSquare } from "lucide-react";

export type TChatActionProps = {
  isEnabled: boolean;
  setIsEnabled: (state: boolean) => void;
};

export function ChatAction(props: TChatActionProps) {
  const { isEnabled, setIsEnabled } = props;

  return (
    <button
      className="rounded-full w-10 h-10 hidden sm:block"
      onClick={() => setIsEnabled(!isEnabled)}
    >
      {isEnabled ? (
        <MessageSquare className="h-5 w-5" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      )}
    </button>
  );
}
