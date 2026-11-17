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

Internal tool — agentic workflow.

The Tracking Plan Agent is a task-specific autonomous workflow that takes a web application as input and produces a completed tracking plan as output. It is not a consumer-facing product.

| Attribute | Value |
|---|---|
| **Type** | Internal tool (agentic workflow) |
| **Users** | Product managers, analytics engineers, marketing operations |
| **Input** | Web application URL, authentication credentials per user role, optional codebase access |
| **Output** | Completed tracking plan from the [Tracking Plan Template](../tracking-plan-template/tracking-plan-template.md) — event inventory, event taxonomy, and implementation instructions |
| **Usage pattern** | Run per application version or tracking plan revision. Produces a deliverable; does not run continuously. |
| **Delivery** | The agent runs as a process and writes output files. No UI, no API, no ongoing service. |

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

| Capability | Requirement | Playwright Example |
|---|---|---|
| **Network observation** | Capture every API call the application makes — method, URL, request body, response body. This is the richest signal for discovering what the app tracks and what data flows where. | `page.on('request')`, `page.on('response')`, `response.json()` |
| **JavaScript evaluation** | Inject observers into the page — hook `fetch`/`XMLHttpRequest`, install MutationObservers, read `localStorage`/`sessionStorage` state, inspect framework-specific stores (Redux, Vuex, Pinia). | `page.addInitScript()`, `page.evaluate()`, `page.exposeFunction()` |
| **Accessibility tree snapshots** | Produce a structured description of the current UI state that is already semantic (roles, labels, hierarchy) — far better than raw HTML for the reasoning layer to interpret. | `page.ariaSnapshot({ mode: 'ai' })` |
| **Console and error capture** | Capture what the application logs, including analytics SDK calls that fire during interactions. | `page.on('console')`, `page.on('pageerror')` |
| **Interaction primitives** | Click, fill, select, navigate, and handle dialogs/popups/file choosers. Locators must auto-wait for element actionability. | `locator.click()`, `locator.fill()`, `getByRole()`, `getByText()` |
| **Multi-page and frame handling** | Follow popups, new tabs, and iframes — all within one browser context sharing cookies and session state. | `context.on('page')`, `page.on('popup')`, `page.frameLocator()` |

The Playwright Example column shows one implementation of each requirement. These APIs are Playwright-specific; other browser automation tools provide equivalent capabilities through different interfaces. See the [Browser Automation Options Evaluation](./browser-automation-options.md) for a comparison across tools.

#### Browser Automation Layer Output

The browser layer produces a **raw interaction record** for each action the agent performs. This record contains all observed signals in their original form, before LLM interpretation. It is the observation the reasoning layer receives after every browser action.

**Signals captured per interaction:**

| Signal | Contents |
|---|---|
| **Interaction performed** | Action type (click, fill, select, navigate), target element (accessibility role + label), value entered (if any) |
| **Network calls** | All HTTP requests fired during the interaction, in sequence. Per call: method, URL, request headers, request body, response status, response headers, response body, content type |
| **Accessibility tree** | Structured snapshot of the page state after the interaction: roles, labels, hierarchy, interactable elements |
| **URL change** | URL before and after |
| **DOM mutations** | What appeared, disappeared, or changed |
| **Storage changes** | Diffs to localStorage, sessionStorage, and cookies |
| **Console output** | All console messages emitted during the interaction, including detected analytics SDK calls |
| **Form field inventory** | When a form is present: field names, input types, labels, required/optional status |
| **Metadata** | Timestamp, user role being explored, interaction sequence number, page title |

**Multiple network calls per interaction.** A single user action frequently fires multiple API requests — a form submission may hit an auth endpoint, then a profile endpoint, then trigger a redirect that loads new data. The record captures all requests in sequence, not just the primary one.

**Existing analytics detection.** Console output is monitored for calls to known analytics SDKs (PostHog, Segment, Mixpanel, Google Analytics, Amplitude, and others). When the application already tracks an event, the record captures the SDK name, method called, event name, and properties. This passes through to the Event Discovery Output so downstream stages can align with or build on existing tracking.

**Form field inventory.** Captured whenever the accessibility tree contains form elements. For the highest-priority event types — registration (Event 1), product engagement (Event 2), and purchases (Event 3) — form fields reveal what data the user submits: registration fields (email, password, name), search parameters, payment details (plan selector, promo code field), and subscription options.

**Raw records are retained with the inventory.** Each inventory preserves its raw interaction records. When an inventory diff reports a modified or removed event, the raw records for both versions provide signal-level evidence of what changed.

#### LLM Reasoning Layer Requirements

The reasoning layer receives observations from the browser layer, interprets them, and directs the next action. It requires three categories of input.

**1. Initialization context** — provided once at the start of exploration:

- **Event type framework** — The event types from the [Tracking Plan Template](../tracking-plan-template/tracking-plan-template.md), in priority order. The first three are highest priority — for many applications, these are the first events a company needs to track:
  1. User Registration, Identification & Account Management (sign-up)
  2. Product Engagement (usage)
  3. Purchases & Subscriptions (upsell/revenue)
  4. User Properties Updated (segmentation)
  5. Page Views (navigation)
  6. Button Clicks (interaction)
  7. Modal Lifecycle (UI state)

  The agent allocates more exploration depth to flows that produce higher-priority event types. A sign-up flow or payment flow warrants deeper interaction than a static content page.

- **Route map** (when available) — Extracted from the codebase's router configuration. Gives the agent a map before it starts exploring.

- **User roles and credentials** — The roles to explore and the authentication credentials for each.

- **Naming and property conventions** — From the tracking plan template: snake_case event names, no PII in properties, describe actions not values.

**2. Per-interaction observations** — received from the browser layer after every action:

The raw interaction record defined in [Browser Automation Layer Output](#browser-automation-layer-output). The reasoning layer interprets all signal types together — a network call alone is ambiguous; combined with the DOM change, the element clicked, and the URL transition, it becomes a classifiable event.

**3. Exploration state** — maintained by the reasoning layer across interactions:

| State | Purpose |
|---|---|
| **Visited-states set** | URL + key DOM state combinations already explored — prevents redundant visits |
| **Discovered events** | Running inventory — avoids duplicate discoveries, identifies event pairing |
| **Coverage gaps** | Routes, roles, or interaction types not yet explored — drives exploration decisions |
| **Current position** | Where the agent is (URL, page state, authenticated role) |

**Decisions the reasoning layer makes per interaction:**

1. **Classify** — Is this interaction an event? Which event type? Or is it noise (e.g. hovering over a tooltip)?
2. **Extract** — What properties does this event carry? What person properties are in the API response? Does an existing analytics call already track it?
3. **Pair** — Is this a started event that expects a completed event? (Indicated by an async API call in progress.)
4. **Route** — What to do next: interact with the next element, navigate to the next page, authenticate as the next role, or end exploration.

#### Agent Loop

The two layers communicate through a repeating cycle of four steps:

**1. Command.** The reasoning layer issues an instruction to the browser layer:
   - **Navigate** to a URL
   - **Interact** with an element (click, fill, select) identified by accessibility role and label
   - **Authenticate** as a specific user role
   - **Wait** for network idle or a specific element to appear

**2. Execute and observe.** The browser layer executes the command and captures all signals that occur during and after execution. It returns the raw interaction record.

**3. Interpret.** The reasoning layer receives the record and classifies the interaction: event type, properties, person properties, existing tracking, or not an event.

**4. Decide.** Based on the updated exploration state, the reasoning layer selects the next command:
   - Interactable elements remain on the current page → interact with the next one
   - Current page is fully explored → navigate to the next unvisited route
   - Current role's exploration is complete → authenticate as the next role
   - All roles explored → end exploration and assemble the final inventory

The loop repeats from step 1 until the reasoning layer determines exploration is complete.

**Context management.** The exploration state grows with each iteration. To stay within context window limits, the reasoning layer summarizes older raw observations while retaining the full structured inventory and coverage state. Recent interactions are kept in full for classification accuracy; older interactions are compressed to their event record or discarded if they produced no event.

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
   - **Network delta** — API calls that fired:
     - **Request**: method, URL, headers, request body
     - **Response**: status code, response body, content type
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

The agent produces a structured record per discovered event. This is the deliverable that Stage 2 (Taxonomy Generation) and Stage 3 (Tracking Plan Creation) consume.

The example below shows a registration event (Event 1, highest priority) to illustrate the full field set:

```json
{
  "discovered_events": [
    {
      "name_suggestion": "registration_completed",
      "category": "user_registration",
      "trigger": "User submits registration form on /signup",
      "ui_element": "button[role='button'] 'Create Account'",
      "url_before": "/signup",
      "url_after": "/dashboard",
      "api_calls": [
        {
          "method": "POST",
          "url": "/api/auth/register",
          "request_shape": { "email": "string", "password": "string" },
          "response_shape": { "user_id": "string", "token": "string", "created_at": "string" }
        },
        {
          "method": "GET",
          "url": "/api/user/profile",
          "request_shape": {},
          "response_shape": { "user_id": "string", "plan_name": "string", "registration_timestamp": "string" }
        }
      ],
      "form_fields": [
        { "name": "email", "type": "email", "required": true },
        { "name": "password", "type": "password", "required": true },
        { "name": "name", "type": "text", "required": false }
      ],
      "auth_state_change": "anonymous → identified",
      "dom_changes": "Redirect to dashboard; navigation shows user menu",
      "storage_changes": "cookie: auth_token set; localStorage: user_id set",
      "console_output": ["posthog.identify('usr_abc123')", "posthog.capture('registration_completed', { method: 'email' })"],
      "existing_tracking": [
        { "sdk": "posthog", "call": "identify", "args": ["usr_abc123"] },
        { "sdk": "posthog", "call": "capture", "args": ["registration_completed", { "method": "email" }] }
      ],
      "user_roles_observed": ["anonymous"],
      "properties_to_track": ["registration_method"],
      "person_properties_observed": ["plan_name", "registration_timestamp"],
      "event_pairing": null,
      "lifecycle_stage": "acquisition",
      "raw_capture_refs": ["interaction_042", "interaction_043"]
    }
  ]
}
```

**Fields evolved from the initial schema:**

| Field | Type | Purpose |
|---|---|---|
| `api_calls` | array | Replaces `api_call` + `request_shape` + `response_shape`. Each entry is one HTTP request with its own shapes. Interactions frequently fire multiple API calls. |
| `form_fields` | array or null | Fields present in the form the user submitted. Null for non-form interactions. |
| `auth_state_change` | string or null | Identity transition that occurred (e.g. "anonymous → identified"). Null when no auth change. |
| `console_output` | array | Console messages emitted during the interaction. |
| `existing_tracking` | array | Analytics SDK calls detected in console output — the SDK, method, event name, and properties the application already tracks. Empty when none detected. |
| `person_properties_observed` | array | Fields in API responses that represent user-level attributes (plan_name, registration_timestamp, subscription dates). These feed Event 4 (User Properties Updated) in the tracking plan. |
| `event_pairing` | string or null | Links started/completed event pairs — e.g. `"completes: search_initiated"`. Null for unpaired events. |
| `raw_capture_refs` | array | References to the raw interaction records that produced this event. Used for audit and diff evidence. |

**High-priority event signals.** The fields above are designed to capture the information the three highest-priority event types require:

- **Event 1 (Registration/Identity):** `form_fields` reveals what the sign-up form asks for. `auth_state_change` captures the anonymous-to-identified transition. `api_calls` captures the registration endpoint and its response (user ID format, token). `person_properties_observed` captures user-level attributes available in the response. `existing_tracking` shows whether the app already calls `identify()` and `capture('registration_completed')`.

- **Event 2 (Product Engagement):** `api_calls` captures the action's request shape (what the user did) and response shape (what came back). `event_pairing` links started and completed events — the started event fires before the API call, the completed event fires on success. `form_fields` captures search forms, creation forms, or other action inputs.

- **Event 3 (Purchases/Subscriptions):** `api_calls` captures the payment endpoint with pricing fields (amount, currency, plan_name, promo_code). `form_fields` captures the payment form (plan selector, promo code input). `person_properties_observed` captures subscription-related user properties (plan_name, subscription timestamps).

#### Inventory Diffing

A user must be able to diff two event inventories against each other — for example, inventories captured from two different application releases — and see a structured summary of what changed.

Each inventory is a point-in-time snapshot. When the agent runs against the same application at different times (or different versions), the resulting inventories must be comparable. The diff must surface:

- **Added events** — events present in the newer inventory but absent from the older one (new features, new pages, new tracking).
- **Removed events** — events present in the older inventory but absent from the newer one (removed features, dead code cleanup, deprecated flows).
- **Modified events** — events present in both inventories but with differences in any field: changed API endpoints, altered request/response shapes, new or removed properties, different DOM behavior, updated user role coverage, or reclassified lifecycle stages.

To support reliable matching across inventories, each discovered event must carry a stable identity. Two records represent the "same" event when they share the same trigger interaction at the same URL path — the combination of `trigger` (the user action) and `url_before` (where it occurs) forms the natural key. The `name_suggestion` field is not stable across runs (the LLM may phrase it differently) and must not be used as the matching key.

The diff output is a consumer-facing deliverable, not an internal diagnostic. It answers: "What changed in our application's trackable behavior between version A and version B?"

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
