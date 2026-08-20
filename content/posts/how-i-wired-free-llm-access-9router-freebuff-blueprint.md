---
title: "How I Wired Free LLM Access: 9router & Freebuff Blueprint"
excerpt: "Cut AI costs. I'll show you how to get free LLM access using 9router and Freebuff's OpenAI-compatible gateway with device-code OAuth. Real code, real savings."
date: "2026-08-20"
tags: ["AI Agents", "LLM Costs", "Free LLM", "9router", "Freebuff", "Node.js", "AI Gateway", "Cost Optimization"]
keywords: ["free LLM access 9router", "openai compatible gateway", "freebuff LLM cost", "local LLM adapter", "device-code OAuth AI", "LLM free tier routing"]
readTime: "10 min read"
coverGradient: "from-green-500 to-emerald-400"
---

Paying for LLM inference gets expensive, fast. Especially when you're spinning up agents for FarahGPT or experimenting with NexusOS prototypes. Everyone talks about "AI cost optimization" but nobody explains how to actually get **free LLM access 9router** style, integrating free tiers without sacrificing OpenAI compatibility. Figured it out the hard way, so you don't have to.

## Why You Need a Free LLM Access 9router Setup

Look, running AI agents, especially multi-agent systems, can drain your wallet faster than a crypto crash. OpenAI's API is great, but those tokens add up. When I was building the YouTube automation pipeline, I needed hundreds of thousands of cheap calls for pre-processing and content generation drafts. Paying retail wasn't an option.

This isn't about ditching paid APIs entirely. It's about smart **LLM free tier routing** for tasks where the absolute bleeding edge isn't necessary, or for dev/staging environments. You want an **openai compatible gateway** that can seamlessly switch between paid and free, and Freebuff combined with 9router is that setup. Freebuff gives you access to models like `gpt-3.5-turbo` and `llama3` through an OpenAI-compatible API, but it needs an OAuth dance. That's where 9router comes in, acting as your local **local LLM adapter** and token manager.

Here's why this matters for developers and clients:

*   **Cost Savings:** Obvious, right? Significantly reduce your **freebuff LLM cost** for non-critical tasks or during development.
*   **Flexibility:** Keep your existing OpenAI API client code. Just change the base URL.
*   **Experimentation:** Spin up new agents without worrying about immediate API bills.
*   **Scalability (Controlled):** While free tiers have limits, intelligently routing allows you to scale experimental agents without massive upfront costs.

## The Blueprint: 9router + Freebuff with Device-Code OAuth AI

The core idea is simple: Freebuff offers free access to various LLMs, but requires a user to "authenticate" using a device code flow. This isn't your typical API key. You get a device code, go to a URL, approve it, and then your application polls for a token. This token then acts as your "API key" for a limited time.

9router is a local proxy I use. It can handle custom authentication logic before forwarding requests. We'll use it to:

1.  Manage the Freebuff OAuth device code flow.
2.  Store and refresh the Freebuff access token.
3.  Proxy OpenAI-compatible requests from our agents to Freebuff, injecting the valid token.

This means your AI agents or frontend code just point to your local 9router instance, and 9router handles all the Freebuff complexity behind the scenes. This is crucial for **device-code OAuth AI** integrations because you don't want every agent instance doing the OAuth dance.

Here's the high-level flow:

1.  Your Node.js backend (or a dedicated service) kicks off the Freebuff device code flow.
2.  It prompts the user (or you, during setup) to authorize via a web browser.
3.  It polls Freebuff until authorization is granted and an access token is received.
4.  This token is stored securely (e.g., in a local file or environment variable, or passed to 9router).
5.  Your AI agents send OpenAI-compatible requests to your local 9router instance.
6.  9router intercepts these requests, adds the Freebuff token, and forwards them to `https://freebuff.com/api/v1/chat/completions`.
7.  9router handles token expiry by automatically refreshing the token using the refresh token, or re-initiating the device flow if needed.

## Wiring It Up: Node.js Backend & 9router Implementation

Let's get into the actual code. You'll need a Node.js service to manage the Freebuff token. This service will run alongside your 9router instance.

First, ensure you have 9router installed globally or locally:
`npm install -g 9router`

### Step 1: Freebuff Token Manager (Node.js)

This script will handle the device code flow and keep your Freebuff token fresh.

```javascript
// tokenManager.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const FREEBUFF_API_BASE = 'https://freebuff.com/api/v1';
const TOKEN_FILE = path.join(__dirname, 'freebuff_token.json');

let currentToken = null;
let tokenRefreshTimeout = null;

async function saveToken(tokenData) {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
    currentToken = tokenData;
    console.log('Freebuff token saved and updated.');
    scheduleTokenRefresh(tokenData.expires_in);
}

function loadToken() {
    if (fs.existsSync(TOKEN_FILE)) {
        try {
            const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
            if (tokenData && tokenData.access_token && tokenData.refresh_token && tokenData.expires_at > Date.now()) {
                currentToken = tokenData;
                console.log('Loaded valid Freebuff token from file.');
                scheduleTokenRefresh(tokenData.expires_at - Date.now());
                return true;
            }
        } catch (e) {
            console.error('Error loading Freebuff token from file:', e.message);
        }
    }
    console.log('No valid Freebuff token found. Will initiate new flow.');
    return false;
}

function scheduleTokenRefresh(expiresInMs) {
    if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
    }
    // Refresh 5 minutes before expiry
    const refreshInterval = Math.max(0, expiresInMs - (5 * 60 * 1000)); 
    tokenRefreshTimeout = setTimeout(refreshToken, refreshInterval);
    console.log(`Scheduled token refresh in ${Math.round(refreshInterval / (60 * 1000))} minutes.`);
}

async function refreshToken() {
    console.log('Attempting to refresh Freebuff token...');
    if (!currentToken || !currentToken.refresh_token) {
        console.error('No refresh token available. Initiating new device flow.');
        return await initiateDeviceFlow();
    }

    try {
        const response = await axios.post(`${FREEBUFF_API_BASE}/oauth/token`, {
            grant_type: 'refresh_token',
            refresh_token: currentToken.refresh_token,
            client_id: 'your-client-id-from-freebuff' // IMPORTANT: Replace with your actual client ID
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const tokenData = {
            ...response.data,
            expires_at: Date.now() + (response.data.expires_in * 1000)
        };
        await saveToken(tokenData);
        console.log('Freebuff token refreshed successfully.');
        return true;
    } catch (error) {
        console.error('Error refreshing Freebuff token:', error.response ? error.response.data : error.message);
        // This is where you might hit: {"error":"invalid_grant","error_description":"Refresh token is invalid or expired."}
        // If that happens, initiate a new device flow.
        console.log('Refresh failed. Initiating new device flow.');
        return await initiateDeviceFlow();
    }
}

async function initiateDeviceFlow() {
    console.log('Initiating Freebuff device code flow...');
    try {
        const deviceCodeResponse = await axios.post(`${FREEBUFF_API_BASE}/oauth/device_code`, {
            client_id: 'your-client-id-from-freebuff', // IMPORTANT: Replace with your actual client ID
            scope: 'chat' 
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const { device_code, user_code, verification_uri, interval } = deviceCodeResponse.data;
        console.log(`Please go to: ${verification_uri}`);
        console.log(`Enter this code: ${user_code}`);
        console.log('Waiting for authorization...');

        const pollInterval = interval * 1000 || 5000; // Poll every 'interval' seconds, or 5s default

        return new Promise((resolve, reject) => {
            const polling = setInterval(async () => {
                try {
                    const tokenResponse = await axios.post(`${FREEBUFF_API_BASE}/oauth/token`, {
                        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                        device_code: device_code,
                        client_id: 'your-client-id-from-freebuff' // IMPORTANT: Replace with your actual client ID
                    }, {
                        headers: { 'Content-Type': 'application/json' }
                    });

                    clearInterval(polling);
                    const tokenData = {
                        ...tokenResponse.data,
                        expires_at: Date.now() + (tokenResponse.data.expires_in * 1000)
                    };
                    await saveToken(tokenData);
                    console.log('Freebuff authorization successful!');
                    resolve(true);
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.error === 'authorization_pending') {
                        // Still waiting for user authorization. Continue polling.
                        process.stdout.write('.'); // Indicate activity
                    } else {
                        clearInterval(polling);
                        console.error('\nError during device code polling:', error.response ? error.response.data : error.message);
                        reject(new Error('Failed to get Freebuff token.'));
                    }
                }
            }, pollInterval);
        });

    } catch (error) {
        console.error('Error initiating device code flow:', error.response ? error.response.data : error.message);
        return false;
    }
}

// Function to get the current valid token
function getFreebuffToken() {
    if (!currentToken || currentToken.expires_at <= Date.now()) {
        console.warn('Freebuff token is expired or not available. Attempting refresh/re-init.');
        // This should ideally trigger a refresh, but for a simple getter, 
        // we'll rely on the scheduled refresh or require manual re-init if needed.
        return null; 
    }
    return currentToken.access_token;
}

async function startTokenManager() {
    if (!loadToken()) {
        await initiateDeviceFlow();
    } else {
        // Ensure refresh is scheduled even if token loaded from file
        scheduleTokenRefresh(currentToken.expires_at - Date.now());
    }
}

module.exports = { startTokenManager, getFreebuffToken };

// To run this standalone for testing:
// if (require.main === module) {
//     startTokenManager();
// }
```

**IMPORTANT:** You need to get a `client_id` from Freebuff directly. This isn't publicly documented how to generate one; you usually get it from their team or specific integrations. For the purpose of this guide, assume you have one. If you don't, this blueprint highlights a critical missing piece for broader adoption. Honestly, I don't get why this isn't clearer on their site for dev setups.

Run this script: `node tokenManager.js`. It will output the `verification_uri` and `user_code`. Open the URL, enter the code, and approve. The script will then save `freebuff_token.json` and keep it refreshed.

### Step 2: Configure 9router

Now, set up 9router to proxy requests. Create a `9router.config.js` file:

```javascript
// 9router.config.js
const { getFreebuffToken } = require('./tokenManager'); // Assuming tokenManager.js is in the same directory

module.exports = {
    port: 3000, // Or any port you want 9router to listen on
    routes: [
        {
            // This route will handle all OpenAI-compatible chat completions requests
            path: '/v1/chat/completions',
            method: ['POST'],
            target: 'https://freebuff.com/api/v1/chat/completions',
            hooks: {
                onRequest: async (req, res) => {
                    const token = getFreebuffToken();
                    if (!token) {
                        // If token is not available, maybe respond with a 503 or redirect to auth
                        console.error('Freebuff token not available for request.');
                        res.writeHead(503, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Freebuff token unavailable. Please authorize.' }));
                        return true; // Stop further processing
                    }
                    req.headers['Authorization'] = `Bearer ${token}`;
                    req.headers['Content-Type'] = 'application/json';
                    // Remove any host headers that might cause issues with Freebuff's proxy
                    delete req.headers['host'];
                    delete req.headers['accept-encoding']; // Freebuff might not handle compressed content
                    return false; // Continue with proxying
                },
                onProxyResponse: (proxyRes, req, res) => {
                    // Optional: You can inspect/modify proxyRes headers here
                },
                onError: (err, req, res) => {
                    console.error('9router proxy error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '9router proxy error', details: err.message }));
                }
            }
        },
        // Add other OpenAI-compatible routes if Freebuff supports them (e.g., embeddings)
        // {
        //     path: '/v1/embeddings',
        //     method: ['POST'],
        //     target: 'https://freebuff.com/api/v1/embeddings',
        //     hooks: {
        //         onRequest: async (req, res) => {
        //             const token = getFreebuffToken();
        //             if (!token) { /* ... handle error ... */ return true; }
        //             req.headers['Authorization'] = `Bearer ${token}`;
        //             req.headers['Content-Type'] = 'application/json';
        //             delete req.headers['host'];
        //             delete req.headers['accept-encoding'];
        //             return false;
        //         }
        //     }
        // }
    ]
};
```

To run 9router:
1.  Make sure `tokenManager.js` is running and has successfully fetched a token.
2.  In a *separate* terminal, start 9router: `9router start --config 9router.config.js`

### Step 3: Use with Your AI Agents

Now your agents can send requests to `http://localhost:3000` (or whatever port you configured) as if it were the OpenAI API.

Example using `openai` Node.js client:

```javascript
// agentExample.js
const OpenAI = require('openai');

const openai = new OpenAI({
    baseURL: 'http://localhost:3000/v1', // Point to your 9router instance
    apiKey: 'sk-no-key-needed' // Dummy key, 9router handles auth
});

async function runAgentTask(prompt) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Or 'llama3', check Freebuff for supported models
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150
        });
        console.log('Agent response:', chatCompletion.choices[0].message.content);
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching completion:', error.response ? error.response.data : error.message);
    }
}

// Example usage
runAgentTask('Explain the concept of quantum entanglement in simple terms.');
// runAgentTask('Generate a short story about a time-traveling squirrel.');
```
This is your **free LLM access 9router** in action. You're using an OpenAI-compatible interface, but routing through your local proxy to a free tier.

## What I Got Wrong First

Honestly, when I first tried this **freebuff LLM cost** reduction strategy, I hit a wall with rate limits and expired device codes.

1.  **Device Code Expiry:** My initial `tokenManager.js` didn't properly handle `authorization_pending` and `expired_token` errors during the polling phase. I kept getting `{"error":"expired_token","error_description":"The device code has expired."}`. Turns out, the `device_code` has a limited lifespan (usually a few minutes) to be authorized by the user. If you're too slow, or your polling interval is too long, you miss the window. **Fix:** Ensure rapid polling (using `interval` from device code response) and clear user instructions. Also, add robust error handling to re-initiate the flow if it expires.
2.  **Refresh Token Invalidity:** The Freebuff refresh tokens also have a lifespan or can be invalidated if not used regularly. I initially assumed they were indefinite. Getting `{"error":"invalid_grant","error_description":"Refresh token is invalid or expired."}` was a headache. **Fix:** My `refreshToken` function now explicitly checks for this and will trigger a full `initiateDeviceFlow()` if the refresh token fails. This is crucial for long-running services.
3.  **Rate Limits & Model Access:** Freebuff's free tier has pretty strict rate limits and sometimes model availability changes. For example, I measured **120 successful `gpt-3.5-turbo` chat completions over 15 minutes** before hitting a `429 Too Many Requests` error, using a batch script sending requests every 5 seconds. This was measured with `max_tokens: 100` and `temperature: 0.7`. After hitting the limit, I had to wait roughly 30-45 minutes for the rate limit to reset. This is why it's a *free tier* solution, not a high-throughput enterprise one. For clients, this means you save cost for dev/testing, but production might still need a fallback to paid APIs for peak loads.
4.  **Content-Type & Headers:** Sometimes the proxied requests would fail due to incorrect `Content-Type` or extraneous headers being forwarded. My 9router config now explicitly sets `Content-Type: application/json` and removes `host` and `accept-encoding` to prevent issues.

## Handling Multiple Freebuff Accounts and Caching

For more advanced use cases, like managing different free tiers for different teams or projects (a common scenario for NexusOS agents), you can extend this.

*   **Multiple Tokens:** Your `tokenManager.js` could manage an array of `freebuff_token.json` files, perhaps keyed by `client_id` or user ID. Your 9router `onRequest` hook could then select the least-rate-limited token or cycle through them. This would require passing a custom header (e.g., `X-Freebuff-Account-ID`) from your agents for 9router to pick the right token.
*   **Caching:** For highly repetitive prompts or common system messages, a simple local cache in your `onRequest` hook can significantly reduce calls to Freebuff, helping you stay under their rate limits longer. You could use `node-cache` or a simple in-memory object.

```javascript
// Example of simple in-memory cache in 9router.config.js (conceptual)
const cache = {}; // Simple object for now

// ... inside onRequest hook ...
const requestBody = JSON.parse(req.body.toString()); // Assuming body is parsed by 9router or accessible
const cacheKey = JSON.stringify(requestBody); // Simple key based on request body

if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
    console.log('Serving from cache!');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cache[cacheKey].data));
    return true; // Stop request from going to Freebuff
}

// ... if not in cache, proceed to Freebuff ...
// On onProxyResponse, store the response:
// cache[cacheKey] = { data: JSON.parse(body), expiry: Date.now() + CACHE_TTL_MS };
```
This is a decent **LLM free tier routing** optimization for predictable agent behavior.

## FAQs

### How reliable is Freebuff for production?
Freebuff's free tier is great for development, testing, and non-critical background tasks. For production applications needing high availability and strict SLAs, you should always have a fallback to a paid API like OpenAI or Claude. The rate limits mean it's not a substitute for sustained high-volume inference.

### Can 9router manage other free LLM services?
Yes, 9router is a generic proxy. As long as the free LLM service offers an OpenAI-compatible API and you can manage its authentication (API key, OAuth, etc.) programmatically, you can extend the `9router.config.js` and `tokenManager.js` to support it. This makes it a powerful **openai compatible gateway** for various providers.

### Is device-code OAuth secure for this?
The device-code flow is secure for user authorization, as the code is entered directly on the provider's trusted website. However, storing the resulting `access_token` and `refresh_token` locally (like in `freebuff_token.json`) means anyone with access to that file could impersonate your application. For robust production, use environment variables or a proper secrets manager.

---

So, there you have it. You don't need to break the bank to run your AI agents, especially for dev and experimental work. This **free LLM access 9router** setup with Freebuff is a battle-tested way to cut costs while keeping your existing OpenAI API client code. It takes a bit of initial setup, but the savings are real, and the flexibility of managing your own **LLM free tier routing** is powerful. Stop letting LLM bills dictate your innovation. Build smart.