import { setupWebRTCConnection } from "./setup-webrtc-connection";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>WebRTC App</h1>
  <form id="webRTC-form">
    <label>
      Function URL
      <input type="text" name="function-url" />
    </label>
    <label>Audio Devices
      <select name="audio" id="audio-list"></select>
    </label>
    <label>Video Devices
      <select name="video" id="video-list"></select>
    </label>
    <br />
    <button>Connect</button>
  </form>

  <form id="disconnect-form">
      <button>Disconnect</button>
  </form>
  <div id="connection-status">Connection Status: new </div>

  <h1>Local</h1>
  <div id="local-track">
  </div>

  <h1>Remote</h1>
  <div id="remote-track">
  </div>
`;

setupWebRTCConnection(
  document.getElementById("webRTC-form") as HTMLFormElement,
  document.getElementById("disconnect-form") as HTMLFormElement
);
