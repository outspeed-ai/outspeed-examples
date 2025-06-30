# outspeed-cra-fastapi

# Voice Chat App

This project consists of a React frontend and a FastAPI backend.

## Prerequisites

- Node.js and npm
- Python 3.9+
- uv (for python package management)
- Outspeed API key (https://dashboard.outspeed.com)

## Running the Apps

Open two terminal windows/tabs in the project root directory.

### Frontend

Go to the frontend directory

```bash
cd react-app
```

#### 1. Install dependencies

```bash
npm install
```

#### 2. Start the React App

```bash
npm start
```

This will start the React development server at [http://localhost:3000](http://localhost:3000).

### Backend

Go to the backend directory

```bash
cd fastapi-backend
```

#### 1. Setup `OUTSPEED_API_KEY` in `.env`

In the backend, create a .env file and add your `OUTSPEED_API_KEY`

```bash
cp .env.example .env
```

#### 2. Setup the environment

```bash
uv sync # this will install all packages & create a virtual environment
source .venv/bin/activate
```

#### 3. Start the FastAPI Backend

```bash
uvicorn main:app --reload --port 8080
```

This will start the FastAPI server at [http://localhost:8080](http://localhost:8080).

### Notes:

- Make sure your FastAPI `main.py` is in the root directory or adjust the command accordingly.
- The React app expects the backend to be running at `http://localhost:8080` for the `/token` endpoint.
