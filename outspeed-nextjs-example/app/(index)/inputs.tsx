"use client";
import { useSearchParams } from "next/navigation";
import { WebSocketTakeInput } from "../_components/WebSocketTakeInput";
import { WebRTCTakeInput } from "../_components/WebRTCTakeInput";

export type TInputProps = {
  onSubmit: (
    config: {
      functionURL: string;
      audioDeviceId?: string;
      videoDeviceId?: string;
    },
    targetURL: string
  ) => void;
};

export function Inputs(props: TInputProps) {
  const { onSubmit } = props;
  const searchparams = useSearchParams();

  const inputType = searchparams.get("query");

  if (inputType === "" || inputType === "webrtc") {
    return (
      <WebRTCTakeInput onSubmit={(config) => onSubmit(config, "/webrtc")} />
    );
  }

  if (inputType === "websocket") {
    return (
      <WebSocketTakeInput
        onSubmit={(config) => onSubmit(config, "/websocket")}
      />
    );
  }

  return null;
}
