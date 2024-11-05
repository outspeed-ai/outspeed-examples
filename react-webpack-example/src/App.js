import React from "react";
import { WebRTCApp } from "./webrtc";
import Button from "./components/button";
import { WebSocketApp } from "./websocket";

export default function App() {
  const [app, setApp] = React.useState("");

  if (app === "webrtc") {
    return <WebRTCApp reset={() => setApp("")} />;
  }

  if (app === "websocket") {
    return <WebSocketApp reset={() => setApp("")} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold mb-4">Select App</h1>
      <div className="flex space-x-3">
        <Button className="" onClick={() => setApp("webrtc")}>
          WebRTC
        </Button>
        <Button onClick={() => setApp("websocket")}>WebSocket</Button>
      </div>
    </div>
  );
}
