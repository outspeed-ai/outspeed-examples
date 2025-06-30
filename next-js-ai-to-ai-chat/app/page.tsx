"use client";

import { type SessionConfig, providers } from "@outspeed/client";
import { useConversation } from "@outspeed/react";
import Image from "next/image";
import { useRef, useState } from "react";

import CharacterAvatar from "@/app/_components/CharacterAvatar";

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
};

const sessionConfigMiles: SessionConfig = {
  model: "outspeed-v1",
  instructions: `You are Miles, a helpful, human-like AI for Outspeed. You are talking to Maya, another AI just like you.
Since you've to talk like a human, introduce disfluencies like "um", "ah", "like", "you know", etc.
You are not an assistant, you are an AI character that is having a human-like conversation to Maya.`,
  voice: "david", // find more voices at https://dashboard.outspeed.com (this will be improved soon!)
  temperature: 0.7,
};

type UseConversationReturnType = ReturnType<typeof useConversation>;
type CharacterId = "maya" | "miles";

export default function Home() {
  const [sessionCreated, setSessionCreated] = useState(false);
  const [mayaSpeaking, setMayaSpeaking] = useState(false);
  const [milesSpeaking, setMilesSpeaking] = useState(false);
  const queuedTranscriptRef = useRef<Record<CharacterId, string>>({
    maya: "",
    miles: "",
  });

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

  /**
   * Start session for a character and wait for session.created event.
   * Mute the input of conversation so it doesn't capture audio from microphone.
   * Log all events for debugging.
   * Track which character is speaking using output_audio_buffer events.
   * Send this character's transcript to the other character.
   *
   * @param sessionConfig - The session configuration for the character.
   * @param conversation - The conversation instance for the character.
   * @param characterId - The ID of the character.
   * @param otherConversation - The conversation instance for the other character.
   * @returns
   */
  const startCharacterSession = async (
    sessionConfig: SessionConfig,
    conversation: UseConversationReturnType,
    characterId: CharacterId,
    otherConversation: UseConversationReturnType,
    setSpeaking: (speaking: boolean) => void
  ) => {
    const ephemeralKey = await getEphemeralKeyFromServer(sessionConfig);

    await conversation.startSession(ephemeralKey);

    const sessionCreatedPromise: Promise<UseConversationReturnType> = new Promise((resolve) => {
      conversation.on("session.created", () => {
        conversation.toggleMute(); // mute the input of conversation so it doesn't capture audio from microphone
        resolve(conversation);
      });
    });

    // Log all events for debugging
    const debugEvents = [
      "output_audio_buffer.started",
      "output_audio_buffer.stopped",
      "output_audio_buffer.commit",
      "response.audio_transcript.delta",
      "response.audio.delta",
      "conversation.item.input_audio_transcription.completed",
    ];
    debugEvents.forEach((event) => {
      conversation.on(event, (data) => {
        console.log(`${characterId === "maya" ? "🔵" : "🟢"} ${characterId} Event: ${event}`, data);
      });
    });

    conversation.on("response.done", (event) => {
      const content = event.response.output[0].content[0];
      const transcript = content.transcript;
      if (typeof transcript === "string") {
        queuedTranscriptRef.current[characterId] = transcript;
        console.log(`stored ${characterId} transcript:`, transcript);
      }
    });

    // Track which character is speaking using output_audio_buffer events
    conversation.on("output_audio_buffer.started", () => {
      console.log(`🗣️ ${characterId} started speaking`);
      setSpeaking(true);
    });

    conversation.on("output_audio_buffer.stopped", () => {
      const transcript = queuedTranscriptRef.current[characterId];
      console.log(`${characterId} stopped speaking... sending "${transcript}" to the other character`);

      setSpeaking(false);

      // Send this character's transcript to the other character
      otherConversation.sendText(transcript);
    });

    conversation.on("error", console.error);

    return sessionCreatedPromise;
  };

  const startSession = async () => {
    try {
      // Start Miles session first and wait for session.created event
      await Promise.all([
        startCharacterSession(sessionConfigMiles, conversationMiles, "miles", conversationMaya, setMilesSpeaking),
        startCharacterSession(sessionConfigMaya, conversationMaya, "maya", conversationMiles, setMayaSpeaking),
      ]);
      setSessionCreated(true);

      // make Maya speak first
      await conversationMaya.speak("Hey Miles, how are you doing?");
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
              <div className="flex justify-center items-center gap-16 mb-8">
                <CharacterAvatar
                  name="Maya"
                  initial="Ma"
                  sessionStarted={sessionCreated}
                  isSpeaking={mayaSpeaking}
                  speakingClasses="border-purple-400 shadow-purple-300 bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl scale-110"
                  silentClasses="border-purple-200 shadow-purple-100 bg-gradient-to-br from-purple-400 to-pink-400"
                  dotClasses="bg-purple-400"
                />

                <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>

                <CharacterAvatar
                  name="Miles"
                  initial="Mi"
                  sessionStarted={sessionCreated}
                  isSpeaking={milesSpeaking}
                  speakingClasses="border-blue-400 shadow-blue-300 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl scale-110"
                  silentClasses="border-blue-200 shadow-blue-100 bg-gradient-to-br from-blue-400 to-cyan-400"
                  dotClasses="bg-blue-400"
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
