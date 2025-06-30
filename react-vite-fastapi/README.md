# Outspeed Sample App

A React web app that demonstrates real-time voice conversations using Outspeed's API.

## Requirements

- `python` and `uv` for server
- `node` and `npm` for client (React)
- Outspeed API key
- OpenWeatherMap API key (for weather functionality)

## Setup

### 1. Environment Variables

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
OUTSPEED_API_KEY=your_outspeed_api_key_here
```

#### Client Environment Variables

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Update the `.env` file in the root directory with your API keys:

```bash
VITE_OPEN_WEATHER_MAP_API_KEY=your_openweathermap_api_key_here
```

The `VITE_OPEN_WEATHER_MAP_API_KEY` is required for the `get_weather` client tool to function properly. You can get your API key from [OpenWeatherMap](https://openweathermap.org/api).

### 2. Server Setup

Go to server directory:

```bash
cd server
```

Install dependencies:

```bash
uv sync
```

Run the server:

```bash
uv run fastapi dev server.py
```

The server will start on `http://127.0.0.1:8000`

### 3. Client Setup

Install dependencies:

```bash
npm install
```

> [!NOTE]
> This will install `@outspeed/client` and `@outspeed/react`.

Start the React app:

```bash
npm run dev
```

## Usage

1. Make sure the server is running on port 8000
2. Open the React app in your browser
3. Click "Start Session" to begin a voice conversation
4. Speak with the AI assistant (configured as a helpful but witty assistant with "sophie" voice)
5. Click "Stop Session" to end the conversation

The app uses semantic voice activity detection, which intelligently detects when you've finished speaking (vs. just pausing) to minimize interruptions. For example, it won't interrupt you when you say "uh" or pause briefly while thinking.
