import React from "react";

import {
  RealtimeForm,
  RealtimeAudioInput,
  RealtimeVideoInput,
  RealtimeFormButton,
  RealtimeFunctionURLInput,
  ConsoleLogger,
} from "@outspeed/react";

export function WebRTCTakeInput(props) {
  const { onSubmit } = props;
  const [functionURL, setFunctionURL] = React.useState(
    "http://localhost:8080/"
  );
  const [audioInput, setAudioInput] = React.useState();
  const [videoInput, setVideoInput] = React.useState();
  const [audioCodec, setAudioCodec] = React.useState("default");

  function submitForm() {
    onSubmit({
      functionURL,
      logger: ConsoleLogger.getLogger(),
      audio: audioInput
        ? {
            deviceId: audioInput,
          }
        : undefined,
      video: videoInput
        ? {
            deviceId: videoInput,
          }
        : undefined,
      codec: {
        audio: audioCodec,
      },
    });
  }

  return (
    <RealtimeForm className="my-4">
      <RealtimeFunctionURLInput
        value={functionURL}
        onChange={(e) => setFunctionURL(e.currentTarget.value)}
      />
      <RealtimeAudioInput value={audioInput} onChange={setAudioInput} />
      <RealtimeVideoInput value={videoInput} onChange={setVideoInput} />
      <div className="space-y-2">
        <p className="font-medium">Select Audio Codec:</p>
        <div className="flex flex-col space-y-2">
          {["opus/48000/2", "PCMA/8000", "PCMU/8000", "default"].map(
            (codec) => (
              <label key={codec} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={codec}
                  checked={audioCodec === codec}
                  onChange={() => setAudioCodec(codec)}
                  className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{codec}</span>
              </label>
            )
          )}
        </div>
      </div>
      <RealtimeFormButton onClick={submitForm}>
        Update Config
      </RealtimeFormButton>
    </RealtimeForm>
  );
}
