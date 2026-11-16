# PRD: Tracking Plan Agent

## 1. Overview

The Tracking Plan Agent is an agentic process that automates three stages of analytics tracking plan development:

1. **Event Discovery** — Identify and inventory the events, values, and states that need to be tracked on a client's web application.
2. **Taxonomy Generation** — Transform the raw event inventory into a structured event taxonomy.
3. **Tracking Plan Creation** — Produce a customized tracking plan from the [Tracking Plan Template](../tracking-plan-template/tracking-plan-template.md), populated with the client's taxonomy and application specifics.

### Two Routes to Event Discovery

Event discovery — the inventorying stage — can follow two distinct routes:

- **Interactive exploration (agent-as-user)** — A browser automation agent navigates the web application as a user would, interacting with features, capturing network traffic, DOM mutations, URL changes, and state transitions.
- **Codebase review (static analysis)** — An agent reads the application source code, tracing routes, event handlers, API calls, state management, and permission logic to discover trackable events.

**This spec focuses on the interactive exploration route.** The primary reasons for leading with interactive exploration:

- **Dynamic content** — CMS-driven pages, A/B test variants, and feature-flagged experiences only manifest at runtime. Static analysis of the codebase cannot surface them.
- **Third-party behavior** — Analytics SDKs, chat widgets, ad pixels, and tag managers inject behavior at runtime that does not appear in the application's own codebase.

### The Two Routes Are Best Used in Combination

Interactive exploration surfaces what the running application actually does, while codebase review provides exhaustive coverage of what the code declares. Separate documentation for the codebase review route will be created at a later time. Each method has distinct accuracy strengths.

**Interactive exploration is more accurate for:**

- **Dynamic content** — CMS-driven pages, A/B test variants, and feature-flagged experiences only manifest at runtime
- **Third-party behavior** — Analytics SDKs, chat widgets, ad pixels, and tag managers inject behavior at runtime that doesn't appear in the application's own codebase
- **Runtime truth** — Code can be dead, behind feature flags, or behave differently at runtime than it reads; interactive exploration confirms what actually executes

**Codebase review is more accurate for:**

- **Coverage completeness** — Finds all code paths, including rare edge cases, error handlers, and admin-only features the interactive agent might never trigger
- **Data shape precision** — Reads TypeScript types, Django serializers, and API schemas directly, giving exact property names, types, and optionality
- **Server-side events** — Webhook handlers, background tasks, and cron jobs have no UI to interact with
- **Conditional logic** — Sees every branch, not just the ones that execute during exploration
- **Role mapping** — Reads permission declarations directly rather than inferring from behavior

#### Time Investment

Codebase review is faster: no running application, no test credentials, and no sequential browser interaction. Files are analyzed in parallel with no page-load latency — typically minutes versus hours for comparable coverage.

#### Cost Investment

Interactive exploration is more expensive: more LLM tokens per discovery (DOM snapshots, network logs, screenshots), browser infrastructure costs, and more LLM calls — each interaction requires both a decision and an interpretation.

## 2. Product Type

*To be defined.*

## 3. Goals and Objectives

*To be defined.*

## 4. Scope

*To be defined.*

## 5. User Personas

*To be defined.*

## 6. Functional Requirements

### Stage 1: Event Discovery

#### The Core Problem

The event discovery agent must do three things simultaneously:

1. **Explore** — Systematically navigate every reachable state of a web application.
2. **Observe** — Capture what happens at each interaction: network calls, DOM mutations, URL changes, and state transitions.
3. **Interpret** — Understand the semantic meaning of each interaction in business terms ("user initiated a search," not "POST to /api/search").

#### Architecture Overview

The agent requires two architectural layers:

1. **LLM reasoning layer** — Decides what to do next and interprets what happened. Receives structured observations from the browser layer (accessibility tree snapshots, network logs, console output) and produces exploration decisions and semantic event classifications.
2. **Browser automation layer** — Drives the browser and captures raw signals. Handles navigation, element interaction, network traffic interception, JavaScript evaluation, and DOM observation.

The LLM reasoning layer drives the process; the browser automation layer executes its decisions and returns observations. Neither layer works alone — the reasoning layer without browser automation has nothing to observe, and the browser layer without reasoning is an aimless crawler.

#### Browser Automation Layer Requirements

The browser automation tooling must provide the following capabilities:

| Capability | Requirement |
|---|---|
| **Network observation** | Capture every API call the application makes — method, URL, request body, response body. This is the richest signal for discovering what the app tracks and what data flows where. |
| **JavaScript evaluation** | Inject observers into the page — hook `fetch`/`XMLHttpRequest`, install MutationObservers, read `localStorage`/`sessionStorage` state, inspect framework-specific stores (Redux, Vuex, Pinia). |
| **Accessibility tree snapshots** | Produce a structured description of the current UI state that is already semantic (roles, labels, hierarchy) — far better than raw HTML for the reasoning layer to interpret. |
| **Console and error capture** | Capture what the application logs, including analytics SDK calls that fire during interactions. |
| **Interaction primitives** | Click, fill, select, navigate, and handle dialogs/popups/file choosers. Locators must auto-wait for element actionability. |
| **Multi-page and frame handling** | Follow popups, new tabs, and iframes — all within one browser context sharing cookies and session state. |

#### Exploration Approach

A dynamic web app has a state graph, not a page tree. The agent must follow this approach:

**1. Seed with route definitions.** If the codebase is accessible, extract routes from the router configuration (e.g. `urls.py`, Next.js `app/` directory, React Router config). This gives the agent a map before it starts exploring.

**2. Crawl with state tracking.** The agent maintains a visited-states set (URL + key DOM state). At each state, it:
   - Takes an accessibility tree snapshot (what's interactable)
   - Captures the current network idle state
   - Tries each interactable element (buttons, links, forms, tabs, modals)
   - After each interaction: diffs the network log, DOM state, URL, and storage
   - Records what changed as a candidate event

**3. Auth-gated exploration.** The agent needs credentials for each user role (e.g. anonymous, registered, subscriber, admin). Run the crawl once per role to discover role-specific features and states.

**4. Capture signals, not just clicks.** For each interaction, record:
   - **Network delta** — API calls that fired (method, endpoint, request/response shapes)
   - **URL change** — Did the route change? (candidate page view)
   - **DOM mutation** — Did a modal open? Did content update? Did a form appear?
   - **Storage change** — Did `localStorage`/`sessionStorage`/cookies change?
   - **Console output** — Did the app log anything? (existing analytics calls, errors)

**5. LLM interprets the raw signals.** After capturing raw observations, the reasoning layer classifies each interaction:
   - Is this a **navigation event** (page view)?
   - Is this a **user action** (button click, form submit, search)?
   - Is this a **state transition** (logged in → logged out, free → paid)?
   - Is this a **data mutation** (created, updated, deleted something)?
   - What **properties** does this event carry? (from the API request/response)

#### Event Discovery Output

The agent produces a structured record per discovered event. This is the raw material that Stage 2 (Taxonomy Generation) and Stage 3 (Tracking Plan Creation) consume.

```json
{
  "discovered_events": [
    {
      "name_suggestion": "search_initiated",
      "category": "product_engagement",
      "trigger": "User clicks Search button on /dashboard",
      "ui_element": "button[role='button'] 'Search'",
      "api_call": "POST /api/search",
      "request_shape": { "query": "string", "filters": "object" },
      "response_shape": { "results": "array", "count": "number" },
      "url_before": "/dashboard",
      "url_after": "/dashboard (no change)",
      "dom_changes": "Results list appears below search form",
      "storage_changes": "sessionStorage: last_search_query updated",
      "user_roles_observed": ["registered", "subscriber"],
      "properties_to_track": ["query_length", "filter_count", "result_count"],
      "lifecycle_stage": "activation"
    }
  ]
}
```

### Stage 2: Taxonomy Generation

*To be defined.*

### Stage 3: Tracking Plan Creation

*To be defined.*

## 7. Non-Functional Requirements

*To be defined.*

## 8. User Journeys

*To be defined.*

## 9. Success Metrics

*To be defined.*

## 10. Timeline

*To be defined.*

## 11. Decisions

*To be defined.*

## 12. Open Questions and Assumptions

*To be defined.*
