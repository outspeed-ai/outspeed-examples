import React from "react";
/**
 * `@outspeed/react` components are built using
 * tailwind css, so we are importing the base css
 * here.
 */
import "@outspeed/react/styles.css";
import Button from "../components/button";
import { WebsocketTakeInput } from "./form";
import { WebsocketScreen } from "./screen";

export function WebSocketApp(props) {
  const { reset } = props;
  const [config, setConfig] = React.useState(null);

  function handleDisconnect() {
    setConfig(null);
  }

  return (
    <div className="p-4">
      <Button onClick={reset}>Go back</Button>
      <br />
      <WebsocketTakeInput onSubmit={(c) => setConfig(c)} />
      {config && (
        <WebsocketScreen config={config} onDisconnect={handleDisconnect} />
      )}
    </div>
  );
}
