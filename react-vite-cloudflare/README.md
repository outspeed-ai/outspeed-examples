# Outspeed Voice AI - Cloudflare Pages Demo

A React app demonstrating real-time voice conversations using Outspeed's Voice AI SDK, deployed on Cloudflare Pages with Functions.

## Features

- Real-time voice conversations with AI
- Semantic voice activity detection
- Serverless backend with [cloudflare functions](https://developers.cloudflare.com/pages/functions/get-started/)
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

5. Go to [http://localhost:8788](http://localhost:8788)

## Deployment

### Using wrangler CLI

1. Create a new project on cloudflare using

   ```bash
   npx wrangler pages project create outspeed-react-vite-cloudflare-example
   ```

   Note: `outspeed-react-vite-cloudflare-example` is the name that's configured in `wrangler.jsonc`.

   > [!NOTE] > `outspeed-react-vite-cloudflare-example` is the name that's configured in `wrangler.jsonc`,
   > so if you change it while running the create command, you need to update it in `wrangler.jsonc` as well.

2. Add environment variables. Make sure that there's a `.dev.vars` file for functions and a `.env` file for frontend.

   ```bash
   npx wrangler pages secret bulk .dev.vars
   ```

   ```bash
   npx wrangler pages secret bulk .env
   ```

3. Run `npm run deploy`. It uses [`wrangler pages deploy` command](https://developers.cloudflare.com/workers/wrangler/commands/#deploy-1).

### Using GitHub

1. Push code to Git repository
2. Connect to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. [Set environment variables](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables):
   - `OUTSPEED_API_KEY` - (for backend)
   - `VITE_OPEN_WEATHER_MAP_API_KEY` - (for frontend to use get_weather tool)

For more details, see [Deploy a Vite 3 project](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/).

## Usage

1. Open the app
2. Click "Start Session" to begin voice conversation
3. Speak with the AI assistant
4. Click "End Session" to end

The app uses semantic voice activity detection to intelligently detect when you've finished speaking.

## Architecture

- **Frontend**: React + Vite with Outspeed SDK (deployed to Cloudflare Pages)
- **Backend**: Cloudflare Functions ([`/functions/token.js`](./functions/token.js))

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
