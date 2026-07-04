---
title: "Orchestrate Multiple Local LLMs: RTX 4090 Benchmarks"
excerpt: "Running multi-agent systems? Here's how I orchestrate multiple local LLMs (CodeLlama, Llama-3, Gemma) on an RTX 4090 with Flutter/Node.js, with real performa..."
date: "2026-07-04"
tags: ["AI Agents", "Local LLMs", "Ollama", "Node.js", "Flutter", "Benchmarking", "Multi-Agent Systems", "MLOps", "Performance"]
keywords: ["orchestrate multiple local llms", "local llm agent workflow", "ollama agent orchestration", "node.js local llm", "flutter local llm pipeline", "multi-agent local llm"]
readTime: "10 min read"
coverGradient: "from-cyan-500 to-teal-400"
---

Everyone talks about running *a* local LLM. Cool. But what about when your AI agent workflow needs specialized models, concurrently? I spent weeks optimizing this for FarahGPT's multi-agent architecture. Figured it out the hard way.

## Why Orchestrate Multiple Local LLMs for Agent Workflows?

Look, a single general-purpose LLM is fine for a lot of stuff. But real AI agent workflows aren't general-purpose. You need agents specializing in different tasks: one for coding, one for complex reasoning, another for quick summarization. Asking Llama-3-8B to generate perfect code *and* then instantly summarize a 50-page doc is a waste. It's slow and often sub-par.

**The game-changer? Using distinct local LLMs for specific sub-agents.**

Here's why it's crucial for complex systems like my NexusOS:

*   **Specialization:** CodeLlama for code generation, Llama-3 for general reasoning, Gemma for quick, lightweight summarization or intent classification. Each excels at its niche.
*   **Efficiency:** Smaller, specialized models are faster and use less VRAM. Why load a 13B model for a 2B task?
*   **Cost (even locally):** Less VRAM contention means smoother operation, fewer crashes, and less development time wrestling with hardware.

This isn't about running one `ollama run llama3`. This is about concurrently hitting `llama3`, `codellama`, and `gemma` from your backend, all serving different parts of a multi-agent prompt pipeline. This is where orchestrate multiple local llms becomes a real engineering problem.

## My Setup: Flutter, Node.js, and Ollama for Multi-Agent Local LLMs

My typical stack for these projects looks like this:

*   **Flutter (UI):** For a snappy, cross-platform user experience. It's how users interact with the agents.
*   **Node.js (Backend):** Handles API calls, orchestrates agents, manages prompt templates, and crucially, acts as the gateway to the local LLMs.
*   **Ollama (Local LLM Server):** The workhorse. It handles downloading, running, and serving the models. Super simple API.

The flow is straightforward on paper: Flutter client calls a Node.js endpoint, Node.js figures out which agents (and thus which local LLMs) need to respond, fires off requests to Ollama, aggregates results, and sends them back to Flutter. The trick is making this *concurrent* and *performant* when you're hitting several models at once. This is the essence of ollama agent orchestration.

## Building the Concurrent Local LLM Pipeline

This is where the rubber meets the road. We need to handle multiple asynchronous requests from Flutter, funnel them through Node.js, and hit different Ollama models, all without everything grinding to a halt.

### Node.js Backend Orchestration

The Node.js backend is the brain. It needs to accept a request, decide which local llm agent workflow paths to take, and then fan out requests to Ollama. The key here is parallel execution.

```typescript
// src/server.ts (simplified for clarity)
import express from 'express';
import axios from 'axios';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

// Ollama configurations - adjust ports if running multiple ollama serve instances
// Or, if using a single `ollama serve`, the models are just different 'model' names.
const OLLAMA_BASE_URL = 'http://localhost:11434/api/generate'; 

interface AgentRequest {
    type: 'reasoning' | 'coding' | 'summarization';
    prompt: string;
}

interface OllamaPayload {
    model: string;
    prompt: string;
    stream: boolean;
    options?: {
        temperature?: number;
        num_gpu?: number; // Not directly used by Ollama API for model selection, but good for understanding
        // ... other Ollama options
    };
}

app.post('/orchestrate-agents', async (req: Request, res: Response) => {
    const agentRequests: AgentRequest[] = req.body.agentRequests; // Array of agent tasks

    if (!agentRequests || agentRequests.length === 0) {
        return res.status(400).json({ error: 'No agent requests provided.' });
    }

    const tasks = agentRequests.map(async (agentReq) => {
        let modelName: string;
        let temperature: number = 0.7;

        switch (agentReq.type) {
            case 'reasoning':
                modelName = 'llama3:8b'; // Using Llama-3 for general reasoning
                temperature = 0.5;
                break;
            case 'coding':
                modelName = 'codellama:7b-instruct'; // CodeLlama for code tasks
                temperature = 0.1;
                break;
            case 'summarization':
                modelName = 'gemma:2b'; // Gemma for quick summaries
                temperature = 0.9;
                break;
            default:
                throw new Error(`Unknown agent type: ${agentReq.type}`);
        }

        const payload: OllamaPayload = {
            model: modelName,
            prompt: agentReq.prompt,
            stream: false, // For simplicity, we'll get full responses here
            options: {
                temperature: temperature,
                // num_gpu: 1, // This is a per-model option *if* Ollama distributes well, often better controlled globally or by specific `ollama run`s.
            }
        };

        try {
            console.log(`Sending request to ${modelName} with prompt: "${agentReq.prompt.substring(0, 50)}..."`);
            const response = await axios.post(OLLAMA_BASE_URL, payload, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 120000 // 2 minute timeout per request
            });
            return { type: agentReq.type, result: response.data.response };
        } catch (error: any) {
            console.error(`Error with ${modelName} agent:`, error.message);
            return { type: agentReq.type, error: error.message };
        }
    });

    try {
        // Here's the thing — Promise.all is your best friend for parallel execution.
        const results = await Promise.all(tasks);
        res.json(results);
    } catch (error: any) {
        console.error('Overall orchestration error:', error.message);
        res.status(500).json({ error: 'Failed to orchestrate agent requests.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node.js agent orchestrator listening on port ${PORT}`);
});
```
This Node.js local llm setup uses `Promise.all` to fire off all required LLM requests in parallel. This is non-negotiable for performance. If you chain these, your users will rage quit.

### Flutter Frontend Integration

The Flutter app needs to send these requests and handle the responses. Again, `Future.wait` is the equivalent of `Promise.all` here.

```dart
// lib/agent_service.dart (simplified)
import 'dart:convert';
import 'package:http/http.dart' as http;

class AgentRequest {
  final String type;
  final String prompt;

  AgentRequest({required this.type, required this.prompt});

  Map<String, dynamic> toJson() => {
    'type': type,
    'prompt': prompt,
  };
}

class AgentResponse {
  final String type;
  final String? result;
  final String? error;

  AgentResponse({required this.type, this.result, this.error});

  factory AgentResponse.fromJson(Map<String, dynamic> json) {
    return AgentResponse(
      type: json['type'],
      result: json['result'],
      error: json['error'],
    );
  }
}

class AgentOrchestratorService {
  final String _baseUrl = 'http://localhost:3000'; // Your Node.js backend URL

  Future<List<AgentResponse>> orchestrateAgents(List<AgentRequest> requests) async {
    final uri = Uri.parse('$_baseUrl/orchestrate-agents');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({'agentRequests': requests.map((r) => r.toJson()).toList()});

    try {
      final response = await http.post(uri, headers: headers, body: body);

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((json) => AgentResponse.fromJson(json)).toList();
      } else {
        throw Exception('Failed to orchestrate agents: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error in Flutter agent orchestration: $e');
      rethrow;
    }
  }
}

// In your Flutter UI widget:
// Example usage:
// final service = AgentOrchestratorService();
// final requests = [
//   AgentRequest(type: 'reasoning', prompt: 'Explain quantum entanglement simply.'),
//   AgentRequest(type: 'coding', prompt: 'Write a Python function for a Fibonacci sequence.'),
//   AgentRequest(type: 'summarization', prompt: 'Summarize the last 10 lines of this chat.'),
// ];
//
// final responses = await service.orchestrateAgents(requests);
// responses.forEach((res) => print('${res.type} Result: ${res.result ?? res.error}'));
```
This flutter local llm pipeline demonstrates how to trigger multiple agent tasks from the client.

### Real-World Benchmarks: RTX 4090 with Concurrent Local LLMs

This is the good stuff. Running 2-3 distinct local LLMs *simultaneously* on an RTX 4090.
**Methodology:**
*   **Hardware:** Single PC, RTX 4090 (24GB VRAM), AMD Ryzen 9 7950X, 64GB DDR5 RAM.
*   **Ollama Version:** `0.1.33` (This version introduced some stability fixes for concurrent large models, but still needs careful VRAM management).
*   **Models:**
    *   `llama3:8b` (8B parameters, ~4.7GB VRAM when loaded)
    *   `codellama:7b-instruct` (7B parameters, ~4.2GB VRAM when loaded)
    *   `gemma:2b` (2B parameters, ~1.5GB VRAM when loaded)
*   **Test Cases:**
    1.  Single `llama3:8b` request.
    2.  `llama3:8b` + `codellama:7b-instruct` concurrently.
    3.  `llama3:8b` + `codellama:7b-instruct` + `gemma:2b` concurrently.
*   **Prompts:** Roughly 100-token prompts, aiming for 200-token responses. Each test run averaged over 50 iterations.
*   **Measurement:** Time to first token (TTFT), total response time (TRT), tokens/second (tok/s), VRAM usage (peak `nvidia-smi` during inference).

| Scenario                               | TTFT (ms) | TRT (ms) | Avg tok/s | Peak VRAM (GB) |
| :------------------------------------- | :-------- | :------- | :-------- | :------------- |
| **1 LLM:** Llama-3 (8B) alone           | 120       | 1850     | **108.1** | 5.2            |
| **2 LLMs:** Llama-3 + CodeLlama         |           |          |           |                |
| Llama-3 (8B)                            | 280       | 3500     | 57.1      | 11.5           |
| CodeLlama (7B)                          | 250       | 3200     | 62.5      |                |
| **3 LLMs:** Llama-3 + CodeLlama + Gemma |           |          |           |                |
| Llama-3 (8B)                            | 410       | 5100     | 39.2      | **14.8**       |
| CodeLlama (7B)                          | 380       | 4800     | 41.7      |                |
| Gemma (2B)                              | 200       | 2800     | 71.4      |                |

**Key Takeaways from the Benchmarks:**

*   **VRAM is King:** Running two 7B+ models concurrently already pushes VRAM usage significantly. Adding a third (even a small 2B model) chewed up nearly 15GB. The RTX 4090's 24GB is plenty for this combo, but you're getting close to limits if you want larger models or more concurrent smaller ones.
*   **Throughput Drop:** As expected, `tok/s` drops across the board when multiple models are active. Llama-3 alone hit over 100 tok/s. With two other models, it halved to ~39 tok/s. **This is a critical consideration for user experience.**
*   **First Token Latency:** TTFT increases noticeably. This directly impacts perceived responsiveness.
*   **Concurrent Resource Contention:** Ollama is good, but it's still sharing the GPU. The overhead of context switching and memory management for multiple loaded models is real.

**Real Number Example:** For Llama-3 (8B) on its own, I consistently observed **108.1 tok/s on an RTX 4090**, measured over 50 prompt-response cycles with ~200 output tokens. When running simultaneously with CodeLlama (7B) and Gemma (2B), this dropped to **39.2 tok/s for Llama-3**. This isn't just theory; this is what users actually experience.

## What I Got Wrong First

Honestly, my first attempt at this multi-agent local llm thing was a mess.

1.  **Naive Request Firing:** I just slammed all requests at Ollama without `Promise.all`. The result? Sequential inference. My Node.js calls waited for one LLM to finish before starting the next. TRT for three agents went from ~5 seconds (concurrent) to ~10-15 seconds (sequential). Total disaster for UX.
2.  **VRAM Exhaustion with Default Settings:** I assumed `ollama serve` would magically manage VRAM for multiple models. Not quite. I'd hit errors like:
    ```
    Error: ollama generate: llama_new_context_with_model: n_gqa (8) * n_gpu_layers (33) must be <= n_gpu_layers_total (24)
    ```
    This specific error string means Ollama tried to load a model with too many GPU layers (e.g., `33` in this case) but the `n_gpu_layers_total` (my effective GPU layers available, often tied to total VRAM/`OLLAMA_NUM_GPU` config) was `24`. Basically, **not enough VRAM was reserved or available for the new model because another model was already hogging it.**
3.  **No Monitoring:** Didn't monitor `nvidia-smi`. Just watched my app hang. Big mistake. You need to see VRAM and GPU utilization. Turns out, even if a model *can* fit, the overhead of loading and keeping multiple models in VRAM, plus the actual inference, can push it over.
4.  **Assuming `OLLAMA_NUM_GPU` would distribute:** `OLLAMA_NUM_GPU` primarily controls how many layers *one* model uses on the GPU, or globally limits GPU for a *single* `ollama serve` instance. It doesn't magically distribute VRAM slices for concurrently loaded, distinct models perfectly. For truly isolated VRAM and less contention, running multiple `ollama serve` instances on different ports, each with a specific model loaded and its own `OLLAMA_NUM_GPU` set to `1` (if you have multiple GPUs) or carefully configured, is sometimes necessary. But that gets complex for node.js local llm orchestration. For a single GPU, it's about making sure your total VRAM footprint doesn't exceed capacity.

## Optimization and Gotchas

*   **VRAM Pre-loading vs. On-Demand:** Ollama loads models on first use. If your workflow needs all three models ready instantly, hit them with a dummy request on startup. Otherwise, expect a longer TTFT for the very first call to each model.
*   **Monitoring is NOT Optional:** Keep `nvidia-smi -l 1` running in a terminal. Watch your VRAM. If it's spiking close to your card's limit, you'll see slowdowns or crashes.
*   **Model Quantization:** Always use quantized models (`llama3:8b-instruct-q4_K_M`, etc.). They significantly reduce VRAM footprint with minimal performance impact. My benchmarks used q4_K_M versions.
*   **Batching? Maybe Not for Agents:** For our multi-agent local llm setup, where different LLMs get different prompts, true batching across *models* isn't really a thing. You're parallelizing requests to distinct models, not batching a single model. Batching *within* a single model request is handled by Ollama/LLM itself.
*   **CPU Overhead:** Don't forget the CPU. Ollama offloads a lot to the GPU, but loading models, tokenization, and some other operations still hit the CPU hard. If your CPU is maxed, GPU can starve.
*   **Ollama and `OLLAMA_MAX_VRAM`:** For fine-grained control, you can set `OLLAMA_MAX_VRAM` as an environment variable before starting `ollama serve`. This can help prevent a single Ollama instance from consuming *all* available VRAM, leaving some for other processes or, if you're running multiple `ollama serve` instances, for other models. I don't get why this isn't more explicitly documented for multi-model scenarios.

## FAQs

### Can I run multiple local LLMs on a single GPU without VRAM issues?
Yes, but carefully. The total VRAM required by all simultaneously loaded models (plus Ollama overhead) must fit within your GPU's VRAM. Use smaller, quantized models (like `q4_K_M`), monitor with `nvidia-smi`, and be prepared for performance degradation as VRAM approaches saturation.

### What's the best way to manage Ollama instances for multi-agent workflows?
For a single GPU, running one `ollama serve` instance and calling different models by name (`llama3`, `codellama`, `gemma`) is generally the simplest. Ollama manages sharing the GPU. If you have multiple GPUs or need strict VRAM isolation, consider running multiple `ollama serve` instances on different ports, each configured to use a specific GPU and model.

### How does Flutter connect to local LLMs?
Flutter itself doesn't directly connect to Ollama. Instead, it communicates with a backend service (like Node.js in this post) via HTTP requests. The backend then orchestrates calls to the local Ollama server, abstracting the LLM interaction away from the Flutter frontend.

This whole multi-model local LLM setup isn't trivial. You're pushing consumer hardware. But the flexibility of having specialized agents, each powered by the best local LLM for its job, is a huge win for sophisticated AI agent workflows. It makes things like FarahGPT's multi-agent system not just possible, but actually performant enough for real users. Stick to good parallelization, watch your VRAM, and you'll be fine.