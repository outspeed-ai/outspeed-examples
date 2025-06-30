"use client";

import { type SessionConfig } from "@outspeed/client";
import { useConversation } from "@outspeed/react";
import Image from "next/image";
import { useState } from "react";

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

  const conversationMaya = useConversation({
    sessionConfig: sessionConfigMaya,
    onDisconnect: () => {
      console.log("Maya Disconnected! cleaning up...");
      endSession();
    },
  });

  const conversationMiles = useConversation({
    sessionConfig: sessionConfigMaya,
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

      let queuedMayaTranscript = "";
      conversationMaya.on("response.done", (event) => {
        const content = event.response.output[0].content[0];
        const transcript = content.transcript;
        if (typeof transcript === "string") {
          queuedMayaTranscript = transcript;
          console.log("stored Maya transcript", transcript);
        }
      });

      conversationMaya.on("output_audio_buffer.stopped", () => {
        console.log(`maya stopped speaking... sending ${queuedMayaTranscript} to Miles`);
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

      conversationMiles.on("output_audio_buffer.stopped", () => {
        console.log(`miles stopped speaking... sending ${queuedMilesTranscript} to Maya`);
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
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
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

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {sessionCreated ? "Conversation is Live" : "Start the Conversation"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {sessionCreated
                  ? "Listen to AIs talking to each other"
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
