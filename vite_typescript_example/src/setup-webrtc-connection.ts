import {
  getAllUserMedia,
  isRTCTrackEvent,
  RealtimeConnection,
  ConsoleLogger,
  TRealtimeConfig,
} from "@outspeed/core";

let connection: null | RealtimeConnection = null;

async function updateDeviceInputs(formElement: HTMLFormElement) {
  const audioSelectElement = formElement["audio"];
  const videoSelectElement = formElement["video"];
  const devices = await getAllUserMedia();

  for (const device of devices.audioInputDevices) {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.innerText = device.label;
    audioSelectElement.appendChild(option);
  }

  for (const device of devices.videoInputDevices) {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.innerText = device.label;
    videoSelectElement.appendChild(option);
  }
}

function appendAudio(stream: MediaStream, node: HTMLElement) {
  const audio = document.createElement("audio");
  audio.srcObject = stream;
  audio.autoplay = true;
  audio.style.display = "none";
  node.appendChild(audio);
}

function appendVideo(stream: MediaStream, node: HTMLElement) {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.style.height = "400px";
  video.style.width = "400px";
  video.playsInline = true;
  node.appendChild(video);
}

function _handleOnTrack(event: Event) {
  if (!isRTCTrackEvent(event)) {
    return;
  }

  const trackContainer = document.querySelector("#remote-track") as HTMLElement;

  if (!trackContainer) return;

  if (event.track.kind === "audio") {
    appendAudio(new MediaStream([event.track]), trackContainer);
  } else {
    appendVideo(new MediaStream([event.track]), trackContainer);
  }
}

function getConfig(formElement: HTMLFormElement): TRealtimeConfig {
  const functionURL = formElement["function-url"].value;
  const audio = formElement["audio"].value;
  const video = formElement["video"].value;

  return {
    functionURL,
    audio: {
      deviceId: audio,
    },
    video: {
      deviceId: video,
    },
    codec: {
      audio: "opus/48000/2",
    },
    logger: ConsoleLogger.getLogger(),
  };
}

async function setupConnection(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const config = getConfig(form);

  connection = new RealtimeConnection(config);
  connection.addEventListener("track", _handleOnTrack);

  document.querySelector("#connection-status")!.innerHTML =
    "Connection Status: Connecting";
  const response = await connection.connect();

  if (response.ok) {
    document.querySelector("#connection-status")!.innerHTML =
      "Connection Status: Connected";
    const trackContainer = document.querySelector("#local-track");

    appendAudio(
      connection.mediaManager.localStreams.audio[0].stream,
      trackContainer as HTMLElement
    );
    appendVideo(
      connection.mediaManager.localStreams.video[0].stream,
      trackContainer as HTMLElement
    );
  } else {
    document.querySelector("#connection-status")!.innerHTML =
      "Connection Status: Failed";
  }
}

function disconnect(event: Event) {
  event.preventDefault();
  if (connection) {
    connection.removeEventListener("track", _handleOnTrack);
    connection.disconnect();
    document.querySelector("#connection-status")!.innerHTML =
      "Connection Status: Disconnected";
  }

  document.querySelector("#local-track")!.innerHTML = "";
  document.querySelector("#remote-track")!.innerHTML = "";
  connection = null;
}

export function setupWebRTCConnection(
  formElement: HTMLFormElement,
  disconnectForm: HTMLFormElement
) {
  formElement.onsubmit = setupConnection;
  disconnectForm.onsubmit = disconnect;
  updateDeviceInputs(formElement);
}
