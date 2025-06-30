# Outspeed AI-to-AI Voice Chat

A modern AI-to-AI voice chat application built with Next.js and powered by Outspeed's Live API. This application demonstrates how two AI characters can have a natural voice conversation with each other.

## Features

- 🎤 **AI-to-AI Voice Conversation** - Watch two AI characters (Sophie and David) have a natural conversation
- 🗣️ **Human-like Speech** - AIs use disfluencies like "um", "ah", "like" to sound more natural
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 🚀 **Built with Next.js** - App Router, TypeScript, and Tailwind CSS
- 🔄 **Real-time Audio** - Live audio streaming between AI characters

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- An Outspeed API key (get one at [dashboard.outspeed.com](https://dashboard.outspeed.com))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/outspeed-ai/outspeed-examples.git
cd outspeed-examples/next-js-ai-to-ai-chat
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your API key:

```bash
# Required: Get your API key from https://dashboard.outspeed.com
OUTSPEED_API_KEY=your_outspeed_api_key_here
```

> **Important**: The `OUTSPEED_API_KEY` is required for the voice chat to work. Without it, you'll get authentication errors when trying to start a session.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## How to Use

1. **Start a Session**: Click the "Start Session" button to begin
2. **Listen**: Once connected, listen to Sophie and David have a natural conversation
3. **End Session**: Click "End Session" to stop the conversation

## How It Works

The application creates two AI characters:

- **Sophie**: Uses the "sophie" voice and initiates the conversation
- **David**: Uses the "david" voice and responds to Sophie

Both AIs are configured to:

- Speak in a human-like manner with natural disfluencies
- Have casual, friendly conversations
- Pass their spoken messages to each other to continue the dialogue

## API Key Setup

### Outspeed API Key (Required)

1. Visit [dashboard.outspeed.com](https://dashboard.outspeed.com)
2. Create an account or log in
3. Generate a new API key
4. Add it to your `.env` file as `OUTSPEED_API_KEY`

## Project Structure

```
next-js-ai-to-ai-chat/
├── app/
│   ├── api/
│   │   └── token/
│   │       └── route.ts          # API endpoint for Outspeed authentication
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main AI-to-AI chat application
├── public/                       # Static assets
├── .env                          # Environment variables (create this)
└── README.md                     # This file
```

## Character Configuration

Both AI characters are configured with:

- **Model**: `outspeed-v1`
- **Temperature**: `0.7` for natural variability
- **Instructions**: Custom prompts to make them sound human-like
- **Voices**: Different voices to distinguish between characters
- **Disfluencies**: Programmed to use "um", "ah", "like", etc.

## Troubleshooting

### Common Issues

1. **"OUTSPEED_API_KEY is required" error**

   - Make sure you've created `.env` with your API key
   - Restart your development server after adding the key

2. **401 Unauthorized when starting session**

   - Verify your Outspeed API key is correct
   - Check if your API key has the necessary permissions

3. **Audio issues**
   - Ensure your browser supports WebRTC
   - Check browser permissions for microphone access
   - Try refreshing the page if audio doesn't start

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](https://opensource.org/license/mit).
