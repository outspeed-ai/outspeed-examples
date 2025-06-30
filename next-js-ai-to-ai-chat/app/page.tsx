"use client";

import { type SessionConfig } from "@outspeed/client";
import { useConversation } from "@outspeed/react";
import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface CharacterAvatarProps {
  name: string;
  initial: string;
  isSpeaking: boolean;
  speakingClasses: string;
  silentClasses: string;
  dotClasses: string;
}

function CharacterAvatar({ name, initial, isSpeaking, speakingClasses, silentClasses, dotClasses }: CharacterAvatarProps) {
  const avatarClasses = twMerge(
    "w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 border-4 shadow-lg",
    isSpeaking ? speakingClasses : silentClasses
  );

  const dotBaseClasses = "w-1 h-1 rounded-full animate-bounce";

  return (
    <div className="flex flex-col items-center w-32">
      <div className="w-28 h-28 flex items-center justify-center">
        <div className={avatarClasses}>
          {initial}
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{name}</p>
      <p className="text-xs text-gray-500">Debug: {isSpeaking ? "SPEAKING" : "SILENT"}</p>
      <div className="mt-1 h-2 flex justify-center items-center gap-1">
        {isSpeaking && (
          <>
            <div className={twMerge(dotBaseClasses, dotClasses)}></div>
            <div className={twMerge(dotBaseClasses, dotClasses)} style={{ animationDelay: '0.1s' }}></div>
            <div className={twMerge(dotBaseClasses, dotClasses)} style={{ animationDelay: '0.2s' }}></div>
          </>
        )}
      </div>
    </div>
  );
}

const getEphemeralKeyFromServer = async (config: SessionConfig) => {
  const tokenResponse = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  const data = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error("Failed to get ephemeral key");
  }

  return data.client_secret.value;
};

const sessionConfigMaya: SessionConfig = {
  model: "outspeed-v1",
  instructions: `You are Maya, a helpful, human-like AI for Outspeed. You are talking to Miles, another AI just like you.
Since you've to talk like a human, introduce disfluencies like "um", "ah", "like", "you know", etc.
You are not an assistant, you are an AI character that is having a human-like conversation to Miles.`,
  voice: "sophie", // find more voices at https://dashboard.outspeed.com (this will be improved soon!)
  temperature: 0.7,
  first_message: "Hey Miles, how are you doing?",
};

const sessionConfigMiles: SessionConfig = {
  model: "outspeed-v1",
  instructions: `You are Miles, a helpful, human-like AI for Outspeed. You are talking to Maya, another AI just like you.
Since you've to talk like a human, introduce disfluencies like "um", "ah", "like", "you know", etc.
You are not an assistant, you are an AI character that is having a human-like conversation to Maya.`,
  voice: "david", // find more voices at https://dashboard.outspeed.com (this will be improved soon!)
  temperature: 0.7,
};

export default function Home() {
  const [sessionCreated, setSessionCreated] = useState(false);
  const [mayaSpeaking, setMayaSpeaking] = useState(false);
  const [milesSpeaking, setMilesSpeaking] = useState(false);

  const conversationMaya = useConversation({
    sessionConfig: sessionConfigMaya,
    onDisconnect: () => {
      console.log("Maya Disconnected! cleaning up...");
      endSession();
    },
  });

  const conversationMiles = useConversation({
    sessionConfig: sessionConfigMiles,
    onDisconnect: () => {
      console.log("Miles Disconnected! cleaning up...");
      endSession();
    },
  });

  const startSession = async () => {
    try {
      // get ephemeral keys for both sessions
      const [ephemeralKeyOne, ephemeralKeyTwo] = await Promise.all([
        getEphemeralKeyFromServer(sessionConfigMaya),
        getEphemeralKeyFromServer(sessionConfigMiles),
      ]);

      // start session for Miles and wait for session.created event
      await conversationMiles.startSession(ephemeralKeyTwo);
      const milesSessionCreatedPromise = new Promise((resolve) => {
        conversationMiles.on("session.created", () => {
          conversationMiles.toggleMute(); // mute the input of conversation Miles so it doesn't capture audio from microphone
          resolve(true);
        });
      });
      await milesSessionCreatedPromise;

      // now we can start the session for Maya
      await conversationMaya.startSession(ephemeralKeyOne);
      conversationMaya.on("session.created", () => {
        conversationMaya.toggleMute(); // mute the input of conversation Maya so it doesn't capture audio from microphone
        setSessionCreated(true);
      });

      // Log all events for debugging
      const debugEvents = ['output_audio_buffer.started', 'output_audio_buffer.stopped', 'output_audio_buffer.commit', 'response.audio_transcript.delta', 'response.audio.delta', 'conversation.item.input_audio_transcription.completed'];
      debugEvents.forEach(event => {
        conversationMaya.on(event, (data) => {
          console.log(`🔵 Maya Event: ${event}`, data);
        });
        conversationMiles.on(event, (data) => {
          console.log(`🟢 Miles Event: ${event}`, data);
        });
      });

      let queuedMayaTranscript = "";
      conversationMaya.on("response.done", (event) => {
        const content = event.response.output[0].content[0];
        const transcript = content.transcript;
        if (typeof transcript === "string") {
          queuedMayaTranscript = transcript;
          console.log("stored Maya transcript", transcript);
        }
      });

      // Track Maya speaking using output_audio_buffer events
      conversationMaya.on("output_audio_buffer.started", () => {
        console.log("🗣️ Maya started speaking");
        setMayaSpeaking(true);
      });

      conversationMaya.on("output_audio_buffer.stopped", () => {
        console.log(`maya stopped speaking... sending ${queuedMayaTranscript} to Miles`);
        console.log("🔇 Maya stopped speaking");
        setMayaSpeaking(false);
        conversationMiles.sendText(queuedMayaTranscript); // todo: fix
      });

      let queuedMilesTranscript = "";
      conversationMiles.on("response.done", (event) => {
        const content = event.response.output[0].content[0];
        const transcript = content.transcript;
        if (typeof transcript === "string") {
          queuedMilesTranscript = transcript;
          console.log("stored Miles transcript", transcript);
        }
      });

      // Track Miles speaking using output_audio_buffer events
      conversationMiles.on("output_audio_buffer.started", () => {
        console.log("🗣️ Miles started speaking");
        setMilesSpeaking(true);
      });

      conversationMiles.on("output_audio_buffer.stopped", () => {
        console.log(`miles stopped speaking... sending ${queuedMilesTranscript} to Maya`);
        console.log("🔇 Miles stopped speaking");
        setMilesSpeaking(false);
        conversationMaya.sendText(queuedMilesTranscript);
      });
    } catch (error) {
      console.error("Error starting session", error);
    }
  };

  const endSession = async () => {
    try {
      await Promise.all([conversationMaya.endSession(), conversationMiles.endSession()]);
    } catch (error) {
      console.error("Error ending session", error);
    } finally {
      setSessionCreated(false);
      setMayaSpeaking(false);
      setMilesSpeaking(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Image src="/outspeed-logo.png" alt="Outspeed logo" width={32} height={32} priority />
              <span className="text-2xl text-gray-400">×</span>
              <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={120} height={26} priority />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voice AI-to-AI Chat</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              {"Powered by Outspeed's Live API with voice capabilities"}
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                  sessionCreated
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${sessionCreated ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                ></div>
                {sessionCreated ? "Session Active" : "Ready to Connect"}
              </div>

              {/* Character Avatars */}
              <div className="flex justify-center items-start gap-8 mb-8">
                <CharacterAvatar
                  name="Maya"
                  initial="M"
                  isSpeaking={mayaSpeaking}
                  speakingClasses="border-purple-500 shadow-purple-200 bg-gradient-to-br from-purple-400 to-pink-500"
                  silentClasses="border-gray-300 shadow-gray-200 bg-gradient-to-br from-purple-300 to-pink-400"
                  dotClasses="bg-purple-500"
                />

                <CharacterAvatar
                  name="Miles"
                  initial="M"
                  isSpeaking={milesSpeaking}
                  speakingClasses="border-blue-500 shadow-blue-200 bg-gradient-to-br from-blue-400 to-cyan-500"
                  silentClasses="border-gray-300 shadow-gray-200 bg-gradient-to-br from-blue-300 to-cyan-400"
                  dotClasses="bg-blue-500"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {sessionCreated ? "Conversation is Live" : "Start the Conversation"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {sessionCreated
                  ? "Listen to Maya and Miles talking to each other"
                  : "Click the button below to begin the conversation"}
              </p>

              {sessionCreated ? (
                <button
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  End Session
                </button>
              ) : (
                <button
                  onClick={startSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
