import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx

load_dotenv()

OUTSPEED_API_KEY = os.getenv("OUTSPEED_API_KEY")
if not OUTSPEED_API_KEY:
    raise ValueError("OUTSPEED_API_KEY is not set")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend's URL instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# use CORS middleware if needed

@app.post("/token")
async def create_token(request: Request):
    try:
        session_config = await request.json()
        # Create session with Outspeed API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.outspeed.com/v1/realtime/sessions",
                headers={
                    "Authorization": f"Bearer {OUTSPEED_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=session_config,
            )

            if not response.is_success:
                error_text = response.text
                print(f"Token generation error: {error_text}")
                raise HTTPException(
                    status_code=response.status_code, detail="Failed to generate token"
                )

            return response.json()

    except Exception as e:
        print(f"Token generation error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")