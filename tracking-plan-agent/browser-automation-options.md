# Browser Automation Options Evaluation

Reference comparison of browser automation tools for the [Tracking Plan Generator](PRD.md) event discovery stage. Evaluates each tool against the six [Browser Automation Layer Requirements](PRD.md#browser-automation-layer-requirements), LLM compatibility for a custom agent loop, and estimated cost for a representative scenario.

## Tools Evaluated

| Tool | Maintainer | License | Language | Description |
|---|---|---|---|---|
| **Playwright** | Microsoft | Apache-2.0 | Node.js, Python, .NET, Java | Browser automation library with full CDP and native API access |
| **Browser Use** | Browser Use | MIT | Python | LLM-driven browser agent built on CDP and Pydantic AI |
| **Stagehand** | Browserbase | MIT | TypeScript | AI-native browser framework with `act`/`observe`/`extract` APIs, Playwright-style interface over CDP |
| **Anthropic Computer Use** | Anthropic | — | API (any language) | Screenshot-based computer interaction via Claude's vision |
| **Firecrawl** | Firecrawl (Mendable) | AGPL-3.0 | API + SDKs (Node.js, Python, Go, Rust) | Web crawling and scraping platform with limited interaction |
| **Hyperbrowser** | Hyperbrowser | Proprietary | API + SDKs (Node.js, Python) | Cloud browser platform with agent integration layer |

## Capability Comparison

Each cell indicates whether the tool provides the capability as a first-class API (`Yes`), provides it indirectly through an underlying layer the developer must access themselves (`Indirect`), or does not support it (`No`).

| Capability | Playwright | Browser Use | Stagehand | Computer Use | Firecrawl | Hyperbrowser |
|---|---|---|---|---|---|---|
| **Network observation** | Yes | Indirect | Yes | No | No | Indirect |
| **JavaScript evaluation** | Yes | Indirect | Yes | No | No | Indirect |
| **Accessibility tree snapshots** | Yes | Yes | Yes | No | No | Indirect |
| **Console and error capture** | Yes | Indirect | Yes | No | No | Indirect |
| **Interaction primitives** | Yes | Yes | Yes | Yes | Limited | Yes |
| **Multi-page and frame handling** | Yes | Limited | Yes | Limited | No | Indirect |
| **Meets all 6 requirements** | **Yes** | No | **Yes** | No | No | No |

### Capability Notes

**[Playwright](https://playwright.dev/docs/api/class-page)** meets all six requirements natively. Every capability has a documented, first-class API: [network events](https://playwright.dev/docs/api/class-page#page-event-request) (`page.on('request')`, `page.on('response')`), [script injection](https://playwright.dev/docs/api/class-page#page-add-init-script) (`page.addInitScript()`, `page.evaluate()`), [accessibility snapshots](https://playwright.dev/docs/aria-snapshots), [console capture](https://playwright.dev/docs/api/class-page#page-event-console), [locator-based interaction](https://playwright.dev/docs/api/class-locator), and [frame handling](https://playwright.dev/docs/api/class-framelocator). It is the foundation layer — the other tools either build on it or on the Chrome DevTools Protocol (CDP) it also uses.

**[Browser Use](https://docs.browser-use.com/open-source/introduction)** operates through CDP and provides its own interaction and [accessibility tree abstractions](https://docs.browser-use.com/open-source/agent). Network observation, JavaScript evaluation, and console capture are available through the [underlying CDP connection](https://docs.browser-use.com/open-source/browsers) but require the developer to hook into Browser Use's internal browser context rather than calling a dedicated API. Multi-page handling is limited to basic tab management.

**[Stagehand](https://docs.stagehand.dev/)** provides Playwright-style `page` and `locator` APIs and drives the browser over CDP directly (v4 has [no Playwright or Puppeteer dependency](https://docs.stagehand.dev/v4/reference/page)). All six capabilities are accessible: Stagehand's own [`act`/`observe`/`extract`](https://docs.stagehand.dev/v4/basics/act) APIs handle interaction and accessibility interpretation, while the [page API](https://docs.stagehand.dev/v4/reference/page) provides network observation, JavaScript evaluation, console capture, and frame handling. Stagehand uses [Browserbase](https://docs.stagehand.dev/v4/configuration/browser) for cloud execution.

**[Anthropic Computer Use](https://platform.claude.com/docs/en/agents-and-tools/computer-use)** operates at the screenshot and coordinate level. It can click, type, scroll, and take screenshots, but it has no access to the DOM, network layer, JavaScript runtime, accessibility tree, or console. The [documentation recommends the browser use tool](https://platform.claude.com/docs/en/agents-and-tools/computer-use) for tasks that stay within web pages. This makes it effective for visual exploration but unsuitable for the signal capture that event discovery requires (network traffic, DOM mutations, storage changes).

**[Firecrawl](https://docs.firecrawl.dev/)** is designed for crawling and content extraction, not interactive exploration. Its ["Interact" mode](https://docs.firecrawl.dev/features/interact) allows basic actions (click, fill, select) through natural language prompts or code, but it provides no network interception, no JavaScript injection, no accessibility tree access, and no multi-page session handling. Sessions have a [default 10-minute TTL and 5-minute inactivity timeout](https://docs.firecrawl.dev/features/interact). It cannot maintain authenticated sessions across page navigations in the way the event discovery agent requires.

**[Hyperbrowser](https://hyperbrowser.ai/docs)** provides a cloud browser that can be driven via [Playwright](https://hyperbrowser.ai/docs/sessions/playwright), [Puppeteer](https://hyperbrowser.ai/docs/sessions/puppeteer), or Selenium, plus its own [HyperAgent](https://hyperbrowser.ai/docs/agents/overview) integration layer (an open-source Playwright-powered framework). The underlying Playwright/Puppeteer capabilities (network observation, JavaScript evaluation, accessibility tree, console capture, frame handling) are accessible through raw sessions, but Hyperbrowser's agent layer does not expose them as first-class APIs. The developer would need to work through the raw Playwright/Puppeteer session, reducing Hyperbrowser's value-add to its cloud infrastructure.

## Custom Agent Loop Compatibility

The event discovery agent uses a custom agent loop (Option A in the PRD) where an LLM reasoning layer drives a browser automation layer. This table evaluates whether each tool can execute that pattern with each LLM provider.

| Tool | Claude | ChatGPT / GPT | Codex (OpenAI) |
|---|---|---|---|
| **Playwright** | Yes | Yes | Yes |
| **Browser Use** | Yes | Yes | Yes |
| **Stagehand** | Yes | Yes | Indirect |
| **Computer Use** | Yes | No | No |
| **Firecrawl** | N/A | N/A | N/A |
| **Hyperbrowser** | Yes | Yes | Indirect |

### Compatibility Notes

**[Playwright](https://playwright.dev/)** is LLM-agnostic. It is a browser automation library with no LLM coupling — the developer writes the agent loop and can use any LLM for the reasoning layer. This is the maximum-flexibility option.

**[Browser Use](https://docs.browser-use.com/open-source/models)** has built-in LLM abstractions supporting `ChatAnthropic` (Claude), `ChatOpenAI` (GPT models), `ChatGoogleGenerativeAI` (Gemini), and any OpenAI-compatible endpoint. Claude, GPT, and Codex models (via OpenAI's API) all work. Custom actions can be defined with the [`@controller.action` decorator](https://docs.browser-use.com/open-source/tools).

**[Stagehand](https://docs.stagehand.dev/v4/configuration/models)** supports any LLM provider by name or via a custom client-side LLM callback, including [Claude and OpenAI integrations](https://docs.stagehand.dev/v4/configuration/models). Codex models would need to be accessed through OpenAI's API (indirect, since Stagehand's LLM abstraction targets chat-optimized models). A fully custom agent loop is possible by using Stagehand's `page` object directly and calling any LLM separately.

**[Anthropic Computer Use](https://platform.claude.com/docs/en/agents-and-tools/computer-use)** is a Claude-specific tool type (`computer_20251124` / `computer_toolset_20260801`). It is defined in the Anthropic API and only works with Claude models. There is no equivalent for GPT or Codex.

**[Firecrawl](https://docs.firecrawl.dev/features/interact)** is not designed for custom agent loops. Its LLM usage is internal to its extract mode (using an LLM to structure crawled content). It does not expose a browser session that an external LLM can drive interactively. Marked N/A because the tool does not support the pattern.

**[Hyperbrowser](https://hyperbrowser.ai/docs/hyperagent/llm-providers)** provides an agent integration layer with built-in support for [Claude, OpenAI, and Google Gemini](https://hyperbrowser.ai/docs/hyperagent/llm-providers) as LLM providers. Codex models would need to go through OpenAI's API. The developer can also bypass the agent layer and use the [raw Playwright/Puppeteer session](https://hyperbrowser.ai/docs/sessions/playwright) with any LLM.

## Cost Estimation

### Scenario

> An 8-page web application with 3 user types (visitor, user, customer). A customer can conduct 5 searches, and those search results are saved indefinitely for the customer to revisit.

### Exploration Scope

| Dimension | Estimate | Rationale |
|---|---|---|
| Page-role combinations | 24 | 8 pages x 3 user types |
| Interactions per page | 8 | Average: buttons, links, forms, tabs, modals |
| Search flows (customer) | 5 | As specified — includes verifying saved results persist |
| Auth flows | 3 | One login per user type |
| Total interactions | ~200 | 24 page-roles x 8 interactions + search flows + auth |
| API requests captured | ~400-1,000 | ~2-5 API calls per interaction (navigation, data fetches, mutations) |
| API responses captured | ~400-1,000 | Paired with requests — response bodies provide data shapes and property names |
| Active browser time | ~30-45 min | ~4 sec per interaction (navigate, capture, interpret) + setup |

### LLM Token Estimates

Each interaction requires the reasoning layer to receive observations (accessibility tree snapshot, network delta, console output) and produce a decision plus an interpretation.

| Per interaction | Input tokens | Output tokens |
|---|---|---|
| Accessibility tree snapshot | ~1,500 | — |
| Network delta (request/response shapes) | ~1,000 | — |
| Console output + context | ~500 | — |
| LLM decision + interpretation | — | ~350 |
| **Subtotal per interaction** | **~3,000** | **~350** |

| Aggregate | Input tokens | Output tokens |
|---|---|---|
| ~200 interactions | 600,000 | 70,000 |
| Exploration planning + state tracking | 150,000 | 25,000 |
| Final event inventory assembly | 50,000 | 15,000 |
| **Total** | **~800,000** | **~110,000** |

### LLM Cost by Model

Prices are Anthropic first-party API rates (per 1M tokens). OpenAI prices are approximate and may vary.

| Model | Input $/1M | Output $/1M | Input cost | Output cost | **Total LLM cost** |
|---|---|---|---|---|---|
| Claude Sonnet 5.5 | $2.00 | $10.00 | $1.60 | $1.10 | **$2.70** |
| Claude Opus 5.5 | $4.00 | $20.00 | $3.20 | $2.20 | **$5.40** |
| Claude Haiku 5.5 | $0.10 | $0.50 | $0.08 | $0.06 | **$0.14** |
| GPT-4o (OpenAI) | ~$2.50 | ~$10.00 | ~$2.00 | ~$1.10 | **~$3.10** |
| GPT-4o mini (OpenAI) | ~$0.15 | ~$0.60 | ~$0.12 | ~$0.07 | **~$0.19** |

### Browser Infrastructure Cost

| Tool | Pricing model | Estimated cost for scenario | Notes |
|---|---|---|---|
| **Playwright** (self-hosted) | Free | **$0.00** | Runs locally or on own infrastructure |
| **Browser Use Cloud** | $0.06/browser-hour | **~$0.05** | ~45 min of browser time |
| **Browserbase (Stagehand)** | Free: 1 hr; then $0.12-$0.20/hr | **$0.00** (free tier) | Free tier covers this scenario |
| **Anthropic Computer Use** | No separate browser fee | **$0.00** | Cost is in LLM tokens only (~1,000-1,800 tokens per screenshot; total LLM cost would be significantly higher due to screenshot-based approach) |
| **Firecrawl** | 7 credits/browser-min (Interact prompt); 2 credits/min (code-only) | **~315 credits** (prompt) / **~90 credits** (code) | ~45 min; Standard plan: $99/100k credits |
| **Hyperbrowser** | Credit-based | **Varies** | Free: 5,000 credits; Startup: $30/30k credits |

### Total Estimated Cost (Browser + LLM)

Using Claude Sonnet 5.5 as the reasoning layer (recommended balance of capability and cost):

| Tool combination | Browser cost | LLM cost | **Total** |
|---|---|---|---|
| **Playwright + Claude Sonnet 5.5** | $0.00 | $2.70 | **$2.70** |
| **Browser Use + Claude Sonnet 5.5** | $0.05 | $2.70 | **$2.75** |
| **Stagehand + Claude Sonnet 5.5** | $0.00 | $2.70 | **$2.70** |
| **Computer Use + Claude Sonnet 5.5** | $0.00 | ~$8-15 | **~$8-15** |
| **Firecrawl** | ~$0.09 | N/A | N/A (insufficient capabilities) |
| **Hyperbrowser + Claude Sonnet 5.5** | Varies | $2.70 | **$2.70+** |

Computer Use's LLM cost is significantly higher because every observation is a full screenshot (~1,000-1,800 tokens each) rather than a structured accessibility tree snapshot (~1,500 tokens), and the approach requires more back-and-forth cycles to accomplish the same interactions since it cannot read the DOM or network layer directly.

### Cost Assumptions and Caveats

- Token estimates assume structured observations (accessibility tree + network deltas), not raw HTML or full screenshots.
- Prompt caching (Anthropic) can reduce input token costs by up to 90% for repeated context (system prompts, tool definitions, exploration state). With caching, LLM costs could drop to ~$0.50-$1.00 for Claude Sonnet 5.5.
- The scenario is a small application. Costs scale roughly linearly with the number of pages, user types, and interactive elements.
- Estimates do not include development time, infrastructure setup, or retry/error handling overhead.

## Summary

Only **Playwright** and **Stagehand** meet all six browser automation requirements as first-class capabilities. Stagehand achieves this by building on Playwright and exposing the underlying Playwright APIs alongside its own AI-native abstractions.

For the custom agent loop pattern required by the event discovery agent:
- **Playwright** offers maximum flexibility — any LLM, any language, full control.
- **Stagehand** adds AI-native convenience (`act`/`observe`/`extract`) on top of Playwright, at the cost of a Browserbase dependency and TypeScript-only SDK.
- **Browser Use** supports multiple LLMs and has lower setup friction, but falls short on network observation and multi-page handling without reaching into its internals.
- **Anthropic Computer Use** is Claude-only and lacks the structured signal capture the event discovery agent needs.
- **Firecrawl** and **Hyperbrowser** are not designed for this use case.

For the specified scenario (8 pages, 3 user types, 5 customer searches), total cost is approximately **$2.70-$5.40** depending on the LLM model chosen, with browser infrastructure adding negligible cost for Playwright, Browser Use, or Stagehand.
