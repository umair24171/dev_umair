---
title: "I Cloned the Leaked Claude Code Repo — Here's What's Actually Inside"
excerpt: "Anthropic accidentally leaked Claude Code's full source on March 31 2026. I cloned the claw-code repo and read the actual files. Here's the real tool list and architecture."
date: "2026-04-01"
tags: ["Claude Code", "AI Agents", "Open Source", "Anthropic"]
keywords: ["Claude Code source code leaked", "claw-code github", "Claude Code internal tools", "Claude Code agent architecture", "Claude Code npm leak", "Anthropic Claude Code open source"]
readTime: "8 min read"
coverGradient: "from-orange-500 to-amber-400"
---

# I Cloned the Leaked Claude Code Repo — Here's What's Actually Inside

On March 31, 2026, Anthropic accidentally shipped the full Claude Code source — 512,000 lines of TypeScript across 1,906 files — via an exposed npm source map in `@anthropic-ai/claude-code` v2.1.88. A Korean developer named Sigrid Jin rewrote the whole thing in Python overnight. The [claw-code repo](https://github.com/instructkr/claw-code) hit 80,000 GitHub stars within hours. I cloned it the same day and actually read the files. Here's what's real and what matters.

---

## What Actually Leaked (And Why It's a Big Deal)

The Claude Code source code leaked through the dumbest possible channel: a developer forgot to strip source maps before publishing to npm. Source maps are meant for debugging. They map minified JS back to the original TypeScript. In this case, they contained the full, readable source.

512K lines. 1,906 files. Not a partial view. The whole thing.

Sigrid Jin scraped those source maps, stitched the TypeScript back together, then spent a night translating the architecture into Python. The claw-code repo is that Python port. And when devs figured out what it was, the repo hit 80K stars inside two hours.

---

## What Tools Does Claude Code Have Internally?

This is the part I was most curious about. I dug through `tools_snapshot.json` and `commands_snapshot.json` — not the README — and here's the real picture.

Claude Code ships with **30+ internal tools**. Here's what they actually do:

| Tool | What It Does | Why It Matters |
|------|-------------|----------------|
| `AgentTool` | Spawns sub-agents: `planAgent`, `exploreAgent`, `verificationAgent`, `generalPurposeAgent` | Claude thinks in specialized roles, not one monolithic loop |
| `BashTool` | Runs shell commands — with `bashSecurity`, `bashPermissions`, `destructiveCommandWarning` | Has built-in awareness of dangerous operations before running them |
| `FileReadTool` | Reads files from disk | Standard file I/O |
| `FileEditTool` | Edits files with targeted diffs | Surgical changes, not full rewrites |
| `FileWriteTool` | Creates new files | Standard file I/O |
| `GlobTool` | Pattern-based file search | Faster than recursive grep for file discovery |
| `GrepTool` | Content search via ripgrep | The actual workhorse for code search |
| `LSPTool` | Language Server Protocol integration | Type-aware navigation — knows what a symbol *is*, not just where it appears |
| `MCPTool` | Connects to MCP servers | Plugin architecture for external tools |
| `McpAuthTool` | Handles MCP auth flows | OAuth/token handling for MCP connections |
| `TaskCreateTool` | Creates tracked internal tasks | Full internal task management — separate from todos |
| `TaskUpdateTool` | Updates task state | Status transitions: pending → in_progress → done |
| `TaskGetTool` | Fetches a task by ID | Read individual task records |
| `TaskListTool` | Lists all active tasks | Full queue visibility |
| `TaskStopTool` | Cancels a running task | Interrupt-safe task cancellation |
| `TeamCreateTool` | Creates an agent team | Multi-agent coordination primitive |
| `TeamDeleteTool` | Deletes a team | Cleanup after parallel work completes |
| `CronCreateTool` | Creates scheduled cron jobs | The agent can schedule its own future work |
| `CronListTool` | Lists active cron jobs | See what's scheduled |
| `CronDeleteTool` | Removes a cron job | Cancel scheduled work |
| `WebFetchTool` | Fetches a URL | HTTP GET with content restrictions |
| `WebSearchTool` | Web search | Grounded responses via live search |
| `SkillTool` | Loads and executes skills | Modular capability injection |
| `EnterPlanModeTool` | Puts the agent into planning mode | Separates thinking from acting |
| `ExitPlanModeTool` | Returns to execution mode | End of planning phase |
| `EnterWorktreeTool` | Creates an isolated git worktree | Safe sandboxed file changes |
| `SendMessageTool` | Sends messages between agents | The backbone of inter-agent communication |
| `TodoWriteTool` | Writes a structured todo list | Persistent task tracking for users |
| `BriefTool` | Generates a context brief | Fast session summary for new agents |
| `SleepTool` | Pauses execution | Wait between polling operations |
| `forkSubagent` | Forks a new child agent | Spawn parallel workers |
| `spawnMultiAgent` | Spawns multiple agents simultaneously | Fan-out parallel execution |

That's not a chatbot tool list. That's an operating system for agents.

---

## How Does Claude Code's Agent Loop Work?

The architecture lives in `runtime.py`. The turn loop is cleaner than I expected — no magic, just structured flow control.

```python
# runtime.py — simplified turn loop structure

def bootstrap_session(session_id: str) -> SessionContext:
    # Loads permissions, history, MCP connections, workspace config
    return SessionContext(...)

def route_prompt(prompt: str, registry: ToolRegistry) -> RouteResult:
    # Scores the prompt against tool/command registry using keyword weights
    # Returns matched tool + confidence score
    return RouteResult(tool=matched_tool, score=score)

def run_turn_loop(ctx: SessionContext, max_turns: int = 50) -> TurnResult:
    turn = 0
    while turn < max_turns:
        result = route_prompt(ctx.current_prompt, ctx.registry)
        if result.is_terminal:
            break
        response = result.tool.execute(ctx)
        ctx.update(response)
        turn += 1
    return TurnResult(ctx)

def persist_session(ctx: SessionContext) -> None:
    # Saves state: tool results, task queue, cron jobs, conversation history
    storage.write(ctx.session_id, ctx.serialize())
```

The `max_turns` safety limit is real. Claude Code won't run forever in a broken loop. `route_prompt()` doesn't use LLM reasoning to pick tools; it scores against a registry. That's fast and predictable. The session persistence through `persist_session()` is what makes cron jobs and task queues survive across turns.

---

## What Actually Surprised Me

I build agents for a living. I have 5 Node.js agents running on Render right now managing a gold trading system. So I'm not easily impressed by agent architectures.

Three things I didn't expect:

**`CronCreateTool`**: the agent schedules its own future work. It's not just reacting to user prompts; it can set a reminder to run a verification check in 30 minutes. That's a different category of capability.

**`EnterPlanModeTool` / `ExitPlanModeTool`**: there's a hard mode switch between planning and acting. The agent doesn't plan and act in the same turn. This prevents the failure mode where reasoning leaks into execution prematurely. I've been bitten by that pattern more than once.

**`forkSubagent` + `spawnMultiAgent`**: parallel agent spawning is a first-class primitive here, not a workaround. The `TeamCreateTool` coordinates them. This is the part that most agent frameworks bolt on as an afterthought. Claude Code built it into the core.

One thing that only becomes clear when you read `tools_snapshot.json` directly: the `AgentTool` doesn't just spawn generic sub-agents. It selects from typed agent roles — `planAgent`, `exploreAgent`, `verificationAgent`, `generalPurposeAgent` — each with a different system prompt and tool subset baked in. The specialization happens at spawn time, not at runtime.

---

## What I'm Taking Back to My Own Agent System

My current Node.js agents pass state around through Redis. It works, but it's messy. Here's what I'm pulling from this:

The **turn loop pattern** from `runtime.py` is cleaner than what I have. The `max_turns` guard with an `is_terminal` check is something I should have added months ago.

The **task registry pattern** (`TaskCreate/Update/Get/List/Stop`) is basically a mini job queue baked into the agent itself. I'm rebuilding my task management to match this model instead of relying on Redis lists.

The **`SendMessageTool` pattern** for inter-agent messaging. Right now my agents communicate by writing to a shared DB table. That's not designed, it just evolved that way. Named message passing between agents is cleaner and easier to debug.

---

## Honest Take: Is claw-code Actually Useful?

No, if you're expecting working code. The repo is mostly type stubs and architectural scaffolding. Sigrid Jin translated the *shape* of Claude Code, not a running implementation of it. There's no actual BashTool executor in there. The LSP integration is a skeleton.

That said, it's the most detailed public view of how a production AI agent system is actually structured. The architecture it reveals is more valuable than any tutorial I've read this year. The Claude Code agent architecture is unusually thoughtful — most of what I see in the wild is just a while loop with a tool call.

Don't clone it expecting to run it. Clone it to read it.

---

## FAQ

### What was in the Claude Code leak?

The full TypeScript source of Claude Code — 512,000 lines across 1,906 files — exposed via an npm source map in `@anthropic-ai/claude-code` v2.1.88. It included tool definitions, agent architecture, the turn loop runtime, session management, and internal command registry.

### Is claw-code the actual Claude Code source?

No. claw-code is a Python port of the leaked TypeScript, written by Sigrid Jin. It replicates the architecture and structure but is not the original source and doesn't run as a working tool.

### What tools does Claude Code have internally?

30+ tools including `AgentTool`, `BashTool`, `FileReadTool/EditTool/WriteTool`, `GlobTool`, `GrepTool`, `LSPTool`, `MCPTool`, a full task management suite (`TaskCreate/Update/Get/List/Stop`), `TeamCreateTool`, cron job tools, `WebFetchTool`, `WebSearchTool`, `EnterPlanModeTool`, `SendMessageTool`, `forkSubagent`, `spawnMultiAgent`, and more.

### Can I use claw-code in my own projects?

The repo is public and the Anthropic source code was accidentally made public via the npm source map. The legal question of whether you can ship production code derived from it is genuinely unresolved. Read the architecture. Don't ship it in a product until there's clarity on that.

---

**Repo:** [github.com/instructkr/claw-code](https://github.com/instructkr/claw-code)

The best thing Anthropic did for the AI agent community this week was make a mistake.
