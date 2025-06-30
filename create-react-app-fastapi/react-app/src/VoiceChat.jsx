import React, { useState } from 'react';
import { useConversation } from '@outspeed/react';

const getEphemeralKeyFromServer = async (config) => {
  const tokenResponse = await fetch('http://localhost:8080/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  const data = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error('Failed to get ephemeral key');
  }

  return data.client_secret.value;
};

const sessionConfig = {
  model: 'outspeed-v1',
  instructions: 'Speak directly and briefly. Respond with concise, helpful answers.',
  voice: 'david',
  turn_detection: {
    type: 'semantic_vad',
  },
  first_message: 'Hello, how can I assist you with Outspeed today?',
};

export default function VoiceChat() {
  const [sessionCreated, setSessionCreated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    sessionConfig: sessionConfig,
  });

  const startSession = async () => {
    try {
      setIsConnecting(true);
      const ephemeralKey = await getEphemeralKeyFromServer(sessionConfig);
      await conversation.startSession(ephemeralKey);

      // Listen for session creation event
      conversation.on('session.created', (event) => {
        console.log('Session created:', event);
        setSessionCreated(true);
        setIsConnecting(false);
      });

    } catch (error) {
      console.error('Error starting session:', error);
      setIsConnecting(false);
    }
  };

  const endSession = async () => {
    try {
      await conversation.endSession();
      setSessionCreated(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (isConnecting) {
    return (
      <div className="voice-chat">
        <h2>Connecting...</h2>
        <p>Please wait while we establish the connection.</p>
      </div>
    );
  }

  if (sessionCreated) {
    return (
      <div className="voice-chat">
        <h2>🎙️ Voice Chat Active</h2>
        <p>You can now speak with the AI assistant!</p>
        <button onClick={endSession} className="end-button" style={{ fontSize: '1.5rem', padding: '1rem 2.5rem', borderRadius: '0.5rem', fontWeight: 'bold', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
          End Session
        </button>
      </div>
    );
  }

  return (
    <div className="voice-chat">
      <h2>Voice AI Assistant</h2>
      <p>Click the button below to start a voice conversation.</p>
      <button onClick={startSession} className="start-button" style={{ fontSize: '1.5rem', padding: '1rem 2.5rem', borderRadius: '0.5rem', fontWeight: 'bold', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
        Start Voice Chat
      </button>
    </div>
  );
} 