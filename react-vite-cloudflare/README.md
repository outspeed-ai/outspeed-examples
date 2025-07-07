# Outspeed Voice AI - Cloudflare Pages Demo

A React app demonstrating real-time voice conversations using Outspeed's Voice AI SDK, deployed on Cloudflare Pages with Functions.

## Features

- Real-time voice conversations with AI
- Semantic voice activity detection
- Serverless backend with global edge deployment
- Client-side tools (weather functionality)

## Requirements

- Node.js and npm
- Cloudflare account
- Outspeed API key
- OpenWeatherMap API key

## Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .dev.vars.example .dev.vars
   ```

   Edit `.dev.vars` with your API keys:

   ```bash
   OUTSPEED_API_KEY=your_outspeed_api_key_here
   ```

3. **Create `.env` file** for client-side variables:

   ```bash
   VITE_OPEN_WEATHER_MAP_API_KEY=your_openweathermap_api_key_here
   ```

4. **Run development server**:
   ```bash
   npm run wrangler:dev
   ```

The app will be available at `http://localhost:8788`

## Deployment

### Cloudflare Pages (Git Integration)

1. Push code to Git repository
2. Connect to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Set environment variables:
   - `OUTSPEED_API_KEY`
   - `VITE_OPEN_WEATHER_MAP_API_KEY`

### Manual Deployment

```bash
npm run build
npx wrangler pages deploy dist --project-name=outspeed-voice-demo
```

## Usage

1. Open the app
2. Click "Start Session" to begin voice conversation
3. Speak with the AI assistant
4. Click "Stop Session" to end

The app uses semantic voice activity detection to intelligently detect when you've finished speaking.

## Architecture

- **Frontend**: React + Vite with Outspeed SDK (deployed to Cloudflare Pages)
- **Backend**: Cloudflare Functions (`/functions/token.js`)

## API

- **POST /token**: Generates session token for voice chat

## Troubleshooting

- **API key errors**: Set `OUTSPEED_API_KEY` in Cloudflare Pages environment variables
- **Weather tool issues**: Verify `VITE_OPEN_WEATHER_MAP_API_KEY` is set correctly
- **CORS errors**: Ensure proper function headers (already configured)

## Learn More

- [Outspeed Documentation](https://docs.outspeed.com/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Functions](https://developers.cloudflare.com/pages/functions/)
