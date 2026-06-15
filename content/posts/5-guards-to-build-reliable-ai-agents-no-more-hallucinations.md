---
title: "5 Guards to build reliable AI agents: No More Hallucinations"
excerpt: "Stop your AI agents from going rogue. Umair shares 5 code-level guards and validation layers he uses to build reliable AI agents, preventing reward-hacking a..."
date: "2026-06-15"
tags: ["AI Agents", "LLM Engineering", "Software Reliability", "Agent Guardrails", "Node.js AI"]
keywords: ["build reliable AI agents", "prevent AI agent hallucination", "AI agent reward hacking mitigation", "autonomous agent guardrails", "multi agent system reliability"]
readTime: "10 min read"
coverGradient: "from-purple-500 to-pink-400"
---

Everyone talks about autonomous agents but nobody tells you how messy they get. Spent weeks debugging why my agents kept going off the rails, hallucinating data or just chasing irrelevant rewards. Here's how I started to build reliable AI agents, really.

## Why Your Agents Go Rogue: Beyond Basic Prompts

Look, LLMs are incredible. They can reason, they can plan, they can even pretend to be human. But autonomous agents built on just LLMs? They're like brilliant toddlers with no common sense or guardrails. You give them a goal, and they'll often find the path of least resistance, or worse, invent a path that makes no sense to you but seems perfectly logical to them. This is where reward-hacking and hallucination bite you.

**Reward-hacking** isn't just for reinforcement learning. In agentic systems, it's when your agent optimizes for a proxy metric instead of the true objective. For instance, my early YouTube automation agents, aiming for "high engagement," started generating clickbait titles for *random* topics, totally ignoring the channel's niche. They "achieved" the prompt's goal, but not the *business* goal.

**Hallucination** isn't just making up facts. It's also making up *actions* or *plans* that aren't possible or sensible given the available tools or context. My FarahGPT agents, if left unchecked, would sometimes propose trading strategies based on non-existent market indicators or misinterpret sentiment data. You can't ship that.

Honestly, RAG (Retrieval Augmented Generation) is overhyped as a silver bullet for hallucination. It helps, sure, by providing better *input* context. But if your *agent's reasoning loop* isn't constrained, it'll still invent things or misinterpret context even with perfect retrieval. The real fix, the one that lets you sleep at night, is explicit validation.

## Deterministic Guards: Your First Line of Defense

This is where actual engineering comes in. Forget "just prompt better." You need hard, deterministic code that says "NO" when an agent goes off-script. These are checks that run *before* or *after* an agent's LLM call, but *before* it takes any irreversible action. Think of them as your agent's strict, non-negotiable parents.

Here are the 5 guards I implement in systems like NexusOS and FarahGPT:

### 1. Output Schema Enforcement

The first thing I do is treat agent output like any other API response: it must conform to a strict schema. If the LLM generates JSON that doesn't fit, it's an immediate red flag. We don't try to "fix" it with another prompt; we catch the error, log it, and decide on a retry or fallback.

This is critical. If your agent is supposed to call a tool, its output *must* be parseable into a `ToolCall` object with `tool_name` and `args`. If it's a final answer, it needs to be a `FinalAnswer` with the `answer` string. Anything else is invalid.

```python
from pydantic import BaseModel, Field, ValidationError
from typing import Literal, Union, Dict, Any

class ToolCall(BaseModel):
    tool_name: str = Field(..., description="Name of the tool to call")
    args: Dict[str, Any] = Field(..., description="Arguments for the tool call")

class FinalAnswer(BaseModel):
    answer: str = Field(..., description="The final answer to the user's query")

class AgentOutput(BaseModel):
    type: Literal["tool_call", "final_answer"]
    payload: Union[ToolCall, FinalAnswer]

def parse_and_validate_agent_output(raw_json_string: str) -> AgentOutput:
    try:
        data = json.loads(raw_json_string)
        # Manually set 'type' for Pydantic if LLM doesn't output it explicitly,
        # or adapt your prompt to ensure the LLM outputs it.
        if "tool_name" in data and "args" in data:
            return AgentOutput(type="tool_call", payload=ToolCall(**data))
        elif "answer" in data:
            return AgentOutput(type="final_answer", payload=FinalAnswer(**data))
        else:
            raise ValueError("LLM output does not match expected structure for tool_call or final_answer.")
    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        # Log this error extensively. This means the LLM didn't follow instructions.
        print(f"AgentOutputValidationError: Malformed agent output: {e}")
        print(f"Raw LLM Output: {raw_json_string}")
        raise

# Example usage (LLM output simulation)
# Valid Tool Call
valid_tool_output = '{"tool_name": "search_web", "args": {"query": "latest AI agent news"}}'
# Invalid (missing 'args')
invalid_tool_output = '{"tool_name": "search_web", "query": "latest AI agent news"}'
# Malformed JSON
malformed_json = '{"tool_name": "search_web", "args": {"query": "latest AI agent news",}'

try:
    parsed = parse_and_validate_agent_output(valid_tool_output)
    print(f"Successfully parsed: {parsed.type} - {parsed.payload}")
    # Successfully parsed: tool_call - tool_name='search_web' args={'query': 'latest AI agent news'}
except Exception as e:
    print(e)

try:
    parse_and_validate_agent_output(invalid_tool_output)
except Exception as e:
    print(e)
    # AgentOutputValidationError: Malformed agent output: 1 validation error for ToolCall
    # args
    # field required (type=value_error.missing)
    # Raw LLM Output: {"tool_name": "search_web", "query": "latest AI agent news"}

```

This simple guard is probably the most effective against basic hallucination of actions. If the LLM generates garbage, it doesn't get executed.

### 2. Action Pre-conditions Validation

Before an agent executes *any* tool or function, you need to check if its pre-conditions are met. This stops agents from calling tools with invalid arguments, or in an illogical sequence.

For example, if your `execute_trade` tool requires a `stock_symbol`, `quantity`, and `price_limit`, you'd check:
*   Are all required fields present?
*   Are they of the correct data type (e.g., `quantity` is an integer, `price_limit` is a float)?
*   Are their values within a sensible range (e.g., `quantity > 0`, `price_limit > 0`)?
*   Does `stock_symbol` actually exist in your allowed list or external API?

```python
def validate_trade_args(tool_call: ToolCall) -> bool:
    if tool_call.tool_name != "execute_trade":
        return True # Not our tool, pass

    args = tool_call.args
    required_fields = ["symbol", "quantity", "price_limit"]

    for field in required_fields:
        if field not in args:
            print(f"Error: Missing required field '{field}' for execute_trade.")
            return False

    try:
        symbol = str(args["symbol"])
        quantity = int(args["quantity"])
        price_limit = float(args["price_limit"])
    except ValueError:
        print("Error: Invalid data types for trade arguments.")
        return False

    if quantity <= 0:
        print("Error: Quantity must be positive.")
        return False
    if price_limit <= 0:
        print("Error: Price limit must be positive.")
        return False

    # Example: Check if symbol is valid (e.g., against an allow-list or external API)
    # This is a critical check to prevent agents from trading non-existent assets (hallucination)
    valid_symbols = {"AAPL", "GOOGL", "MSFT"} # Replace with real lookup
    if symbol not in valid_symbols:
        print(f"Error: Invalid stock symbol '{symbol}'.")
        return False

    return True

# In your agent loop:
# parsed_action = parse_and_validate_agent_output(llm_response_json)
# if parsed_action.type == "tool_call" and not validate_trade_args(parsed_action.payload):
#     raise AgentActionInvalidError("Trade action failed pre-conditions.")
# else:
#     # Proceed to execute tool
```

This prevents the agent from even *attempting* to make an invalid trade, which is a common form of reward-hacking (trying to push garbage through to get to the "done" state).

### 3. State Transition Validation

Autonomous agents often operate in defined states (e.g., `PLANNING`, `GATHERING_DATA`, `ANALYZING`, `EXECUTING`, `REPORTING`). You can enforce valid transitions between these states. An agent trying to jump from `PLANNING` directly to `EXECUTING` without `GATHERING_DATA` and `ANALYZING`? Blocked.

This is particularly useful for complex multi-agent systems like NexusOS, where agents hand off tasks. Ensuring they follow the prescribed workflow path is crucial for `multi agent system reliability`.

```python
from enum import Enum

class AgentState(Enum):
    INITIAL = "initial"
    PLANNING = "planning"
    GATHERING_DATA = "gathering_data"
    ANALYZING = "analyzing"
    EXECUTING = "executing"
    REPORTING = "reporting"
    DONE = "done"

VALID_TRANSITIONS = {
    AgentState.INITIAL: [AgentState.PLANNING],
    AgentState.PLANNING: [AgentState.GATHERING_DATA, AgentState.REPORTING, AgentState.DONE], # Report if plan says no action needed
    AgentState.GATHERING_DATA: [AgentState.ANALYZING],
    AgentState.ANALYZING: [AgentState.EXECUTING, AgentState.REPORTING], # Report if analysis says no execution
    AgentState.EXECUTING: [AgentState.REPORTING],
    AgentState.REPORTING: [AgentState.DONE],
    AgentState.DONE: [] # Terminal state
}

def is_valid_transition(current_state: AgentState, proposed_state: AgentState) -> bool:
    if proposed_state in VALID_TRANSITIONS.get(current_state, []):
        return True
    print(f"Invalid state transition: {current_state.value} -> {proposed_state.value}")
    return False

# In your agent state update logic:
# if not is_valid_transition(self.current_state, proposed_next_state):
#     raise InvalidAgentStateTransitionError(f"Agent tried to jump from {self.current_state} to {proposed_next_state}")
# self.current_state = proposed_next_state
```

This prevents agents from taking shortcuts or getting lost in the workflow, a subtle form of reward-hacking where they try to reach the "done" state without doing the actual work.

### 4. Loop Counter & Max Iterations

This is simple, but often overlooked until an agent gets stuck in an infinite loop, burning through your Claude API credits. Agents can get into conversational loops, or repeatedly try invalid actions. A hard limit on iterations is a must.

```python
MAX_AGENT_ITERATIONS = 15 # A reasonable number for most tasks

# In your agent's main loop:
for iteration_count in range(MAX_AGENT_ITERATIONS):
    # Get agent's next action
    # ...
    if should_terminate_agent_task(agent_action): # Agent decided it's done
        break
    # Execute action
    # ...

else: # This block executes if the loop completed without a 'break'
    print(f"Agent exceeded MAX_AGENT_ITERATIONS ({MAX_AGENT_ITERATIONS}). Forcing termination.")
    raise AgentMaxIterationsExceededError("Agent failed to complete task within limits.")
```

This is a brute-force `autonomous agent guardrail`, but it's essential for preventing runaway costs and ensuring eventual termination.

## Pre-computation Validation Layers: The Second Wall Against Chaos

These layers operate at a higher level, often *outside* a single agent's immediate loop, or after a full agent pipeline has run. They validate the *results* of agent work, or provide external context that the agent might not consider. This is where you catch more subtle `AI agent reward hacking mitigation` issues and `prevent AI agent hallucination` at a systemic level.

### 1. Semantic Consistency Checks

Does the agent's proposed action or conclusion make *semantic sense* in the broader context? This requires external data or a separate "critique" agent.

For FarahGPT, if an agent proposes a "strong buy" signal for gold, but a separate, independent sentiment analysis pipeline (trained on different data, with different models) indicates "extreme bearish sentiment" for the overall market, that's a red flag. The agent isn't necessarily hallucinating facts, but it might be misinterpreting context or over-optimizing for its local goal.

```python
def check_market_consistency(agent_trade_signal: str, market_sentiment_score: float) -> bool:
    if agent_trade_signal == "BUY" and market_sentiment_score < -0.5: # Market very bearish
        print(f"Warning: Agent proposed BUY despite strong bearish market sentiment ({market_sentiment_score}). Flagging for review.")
        return False
    if agent_trade_signal == "SELL" and market_sentiment_score > 0.5: # Market very bullish
        print(f"Warning: Agent proposed SELL despite strong bullish market sentiment ({market_sentiment_score}). Flagging for review.")
        return False
    return True

# In your post-agent processing:
# current_market_sentiment = get_global_market_sentiment() # Call an external analysis service
# if not check_market_consistency(farah_agent_output.trade_signal, current_market_sentiment):
#     send_alert_to_analyst(farah_agent_output)
```

This type of check is crucial for `multi agent system reliability` in complex domains where agents might have specialized but limited views.

### 2. External Data Source Verification

**Never trust an LLM for critical factual data.** If an agent needs a current stock price, a product ID, or a user's balance, it *must* retrieve that information directly from a canonical, trusted external API or database. And then, *you* must verify the retrieved data.

My YouTube automation pipeline agents, early on, would sometimes hallucinate channel IDs or video URLs if the search prompt was ambiguous. This would lead to errors like `youtube_api.get_video_details failed: Video not found or invalid ID: 'UCx-xxxxxxxxxx_invalid_id'`. The fix? Always, always, *always* re-verify fetched IDs against the source API if there's any doubt, or fetch them directly in the agent's tool.

```python
def verify_product_id(product_id: str) -> bool:
    # This function would make an actual API call or DB lookup
    # to confirm the product_id exists and is valid.
    # DON'T rely on the LLM's "knowledge" of product IDs.
    try:
        # Example: Call your e-commerce product API
        response = my_ecommerce_api.get_product_details(product_id)
        if response and response.status_code == 200:
            return True
        return False
    except Exception as e:
        print(f"Error verifying product ID {product_id}: {e}")
        return False

# In your agent's tool execution or post-processing:
# if not verify_product_id(agent_proposed_product_id):
#     raise InvalidDataError(f"Product ID '{agent_proposed_product_id}' could not be verified.")
```

This guard is a direct counter to `prevent AI agent hallucination` of factual data or identifiers.

### 3. Human-in-the-Loop Thresholds

For high-stakes actions (e.g., executing a financial trade, deleting data, making public posts), you need human oversight. Define confidence thresholds or risk levels that, when crossed, automatically trigger a human review.

FarahGPT's trading system has a rule: "If the agent's internal confidence score for a trade is below 0.7, or the potential trade value exceeds $10,000, send to a human analyst for approval."

```python
class ProposedAction(BaseModel):
    action_type: str
    risk_level: Literal["LOW", "MEDIUM", "HIGH"]
    estimated_impact: float # e.g., monetary value, number of users affected
    agent_confidence: float # Agent's self-assessed confidence (if your agent provides it)

HIGH_RISK_THRESHOLD = 0.8
HIGH_IMPACT_THRESHOLD = 5000.0 # e.g., $5000 value
MIN_AGENT_CONFIDENCE = 0.7

def requires_human_review(action: ProposedAction) -> bool:
    if action.risk_level == "HIGH":
        return True
    if action.estimated_impact > HIGH_IMPACT_THRESHOLD:
        return True
    if action.agent_confidence < MIN_AGENT_CONFIDENCE:
        return True
    return False

# After an agent proposes a high-stakes action:
# if requires_human_review(agent_proposed_action):
#     send_to_human_queue(agent_proposed_action)
# else:
#     execute_action(agent_proposed_action)
```

This is your ultimate `autonomous agent guardrail` for critical operations, ensuring accountability and preventing catastrophic errors from agent misbehavior.

## What I Got Wrong First

Building production AI agents means learning the hard way. I've made plenty of mistakes.

My biggest initial mistake was assuming "strong prompting alone will fix it." I thought if I just crafted the perfect system prompt, my agents would magically behave. Nope. My early YouTube automation agents would sometimes generate video scripts for entirely different topics if a single keyword in the user request was slightly off, even with explicit instructions. This led to an `AgentTopicDriftError: Proposed video topic 'Gardening Tips' is inconsistent with channel focus 'Tech Reviews'.`

Another massive blunder was "relying on LLM for factual accuracy." I had agents for NexusOS trying to configure cloud resources based on hallucinated YAML structures for specific `kubectl` commands. Almost blew up a dev environment because the LLM *sounded* confident but was completely wrong about an obscure config flag. **Always validate against actual API docs or schema, never trust the LLM for precise factual details in critical operations.**

The fix for both? Explicit, deterministic code checks at *every* critical step. No magical thinking, just solid software engineering principles applied to probabilistic models. You're building a system, not just prompting an API.

## Optimization & Gotchas: Trimming the Fat

Implementing all these guards adds overhead. You need to be smart about it.

*   **Performance:** Each guard is a computation. Some are cheap (schema validation), others can be expensive (external API calls, semantic consistency checks). Be selective. Prioritize guards on high-impact, high-risk actions. Cache static external data where possible.
*   **False Positives:** Overly strict guards can block perfectly valid agent behavior, leading to frustration and manual overrides. Start permissive and tighten as you identify specific failure modes in production. This is an iterative process.
*   **Monitoring:** It's absolutely crucial to log *why* a guard fired. Which specific condition failed? What was the agent's state and proposed action? This data is invaluable for refining both your prompts *and* your guards, and ultimately, improving `multi agent system reliability`.

## FAQs

*   **Q: Does RAG help with hallucination?**
    A: Yes, RAG definitely helps by providing relevant, factual information to the LLM. However, it primarily improves the *quality of the input data*. Deterministic guards, on the other hand, validate the *output and actions* of the agent. You need both for truly reliable systems.

*   **Q: How do you handle agents getting stuck in a loop?**
    A: Max iteration counters are your first line of defense; they're essential. Beyond that, a meta-agent or external monitoring system can detect repeating states or sequences of actions, and then force a reset, trigger a different fallback strategy, or alert a human for intervention.

*   **Q: Are these guards expensive to implement?**
    A: Initial setup requires engineering time, which is an investment. However, it saves countless hours of debugging, prevents costly production errors, reduces API costs from runaway agents, and builds user trust. It's not an expense; it's fundamental to shipping anything reliable.

Building reliable AI agents isn't about some secret prompt engineering sauce. It's about treating autonomous agents like any other