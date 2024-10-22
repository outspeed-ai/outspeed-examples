import { PhoneOff } from "lucide-react";

export type TDisconnectActionProps = {
  onClick: () => void;
};

export function DisconnectAction(props: TDisconnectActionProps) {
  const { onClick } = props;
  return (
    <button className="rounded-full w-10 h-10" onClick={onClick}>
      <PhoneOff className="h-5 w-5" />
    </button>
  );
}
