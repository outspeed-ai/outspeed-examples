export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get the API key from environment variables
    const OUTSPEED_API_KEY = env.OUTSPEED_API_KEY;
    if (!OUTSPEED_API_KEY) {
      console.error("OUTSPEED_API_KEY is not set");
      return new Response(JSON.stringify({ detail: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const sessionConfig = await request.json();

    // Make request to Outspeed API
    const response = await fetch("https://api.outspeed.com/v1/realtime/sessions?source=react-cloudflare-example", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OUTSPEED_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Token generation error: ${errorText}`);
      return new Response(JSON.stringify({ detail: "Failed to generate token" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseData = await response.json();

    // Return successful response with CORS headers
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error(`Token generation error: ${error}`);
    return new Response(JSON.stringify({ detail: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle preflight requests for CORS
// export async function onRequestOptions(context) {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     },
//   });
// }
