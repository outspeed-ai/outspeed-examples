import React from "react";
import {
  RealtimeFunctionURLInput,
  RealtimeAudioInput,
  RealtimeFormButton,
} from "@outspeed/react";
import { useSearchParams } from "next/navigation";

export type TWebRTCTakeInputProps = {
  onSubmit: (config: {
    functionURL: string;
    audioDeviceId?: string;
    videoDeviceId?: string;
  }) => void;
};

export function WebRTCTakeInput(props: TWebRTCTakeInputProps) {
  const { onSubmit } = props;
  const [audioDeviceId, setAudioDeviceId] = React.useState("");
  const [videoDeviceId, setVideoDeviceId] = React.useState("");
  const queryParams = useSearchParams();
  const initialFunctionURL =
    queryParams.get("functionURL") || "http://localhost:8080";
  const [functionURL, setFunctionURL] = React.useState(initialFunctionURL);
  const [isMediaMissing, setIsMediaMissing] = React.useState(false);
  const [isFunctionURLMissing, setIsFunctionURLMissing] = React.useState(false);

  function handleOnMediaInputChange(kind: "audio" | "video", value: string) {
    setIsMediaMissing(false);

    switch (kind) {
      case "audio":
        setAudioDeviceId(value);
        break;
      case "video":
        setVideoDeviceId(value);
        break;
    }
  }

  function handleFormSubmit() {
    let isFormValid = true;
    if (!audioDeviceId && !videoDeviceId) {
      setIsMediaMissing(true);
      isFormValid = false;
    }

    if (!functionURL) {
      setIsFunctionURLMissing(true);
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }

    try {
      const config = {
        functionURL,
        audioDeviceId,
      };
      onSubmit(config);
    } catch (error) {
      console.error("Unable to create config", error);
    }
  }

  return (
    <div className="space-y-6 max-w-lg relative z-10">
      <div className="font-bold text-3xl mb-8">WebRTC</div>
      <RealtimeFunctionURLInput
        isError={isFunctionURLMissing}
        onChange={(e) => {
          setIsFunctionURLMissing(false);
          setFunctionURL(e.currentTarget.value);
        }}
        value={functionURL}
        description="Once you've deployed your WebRTC backend application, you'll receive a URL. If you are running your backend locally, use http://localhost:8080."
        errorMsg={isFunctionURLMissing ? "Function url is required." : ""}
      />
      <RealtimeAudioInput
        isError={isMediaMissing}
        value={audioDeviceId}
        onChange={(value) => handleOnMediaInputChange("audio", value)}
        description="Select the microphone you want to use. If you don't see your microphone, make sure it is plugged in."
        errorMsg={
          isMediaMissing ? "Either audio or video input is required." : ""
        }
      />
      <RealtimeFormButton onClick={handleFormSubmit}>Run</RealtimeFormButton>
    </div>
  );
}
