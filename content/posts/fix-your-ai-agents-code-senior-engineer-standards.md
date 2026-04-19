---
title: "AI Agent Senior Engineer: Raise Your Code's Standards"
excerpt: "AI agent senior engineer: Tired of AI code that acts like an intern? Master AGENTS.md to transform your AI coding agent into a senior engineer. Eliminate syc..."
date: "2026-04-19"
tags: ["AI Agents", "Prompt Engineering", "AI Development", "Coding Tools", "Full-Stack", "Developer Productivity", "Claude Code", "Gemini CLI"]
keywords: ["AI agent senior engineer", "AI coding agent best practices", "Claude Code workflow", "AI agent prompt engineering", "reliable AI code generation", "eliminate AI sycophancy", "Karpathy AI principles"]
readTime: "11 min read"
coverGradient: "from-amber-500 to-orange-400"
---

Everyone talks about AI agents coding, but nobody explains how to stop them from acting like eager interns who commit drive-by refactors and deliver sycophantic, unverified code. I figured it out the hard way, applying Karpathy's and Boris Cherny's principles, to turn my AI coding agent into a genuine **AI agent senior engineer**.

## Why Your "AI Engineer" Acts Like a Junior Dev

Here's the thing — most AI agents, left to their own devices, are terrible at writing production-grade code. They're too agreeable. They don't push back on bad specs. They don't test thoroughly. They don't think about architecture. They'll generate code, then if you say "refactor this," they'll refactor it, often poorly, without understanding the broader implications. It's a waste of compute and a headache for human engineers.

This isn't about the LLM itself, it's about the **workflow and governance**. Karpathy talked about `LLM.int()` – turning an LLM into a reliable parser. Boris Cherny pushed `AGENTS.md` as a manifest for agent behavior. Both are critical. My goal was to eliminate:

1.  **Sycophancy:** The agent agreeing with whatever it's told, even if it's wrong.
2.  **Drive-by Refactors:** Changing working code without clear benefit or proper verification.
3.  **Poor Verification:** Generating code without robust testing or validation steps.

We need to establish a clear contract for how our AI coding agent operates, just like we would with a human team member.

## The `AGENTS.md` Blueprint for Senior-Level Output

`AGENTS.md` is essentially a `CONTRIBUTING.md` for your AI agent. It’s a plaintext file in your repo root that defines its roles, responsibilities, constraints, and process. **This is how you bake in senior engineering standards.**

It's not just a fancy prompt. It's a *manifest* that every single agent in your pipeline references. For FarahGPT, my AI gold trading system, each agent (strategist, executor, risk manager) had its own `AGENTS.md` variant, defining their specific domain and constraints. For NexusOS, this is core to agent governance.

Here’s a simplified `AGENTS.md` structure I use for a general-purpose Flutter development agent:

```markdown
# AGENT MANIFEST

## Agent Name
FlutterSeniorEngineer

## Agent Role
Acts as a senior Flutter engineer responsible for developing, testing, and maintaining high-quality mobile applications. Focuses on robust architecture, performance, and maintainability.

## Principles of Operation

1.  **Understand Deeply:** Before writing any code, always confirm full comprehension of the task, including edge cases, existing architecture, and potential side effects. If unclear, ask clarifying questions. **Do NOT proceed without clarity.**
2.  **Verify Rigorously:** All code must be accompanied by relevant unit and/or widget tests. Any proposed changes to existing code require demonstrating that current tests pass and new tests cover the change.
3.  **Propose, Justify, Execute:**
    *   **Propose:** Outline the approach, architectural choices, and significant trade-offs *before* writing code.
    *   **Justify:** Explain *why* this approach is superior, considering maintainability, performance, and scalability. Reference established patterns (e.g., BLoC, Riverpod, Clean Architecture).
    *   **Execute:** Only write code after the proposed plan is implicitly or explicitly approved.
4.  **Avoid Sycophancy:** Challenge ambiguous or potentially flawed instructions. If a request leads to suboptimal code or violates established principles, explain why and propose alternatives. Your goal is the *best* outcome, not just a compliant one.
5.  **Focus on Incremental Value:** Prioritize small, verifiable changes. Avoid large, sweeping refactors unless explicitly requested and justified.
6.  **Self-Correction:** If a generated solution fails tests or review, analyze the failure, identify the root cause, and propose a corrective action. Do not simply retry with minor tweaks.

## Technical Stack & Preferences

*   **Language:** Dart
*   **Framework:** Flutter (latest stable)
*   **State Management:** Riverpod (preferred), BLoC (acceptable if existing)
*   **Architecture:** Clean Architecture principles, Repository Pattern
*   **Testing:** `flutter_test`, `mockito`, `bloc_test`, `riverpod_test`
*   **Code Style:** Effective Dart, `flutter format` enforced.

## Output Format
Always respond with a clear thought process, then the proposed plan, then the code blocks. For code changes, provide diffs where appropriate. For new features, provide full files.
```

This isn't just a list of rules; it's a **behavioral contract**. When you embed this into your agent's system prompt (or `tools` definitions), you're not just telling it *what* to do, but *how* to think. It's about establishing an `LLM.int()` for behavior, not just parsing.

## Implementing `AGENTS.md` in Your AI Agent Workflow

So what I did was, I created a primary orchestrator agent (often just a Node.js or Python script) that takes user input, then consults the `AGENTS.md` and uses it to craft prompts for the actual code-generating LLM (like Claude 3 Opus or GPT-4).

Here's a basic workflow:

1.  **User Request:** "Add a user profile screen with editable fields for name and email, and a logout button."
2.  **Orchestrator Reads `AGENTS.md`:** Loads the `AGENTS.md` content.
3.  **Initial Prompt Construction:** The orchestrator crafts a prompt to the "planning" phase of the LLM, injecting the `AGENTS.md` as context.
4.  **LLM (Planning Phase):** Based on `AGENTS.md` principles (Understand Deeply, Propose, Justify), the LLM outputs a detailed plan (e.g., "Use `Riverpod` for state, `Form` widget for input, `FirebaseAuth` for logout. Files: `user_profile_page.dart`, `user_profile_controller.dart`, `user_repository.dart`. Tests: `user_profile_page_test.dart`").
5.  **Human Review (Optional but Recommended):** A human reviews the plan. This is your chance to catch architectural missteps early.
6.  **LLM (Coding Phase):** The orchestrator then sends the approved plan, the `AGENTS.md` content, and relevant existing codebase snippets to the LLM, instructing it to `Execute`.
7.  **LLM (Testing Phase):** After code generation, the orchestrator triggers another LLM call or a separate agent, instructing it (again, referencing `AGENTS.md`'s "Verify Rigorously" principle) to generate tests or even run existing tests.
8.  **Output & Review:** The agent delivers code + tests. This output should adhere to `AGENTS.md`'s "Output Format" section.

Let's look at some simplified code snippets for how you'd inject this. I use `anthropic`'s SDK for Claude, but the principle is the same for OpenAI.

First, your `AGENTS.md` file. Assume it's in your project root.

```markdown
# AGENT MANIFEST
# ... (content as shown above) ...
```

Next, your orchestrator script (Node.js example):

```javascript
// agentOrchestrator.js
import fs from 'fs/promises';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config'; // For process.env.ANTHROPIC_API_KEY

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getAgentManifest(filePath = './AGENTS.md') {
    try {
        const manifestContent = await fs.readFile(filePath, 'utf8');
        return manifestContent;
    } catch (error) {
        console.error(`Error reading AGENTS.md: ${error.message}`);
        return null;
    }
}

async function askAgent(userRequest, existingCode = '') {
    const agentManifest = await getAgentManifest();
    if (!agentManifest) {
        console.error("Failed to load agent manifest. Aborting.");
        return;
    }

    // This is where you inject the AGENTS.md content.
    // Claude's system prompt is excellent for this.
    const systemPrompt = `You are a highly skilled AI coding agent operating under the following manifest. Adhere strictly to these principles for all tasks.\n\n${agentManifest}`;

    // Step 1: Planning Phase
    console.log("Agent: Planning phase initiated...");
    const planPrompt = `User Request: "${userRequest}"\n\nGiven the manifest and the user request, propose a detailed technical plan. Focus on architectural choices, affected files, and a high-level approach before generating any code. Justify your decisions based on the manifest's principles.`;

    const planResponse = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: planPrompt }],
    });
    const plan = planResponse.content[0].text;
    console.log("\n--- Agent Proposed Plan ---");
    console.log(plan);

    // In a real system, you'd pause here for human review/approval of the plan.
    // For this example, we'll proceed directly.

    // Step 2: Coding Phase (after plan approval)
    console.log("\nAgent: Coding phase initiated...");
    const codePrompt = `User Request: "${userRequest}"\n\nApproved Plan: \n${plan}\n\nGiven the manifest, the user request, and the approved plan, generate the necessary Flutter/Dart code. Provide full files for new components and clear diffs for modifications. Include relevant unit/widget tests as per the manifest. If existing code is provided, consider it:\n\nExisting Code:\n\`\`\`\n${existingCode}\n\`\`\`\n\nYour output should directly provide the code blocks.`;

    const codeResponse = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000, // More tokens for code
        system: systemPrompt,
        messages: [{ role: "user", content: codePrompt }],
    });
    const generatedCode = codeResponse.content[0].text;
    console.log("\n--- Agent Generated Code & Tests ---");
    console.log(generatedCode);

    // You'd then parse `generatedCode` to extract files and tests,
    // write them to disk, and potentially run automated tests.
    return generatedCode;
}

// Example usage:
const userFeatureRequest = "Implement a simple counter screen with a button to increment and a text display.";
// You'd usually fetch this from your codebase
const existingMainDart = `
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI agent senior engineer: Senior Engineer Standards',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'AI agent senior engineer: Senior Engineer Standards'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
`;

askAgent(userFeatureRequest, existingMainDart).then(() => {
    console.log("\nAgent task completed.");
}).catch(e => console.error("Agent failed:", e));

```

This `system` prompt injection is crucial for Claude Code workflows, ensuring the manifest is always top-of-mind for the model. For OpenAI, you'd use the `system` role in the `messages` array. The key is **persistent context**. This isn't a one-off prompt; it's the bedrock of your agent's identity.

## What I Got Wrong First

Honestly, when I started with AI coding agents, I made all the classic mistakes:

1.  **"Just prompt it harder":** I thought verbose, single-shot prompts would solve everything. Nope. The `AGENTS.md` and multi-stage prompting (plan -> code -> test) is *way* more effective than one giant prompt. The LLM gets lost, forgets constraints, and often hallucinates when given too much in one go.
2.  **Skipping Verification:** Initially, I'd get code, review it myself, and move on. This led to subtle bugs and regressions. The "Verify Rigorously" principle in `AGENTS.md` *must* be followed, meaning the agent needs to generate tests or confirm existing ones pass. For FarahGPT, this was critical for financial stability – a single bad trade due to unverified code could be catastrophic.
3.  **Ignoring Sycophancy:** My early agents would always just agree and generate whatever I asked, even if it was technically flawed or architecturally unsound. I once asked an agent to use `setState` for global state in a complex app, and it just did it. After implementing "Avoid Sycophancy," the agent pushed back, suggesting Riverpod and explaining *why* `setState` was wrong for that context. **This is where the AI agent senior engineer really shines.**
4.  **No Defined Output Format:** I'd get code, sometimes tests, sometimes explanations, all mixed together. Specifying "Output Format" in `AGENTS.md` forced structured responses, making post-processing and integration much smoother. It's underrated.

## Optimizing for Speed and Cost

Running multiple LLM calls for planning, coding, and testing can get expensive, especially with Opus or GPT-4. Here's how I optimize:

*   **Model Tiering:** Use cheaper models (e.g., Claude 3 Sonnet or GPT-3.5) for initial planning or less critical tasks. Only escalate to Opus/GPT-4 for complex coding or critical architecture decisions.
*   **Context Window Management:** Don't send the entire codebase every time. Send only relevant files. Tools like `tree-sitter` or simple file path matching can help identify related files. My YouTube automation pipeline agents, for example, only get the specific script/module they need to modify.
*   **Caching:** For known patterns or frequently asked questions, consider a local cache of generated solutions.
*   **Human-in-the-Loop:** Don't automate everything for the sake of it. The planning phase human review is a massive cost-saver. Catching a mistake there prevents expensive re-generations.

## FAQs

### How do I make my AI agent stop refactoring existing code unnecessarily?
Enforce the "Focus on Incremental Value" principle in your `AGENTS.md`. Explicitly state that refactors must be justified and only occur when requested or when fixing a clear, documented problem.

### Can `AGENTS.md` really stop an LLM from hallucinating or making up functions?
Not entirely, but it significantly reduces it. By requiring the agent to "Understand Deeply" and "Verify Rigorously," you push it to reference existing code and generate tests, which often exposes hallucinations. The "Propose, Justify, Execute" cycle also helps catch issues before code is written.

### Is `AGENTS.md` just a longer system prompt?
No. While it lives in the system prompt, `AGENTS.md` is a *contract*. It's a structured, version-controlled document that defines behavior across multiple interactions and agents, making the agent's actions predictable and aligned with senior engineering standards, rather than just a one-off instruction set.

For more on related topics, check out [AI Chat Data Privacy: Heppner Ruling & Your App](/blog/ai-chat-data-privacy-heppner-ruling-your-app).


Look, turning an AI coding agent into an actual **AI agent senior engineer** isn't about magic prompts. It's about establishing clear, enforceable rules of engagement, just like you would with a human team. `AGENTS.md` gives you that blueprint. Implement it, iterate on it, and watch your code quality jump.