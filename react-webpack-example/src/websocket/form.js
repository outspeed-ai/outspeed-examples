import React from "react";
import {
  RealtimeForm,
  RealtimeAudioInput,
  RealtimeVideoInput,
  RealtimeFormButton,
  RealtimeFunctionURLInput,
  ConsoleLogger,
} from "@outspeed/react";

export function WebsocketTakeInput(props) {
  const { onSubmit } = props;
  const [functionURL, setFunctionURL] = React.useState(
    "http://localhost:8080/"
  );
  const [audioInput, setAudioInput] = React.useState();

  function submitForm() {
    onSubmit({
      functionURL,
      logger: ConsoleLogger.getLogger(),
      audio: audioInput
        ? {
            deviceId: audioInput,
            echoCancellation: true,
          }
        : undefined,
    });
  }

  return (
    <RealtimeForm className="my-4">
      <RealtimeFunctionURLInput
        value={functionURL}
        onChange={(e) => setFunctionURL(e.currentTarget.value)}
      />
      <RealtimeAudioInput value={audioInput} onChange={setAudioInput} />

      <RealtimeFormButton onClick={submitForm}>
        Update Config
      </RealtimeFormButton>
    </RealtimeForm>
  );
}
