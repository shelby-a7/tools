# [Template] Analytics Tracking Plan — Implementation Instructions

> **How to use this template:** Replace all `{PLACEHOLDER}` values with your project's specifics. Sections marked `[Customize]` need project-specific content. Delete this callout and all template guidance notes before delivering to Engineering.

Production-ready guide for Engineering to implement user-behavior tracking on {APP_NAME}. This tracking plan applies to both the pre-prod and production environments.

**Stack:** {FRAMEWORK} (e.g. Next.js, Nuxt, React SPA) · {STYLING} (e.g. styled-components, Tailwind) · {INFRASTRUCTURE} (e.g. Apache reverse proxy, Nginx, Vercel)

**Analytics:** {ANALYTICS_PLATFORM} via native SDKs — {CLIENT_SDK} (client-side) + {SERVER_SDK} (server-side)

Contents

Overview

- [What we're building and why](#overview)
- [Phase Overview](#phase-overview)

Setup (Pre-work)

- [Pre-work 1: Create analytics projects](#prework-1)
- [Pre-work 2: Install SDKs](#prework-2)
- [Pre-work 3: Configure analytics in the framework](#prework-3)
- [Pre-work 4: Disable duplicate tracking](#prework-4)

Phase 1 — Event Implementation

- [Event 1: Page Views (virtual)](#event-1)
- [Event 2: Button Clicks](#event-2)
- [Event 3: Modal Lifecycle](#event-3) — *Phase 2 (see Phase 2+)*
- [Event 4: User Registration, Identification & Account Management](#event-4)
- [Event 5: Purchases & Subscriptions](#event-5)
- [Event 6: Product Engagement](#event-6)
- [Event 7: User Properties Updated](#event-7)

Phase 1 — Reference

- [Phase 1 — QA Verification Checklist](#phase-1-qa)

Phase 2+ — Event Implementation

- [Event 2: Button Clicks (Phase 2+ track_ids)](#event-2-phase-2)
- [Event 3: Modal Lifecycle](#event-3-phase-2)
- [Event 5: {DEFERRED_EVENT_NAME}](#event-5-phase-2)

Phase 2+ — Reference

- [Phase 2+ — QA Verification Checklist](#phase-2-qa)

Shared Reference

- [Architecture Diagram](#architecture)
- [Companion Documents](#companion)

<a id="overview"></a>

## Overview — What We're Building and Why

### Goal

Implement **product analytics** — not just web analytics — for {APP_NAME}. The implementation must answer product questions like "{EXAMPLE_PRODUCT_QUESTION_1}" and "{EXAMPLE_PRODUCT_QUESTION_2}". These require user-level identity, persistent user properties, and funnel analysis — capabilities that go beyond page view counts.

### What the Tracking Measures

> `[Customize]` Map each funnel stage to the events that capture it. The table below is a product-led growth (PLG) lifecycle example — adapt the stages, events, and metrics to your product's growth model.

Key events in the taxonomy exist to measure a transition in the product lifecycle. The table below maps each funnel stage to the events that capture it, the user's status at that point, and the business metrics the data feeds.

| Transition | Key Events | Contact Status | Metrics Measured |
| --- | --- | --- | --- |
| **{STAGE_1} → {STAGE_2}** | `{event_name}` | {status_before} → {status_after} | {metric_1}, {metric_2} |
| **{STAGE_2} → {STAGE_3}** | `{event_name}` | {status} | {metric_1}, {metric_2} |
| **{STAGE_3} → {STAGE_4}** | `{event_name}` | {status_before} → {status_after} | {metric_1}, {metric_2} |

### Analytics Stack

| Layer | Tool | Role |
| --- | --- | --- |
| **Client-side SDK** | {CLIENT_SDK} | Tracks user interactions in the browser — page views, button clicks, modal events, identity resolution, person properties. Initializes automatically on page load and captures events from components. |
| **Server-side SDK** | {SERVER_SDK} | Tracks server-originated events — available for API routes, server-side rendering functions, and server actions. Ensures events that depend on backend confirmation (e.g. webhook-driven subscription changes) can be captured server-side. |
| **Product Analytics** | {ANALYTICS_PLATFORM} | User-level product analytics — funnels, session replay, person profiles with properties, individual user timelines, cohort analysis. |

### Systems Involved

This implementation touches **three systems**. In addition to the frontend app and the analytics platform, the backend user/subscriber database is a data source for analytics events.

| System | Role in Analytics | Examples |
| --- | --- | --- |
| **Frontend App** ({FRAMEWORK}) | Calls analytics SDK methods (capture, identify, reset) in response to user actions. | Page navigations, button clicks, modal opens, form submissions |
| **User & Subscriber Database** (backend API) | Source of truth for user profile and subscription data. The frontend reads from API responses to populate user properties and determine conditional logic. | {LIST_KEY_FIELDS_FROM_BACKEND — e.g. registration_timestamp, plan_name, subscription timestamps, credit counts} |
| **{ANALYTICS_PLATFORM}** | Receives events directly from the SDKs. Person profiles persist user properties. Session replay, funnels, cohort analysis, and data integrations are all handled natively. | All event capture, user identity resolution, person property persistence, session replay |

### The Integration Boundary: SDK Calls

Engineering calls analytics SDK methods directly in application code. There is no intermediate layer (no tag manager, no data layer push).

- **Client-side events** use capture, identify, reset, and set-person-properties methods from the client SDK (accessed via a framework hook or singleton instance).
- **Server-side events** use capture and identify methods from the server SDK (used in API routes and server-side functions).

> `[Customize]` If your project routes events through a tag manager or data layer instead, replace this section with the tag manager architecture and remove references to direct SDK calls throughout.

This direct integration gives Engineering full control over when and how events fire, and enables features that require a direct SDK connection: session replay, A/B experiments, feature flags, and server-side event capture.

### What Gets Tracked ({N} Event Types)

> `[Customize]` Add or remove event types based on your product. The seven types below are a common baseline for SaaS/PLG apps.

| # | Event Type | What It Captures | How It's Tracked |
| --- | --- | --- | --- |
| 1 | Page Views | Every page navigation (SPA virtual page views) | Auto, via route change listener in app shell → `capture('$pageview')` |
| 2 | Button Clicks | Clicks on any element with a `data-track` attribute | Auto, via global click listener in app shell → `capture('button_clicked')` |
| 3 | Modal Lifecycle | Modal opens, dismissals, and confirmations | Explicit capture calls in modal components |
| 4 | User Registration, ID & Account Mgmt | Account creation, anonymous-to-identified user linking, logout (with analytics reset), account deletion | Explicit identify, reset, and capture calls |
| 5 | Purchases & Subscriptions | Subscription purchases, upgrades, downgrades, add-on purchases, cancellation | Explicit capture calls in payment/subscription handlers |
| 6 | Product Engagement | {CORE_ENGAGEMENT_ACTIONS — e.g. search initiation and completion} | Explicit capture calls in engagement handlers |
| 7 | User Properties Updated | Persists user-level properties (e.g. `plan_name`, timestamps) for filtering all future events | Explicit set-person-properties calls |

<a id="phase-overview"></a>

### Phase Overview

> `[Customize]` Assign each event and property a priority (1 or 2) in your Event Taxonomy. Phase 1 covers priority 1; Phase 2 covers priority 2 and unassigned items.

Implementation is split into two phases based on event and property priority assignments in the [Event Taxonomy](./taxonomy/).

| Phase | Events Included | Scope |
| --- | --- | --- |
| **Phase 1** | {LIST_PHASE_1_EVENTS} | Core product analytics: page views, key button clicks, identity resolution, revenue tracking, engagement, and user property persistence. |
| **Phase 2** | {LIST_PHASE_2_EVENTS} | Extended interaction tracking: modal lifecycle, additional button clicks, and deferred events. |

**Priority mapping:** Priority 1 → Phase 1. Priority 2 → Phase 2. Events and properties with no assigned priority (`null`) are included in Phase 2 and should be reviewed for inclusion in Phase 2 or deferral to Phase 3.

**Phase 1 delivers:** User identity resolution (identify + reset), revenue event tracking, core product engagement, user property persistence for segmentation, and the `data-track` infrastructure for button click tracking.

**Phase 2 adds:** Full button click coverage across all tracked elements, modal open/dismiss/confirm lifecycle tracking, and deferred event types.

### Naming Conventions

> `[Customize]` Replace the example values with your project's naming scheme. All specific values should be enumerated in your Event Taxonomy.

| Category | Convention | Examples |
| --- | --- | --- |
| Event names | `snake_case`, verb_noun or noun_verb | `virtual_page_view`, `button_clicked`, `modal_viewed` |
| Property names | `snake_case` | `page_path`, `track_id`, `modal_name`, `plan_name` |
| `data-track` values | `snake_case`, action or element name | `conduct_search`, `create_account`, `submit_payment` |
| `modal_name` values | `snake_case`, describes the modal | `confirm_payment_modal`, `cancel_plan_modal` |
| Plan names | `snake_case`, from app data | `basic`, `premium`, `enterprise` |

### Why Native SDKs Over a Tag Manager

> `[Customize]` If your project uses a tag manager, replace this section with the rationale for that architecture.

This implementation uses the analytics platform's SDKs directly rather than routing through a tag manager. The benefits:

- **Session replay, A/B experiments, and feature flags** require a direct SDK connection and are not available through a tag manager.
- **Server-side capture** via the server SDK enables tracking events that originate from backend processes (webhooks, server actions) without a browser.
- **Simpler architecture** — no intermediate tag manager layer to configure and maintain. Events flow directly from the application to the analytics platform.
- **Fewer moving parts** — no tag manager container, no template tags, no data layer intermediary.

The tradeoff is that adding or modifying analytics events requires a code change rather than a tag manager configuration change.

---

<a id="prework-1"></a>

## Pre-work 1: Create Analytics Projects

### Engineering

1. **Create two projects** in your analytics platform — one for pre-prod and one for production. Note each project's **API Key** and **Instance Address** (the endpoint events are sent to).

Two separate projects ensure pre-prod testing data never pollutes production analytics.

#### Credentials summary

| Environment | Credential | Value |
| --- | --- | --- |
| Pre-prod | `{ENV_PREFIX}_ANALYTICS_KEY` | (pre-prod project key) |
| Pre-prod | `{ENV_PREFIX}_ANALYTICS_HOST` | (pre-prod endpoint URL) |
| Production | `{ENV_PREFIX}_ANALYTICS_KEY` | (production project key) |
| Production | `{ENV_PREFIX}_ANALYTICS_HOST` | (production endpoint URL) |

Store these as environment variables. If your framework requires a prefix to expose variables to client-side code (e.g. `NEXT_PUBLIC_` for Next.js, `VITE_` for Vite), use the appropriate prefix. Use environment-specific config files (`.env.local`, `.env.development`, `.env.production`) as appropriate for your deployment setup.

<a id="prework-2"></a>

## Pre-work 2: Install SDKs

### Engineering

Install both SDKs:

```
{INSTALL_COMMAND — e.g. npm install posthog-js posthog-node}
```

- **{CLIENT_SDK}** — client-side tracking (components, browser). Used for page views, button clicks, identity resolution, person properties, and all user-initiated events.
- **{SERVER_SDK}** — server-side tracking (API routes, server-side rendering, server actions). Used for events that originate from backend processes or need to be captured server-side.

<a id="prework-3"></a>

## Pre-work 3: Configure Analytics in the Framework

### Engineering

#### Step 1: Create the client-side analytics provider

> `[Customize]` Adapt the initialization code to your analytics platform's SDK and your framework. The pattern below is a singleton that initializes once on the client side.

Create `lib/analytics.js` (or your preferred utilities location):

```js
// TEMPLATE: Replace with your analytics platform's client SDK import and init method.
import analyticsClient from '{CLIENT_SDK_PACKAGE}';

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (analyticsClient.__loaded) return;  // ← adapt guard to your SDK's API

  analyticsClient.init(process.env.{ENV_PREFIX}_ANALYTICS_KEY, {
    api_host: process.env.{ENV_PREFIX}_ANALYTICS_HOST,
    capture_pageview: false,   // We capture page views manually on route changes
    capture_pageleave: true,
  });
}
```

`capture_pageview: false` (or equivalent) is required — we fire page views manually on route changes (Event 1). Without this, the SDK's automatic page view fires only on initial load and misses client-side navigations.

#### Step 2: Create the server-side analytics client

> `[Customize]` Adapt to your analytics platform's server SDK. The singleton pattern ensures one instance is reused across requests.

Create `lib/analytics-server.js`:

```js
// TEMPLATE: Replace with your analytics platform's server SDK import and init method.
import { AnalyticsServer } from '{SERVER_SDK_PACKAGE}';

let analyticsServer = null;

export function getAnalyticsServer() {
  if (!analyticsServer) {
    analyticsServer = new AnalyticsServer(process.env.{ENV_PREFIX}_ANALYTICS_KEY, {
      host: process.env.{ENV_PREFIX}_ANALYTICS_HOST,
      flushAt: 1,        // Send events immediately (for serverless/short-lived environments)
      flushInterval: 0,
    });
  }
  return analyticsServer;
}
```

The server client is a singleton — instantiated once and reused across requests. `flushAt: 1` and `flushInterval: 0` ensure events are sent immediately in serverless/short-lived environments. Adjust these settings for long-running server processes.

#### Step 3: Initialize analytics in the app shell

> `[Customize]` Adapt to your framework's app shell pattern (`_app.js` for Next.js Pages Router, `app/layout.tsx` for App Router, `App.vue` for Nuxt/Vue, etc.). The three concerns below — initialization, virtual page views, and the global click listener — should all live in the app shell.

```js
// TEMPLATE: Adapt imports and hooks to your framework.
import { useEffect } from 'react';
import { useRouter } from '{FRAMEWORK_ROUTER}';
import analyticsClient from '{CLIENT_SDK_PACKAGE}';
import { initAnalytics } from '../lib/analytics';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Initialize analytics on first client-side render
  useEffect(() => {
    initAnalytics();
  }, []);

  // Virtual page view on every client-side route change
  useEffect(() => {
    const onRouteChange = (url) => {
      analyticsClient.capture('$pageview', { page_path: url });
    };
    router.events.on('routeChangeComplete', onRouteChange);  // ← adapt to your router's API
    return () => router.events.off('routeChangeComplete', onRouteChange);
  }, [router.events]);

  // Global click listener for data-track button clicks (Event 2)
  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target.closest('[data-track]');
      if (!el) return;

      const trackId = el.getAttribute('data-track');
      const trackLocation =
        el.getAttribute('data-track-location') || window.location.pathname;

      analyticsClient.capture('button_clicked', {
        track_id: trackId,
        track_location: trackLocation,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <Component {...pageProps} />;
}
```

This single file handles three concerns:

1. **Analytics initialization** — runs once on mount.
2. **Virtual page views** — fires `$pageview` on every route change (Event 1).
3. **Button click tracking** — a document-level click listener detects `data-track` attributes and fires `button_clicked` (Event 2).

Before implementing: The page view listener uses a route-change event, which only fires on URL path changes. Engineering must review the app's navigation and confirm that every user action intended as a "page view" actually triggers a route change. In-page interactions that don't change the URL (tab switches, accordions, filters) will not be captured as page views — those need `data-track` button clicks (Event 2) or modal events (Event 3) instead.

#### Acceptance Criteria: Analytics Loads and Captures

| Check | How to Verify |
| --- | --- |
| Analytics initialized | Browser console: analytics client object exists and returns a distinct ID |
| Environment variables set | Analytics key env var resolves to a valid project key |
| Page views fire on navigation | Navigate to 3+ pages → Analytics platform → Activity → page view events appear with correct `page_path` |
| Button click listener active | Click a `data-track` element → Analytics platform → Activity → `button_clicked` event appears |

<a id="prework-4"></a>

## Pre-work 4: Disable Duplicate Tracking

### Engineering

Most analytics SDKs ship with automatic page view and click tracking (autocapture) that will conflict with our explicit events. Disable both.

| Setting | What to Disable | Where |
| --- | --- | --- |
| Auto page views | Handled by disabling automatic page view capture in SDK init (e.g. `capture_pageview: false`) | Already done in Pre-work 3 |
| Autocapture clicks (optional) | If the SDK's autocapture is enabled, it will fire generic click events in addition to our `button_clicked` events. You may leave autocapture on (it captures different data) or disable it to reduce event volume. | Analytics platform project settings, or set `autocapture: false` (or equivalent) in SDK init options |

If you skip the auto-page-view disabling: Every page navigation fires twice — once from our explicit capture, once from the SDK's built-in tracker. All page view counts will be 2× actual.

---

## Phase 1 — Event Implementation

<a id="event-1"></a>

## Event 1: Page Views (Virtual) — Phase 1

**Why virtual?** Single-page apps (SPAs) handle navigation client-side. Route changes don't trigger a full page load, so the SDK's built-in page view fires only once — on initial load. We capture a page view event on every route change to capture all navigation.

### Engineering

Already done in Pre-work 3. The route-change listener in the app shell handles this. No additional code needed per page.

Engineering must verify: Virtual page views fire on route-change events — meaning they only capture client-side route changes (URL path changes). Confirm that every user action you want tracked as a "page view" actually triggers a route change. Actions that happen within the same page (e.g. tab switches, accordion opens, in-page filtering) do **not** change the URL and will **not** fire a page view. If any key user flows stay on the same route, those interactions need to be tracked via button clicks (Event 2) or modal events (Event 3) instead.

#### What gets captured

```js
analyticsClient.capture('$pageview', { page_path: '/results' });
```

#### Acceptance Criteria: Page Views Fire on Every Route

| Check | How to Verify |
| --- | --- |
| Page view fires on navigation | Navigate to 3+ pages. In the analytics platform activity feed, you should see one page view event per navigation with a `page_path` matching the URL. |
| No double-counting | Each navigation produces exactly 1 page view event |
| Analytics platform receives page views | Events appear in the activity feed within seconds |

<a id="event-2"></a>

## Event 2: Button Clicks — Phase 1 / Phase 2+

> **Phase 1 scope:** Implement the `data-track` attribute infrastructure described below in full — it applies to all tracked buttons. In Phase 1, add `data-track` attributes to the **priority-1 buttons only**: {LIST_PHASE_1_TRACK_IDS}. The remaining `track_id` values (priority 2 and unassigned) are deferred to [Phase 2+](#event-2-phase-2).

**Why `data-track`?** Many modern CSS solutions (styled-components, CSS Modules, Tailwind with purging) generate class names that change between builds. CSS-selector-based click triggers would break silently after every deploy. Instead, Engineering adds stable `data-track` attributes to trackable elements.

### Engineering

The global click listener in the app shell (Pre-work 3) automatically detects clicks on `[data-track]` elements and calls `capture('button_clicked', { track_id, track_location })`. No additional event code is needed per button — Engineering adds HTML attributes only.

#### Add `data-track` attributes to every trackable button

Pattern, not paste: The code below shows the **attribute pattern** to apply to your existing components. The `data-track` values are examples — replace them with the values from your [Event Taxonomy](./taxonomy/). The component names are placeholders for your actual components and handlers. You are adding attributes to existing elements, not creating new components.

```jsx
// PATTERN: Add data-track to each trackable element.
// Replace the values with those from the Event Taxonomy.
//
// Button INSIDE a modal — add data-track-location manually.
// The URL doesn't change when a modal opens, so the route fallback
// would just show the underlying page. The explicit attribute tells
// analytics this click happened inside the modal, not on the page.
<Button
  data-track="submit_payment"               // ← replace with your value from Taxonomy
  data-track-location="confirm_payment_modal" // ← required: modal has no route
  onClick={handlePayment}                   // ← your existing handler, unchanged
>
  Pay now
</Button>

// Page-level buttons: add data-track only. Do NOT add data-track-location.
// The click listener automatically captures the current URL path (e.g. /search, /results)
// as the click's location. Adding data-track-location here would duplicate
// that and create a second source of truth to maintain.
<Button
  data-track="conduct_search"           // ← replace with your value from Taxonomy
  onClick={handleSearch}               // ← your existing handler, unchanged
>
  Search
</Button>
```

#### What to know

- **No per-button event code.** No explicit capture call needed per button — Engineering adds HTML attributes only. The global click listener in the app shell fires the event automatically.
- **Page-level buttons need only `data-track`.** The click listener automatically reads the current route (`window.location.pathname`) as the `track_location`. No `data-track-location` attribute needed.
- **Modal buttons need `data-track-location` too.** When a button is inside a modal, the URL doesn't change — so the route fallback would just show the underlying page path, not the modal. Add `data-track-location` with the modal's name (from the Taxonomy) so analytics can distinguish modal actions from page actions.
- **Any element works.** The attributes work on `<button>`, `<a>`, `<div>`, or any clickable element. They are standard HTML `data-*` attributes — React, Vue, Angular, and all CSS solutions pass them through to the DOM unchanged.

#### Acceptance Criteria: Button Clicks Track via `data-track`

| Check | How to Verify |
| --- | --- |
| `data-track` attributes in DOM | Inspect tracked buttons → `data-track` attribute present. Page-level buttons should have `data-track` only. Modal buttons should have both `data-track` and `data-track-location`. |
| `button_clicked` fires in analytics | Click a tracked page-level button → activity feed → `button_clicked` event with `track_id` and `track_location` (current URL path). |
| Nested clicks resolve correctly | Click an icon inside a tracked button → `track_id` still populated via `closest()` |
| Route fallback works | Click a page-level button with no `data-track-location` → `track_location` shows the current URL path, not `undefined`. |
| Modal buttons override fallback | Open a modal → click its tracked button → `track_location` shows the `data-track-location` value, not the underlying page route. |

<a id="event-3"></a>

## Event 3: Modal Lifecycle — Phase 2

Modal lifecycle tracking (`modal_viewed`, `modal_dismissed`, `modal_confirmed`) is deferred to Phase 2. See [Event 3: Modal Lifecycle (Phase 2+)](#event-3-phase-2) for the full Engineering implementation instructions.

---

<a id="event-4"></a>

## Event 4: User Registration, Identification & Account Management — Phase 1

**Four events.** `registration_completed` fires once on first account creation (for funnel counting) and links the anonymous session to the new user. `login_completed` fires on every returning login and re-links the session to the known user. `user_logged_out` fires on logout and resets the analytics identity so the next visitor's anonymous events are not attributed to the previous user. `account_deletion` fires when a user's account deletion is successfully initiated.

### Engineering

Pattern, not paste: The code below shows **what to capture and when** — place these calls inside your existing auth success handlers. `response.user.id` is a placeholder for however your app accesses the authenticated user's ID.

#### After successful registration

```js
// PATTERN: Place inside your signup success handler / callback.
// One event handles both the funnel count AND identity linking.

// Link anonymous session to the new user
analyticsClient.identify(response.user.id);  // ← replace with your auth system's opaque user ID

analyticsClient.capture('registration_completed', {
  method: '{REGISTRATION_METHOD}',           // ← from your registration_methods registry
});

// Set person properties — registration_timestamp is write-once
analyticsClient.setPersonProperties(
  {},                                        // ← overwrite properties — none needed here
  {
    registration_timestamp: '{ISO_8601}',    // ← set-once: timestamp from signup API response
  }
);
```

#### After successful login (returning user)

```js
// PATTERN: Place inside your login success handler / callback.

// Re-link session to the known user
analyticsClient.identify(response.user.id);  // ← replace with your auth system's opaque user ID

analyticsClient.capture('login_completed');

// Restore all user properties from the backend
const setProps = {
  registration_timestamp: response.user.registration_timestamp, // ← always present
};

// Conditionally restore subscription and engagement properties
// [Customize] Adapt the field names to match your backend API response.
if (response.user.plan) {
  setProps.plan_name = response.user.plan;
  setProps.last_subscription_start_timestamp = response.user.subscription_start;
  setProps.first_subscription_timestamp = response.user.first_subscription_timestamp;
}

// [Customize] Add conditional blocks for other user properties your app tracks
// (e.g. credit balances, cancellation history)

analyticsClient.setPersonProperties(setProps);
```

#### What to know

- **Signup fires one event; login fires one.** `registration_completed` is a once-per-user funnel event that also links the anonymous session to the new user. `login_completed` fires on every returning login to re-link the session.
- **Identify is called before capture.** This ensures the event is attributed to the identified user, not the anonymous ID. The analytics platform merges the anonymous distinct ID (auto-generated on first visit) with the authenticated user ID. All pre-login events retroactively appear on the identified user's timeline.
- **`response.user.id` is a placeholder.** Replace it with however your app accesses the user's ID after auth succeeds.
- **Push only after confirmed success.** These calls go inside the `.then()` or after the `await` — never on the button click. A failed login attempt must not fire `login_completed`.

Never send PII as user_id. Use the opaque ID from your auth system (e.g. `usr_abc123`). Never send email, name, or phone number.

#### After successful logout

```js
// PATTERN: Place inside your logout success handler / callback.
// Capture BEFORE redirecting or clearing the session — the event must fire while the page is still active.

analyticsClient.capture('user_logged_out');
analyticsClient.reset();
```

- **Capture before reset and redirect.** The capture call must execute before the identity reset and before any redirect that leaves the page, otherwise the event is either lost or attributed to a new anonymous ID.
- **Reset generates a new anonymous distinct ID** and clears all stored person properties from the browser. Any events after this point are attributed to a new anonymous user until the next identify call (login or signup).
- **Why this matters.** Without a reset on logout, the next person to use the same browser inherits the previous user's distinct ID. Their anonymous browsing events are attributed to the wrong person until they log in and trigger a new identify call.

#### After account deletion is confirmed

```js
// PATTERN: Place inside the handler that runs after the backend confirms account deletion.
// Do not fire on clicking "Delete Account" — only after the API confirms the deletion request.

analyticsClient.capture('account_deletion');
```

- **Fire only after confirmed API success.** "Clicked Delete" ≠ "account deleted." The backend must confirm the deletion request before capturing this event.

#### Acceptance Criteria: User Identity & Account Management

| Check | How to Verify |
| --- | --- |
| `registration_completed` fires on signup | Create test account → activity feed → `registration_completed` with `method` |
| `login_completed` fires on login | Log in → activity feed → `login_completed` |
| Anonymous → identified merge on signup | Visit site without logging in → navigate to 2-3 pages → sign up → Persons → pre-signup page views listed on identified user's timeline |
| Re-link on login | Log out → browse anonymously → log in → anonymous events merge onto identified user's timeline |
| `user_logged_out` fires on logout | Log out → activity feed → `user_logged_out` |
| Reset fires on logout | Log out → navigate to 2-3 pages → new page views appear under a new anonymous ID, not the previous user |
| `account_deletion` fires on deletion | Initiate deletion → wait for confirmation → activity feed → `account_deletion` |

<a id="event-5"></a>

## Event 5: Purchases & Subscriptions — Phase 1 / Phase 2

> `[Customize]` Adapt the events below to your product's revenue model. The four events below cover a subscription + add-on credits model. Replace or remove events as needed (e.g. one-time purchases, usage-based billing).

> **Phasing note:** Phase 1 events in this section are: `subscription_started`, `subscription_upgraded`, `subscription_cancelled`, `{ADD_ON_PURCHASE_EVENT}`. Phase 2 tracks `subscription_downgraded` — see [Event 5: Subscription Downgraded (Phase 2)](#event-5-phase-2).

### Engineering

Pattern, not paste: The code below shows **what to capture and when** across purchase/subscription moments. All property values are examples — pull the real values from your plan data object and the [Event Taxonomy](./taxonomy/). Place these calls inside your existing handlers.

#### After successful subscription payment

```js
// PATTERN: Place inside your subscription payment success callback (.then() or after await).
// Never capture on the button click — only after the API confirms payment succeeded.

analyticsClient.capture('subscription_started', {
  plan_name: '{PLAN_SLUG}',                 // ← plan slug from Taxonomy
  amount: 9.99,                             // ← final amount charged after discounts + tax (number, not string)
  line_item: 12.99,                         // ← pre-tax, pre-discount cart total
  currency: 'USD',                          // ← ISO 4217 currency code
  effective_at: '{ISO_8601}',               // ← ISO 8601 timestamp of the transaction
  promo_code: '{LOWERCASED_CODE}',          // ← lowercased promo code, or omit if none applied
  discount_amount: 3.00,                    // ← discount in dollars, or omit if no promo code
});

// Set person properties — plan_name + timestamps
const isFirstSubscription = !currentUser.first_subscription_timestamp; // ← adapt to your app state

const setProps = {
  plan_name: '{PLAN_SLUG}',
  last_subscription_start_timestamp: '{ISO_8601}',
};

const setOnceProps = {};
if (isFirstSubscription) {
  setOnceProps.first_subscription_timestamp = '{ISO_8601}';
}

analyticsClient.setPersonProperties(setProps, setOnceProps);
```

#### After successful add-on purchase

> `[Customize]` Replace with your add-on product (credits, seats, storage, etc.) or remove if not applicable.

```js
// PATTERN: Place inside your add-on payment success callback (.then() or after await).

analyticsClient.capture('{ADD_ON_PURCHASE_EVENT}', {
  {ADD_ON_QUANTITY_FIELD}: 5,               // ← quantity purchased
  amount: 14.99,                            // ← final amount charged
  line_item: 14.99,                         // ← pre-tax, pre-discount total
  currency: 'USD',                          // ← ISO 4217 currency code
  effective_at: '{ISO_8601}',               // ← ISO 8601 timestamp
  promo_code: '{LOWERCASED_CODE}',          // ← or omit if none applied
  discount_amount: 4.50,                    // ← or omit if no promo code
});

// Set person properties — add-on purchase activity
analyticsClient.setPersonProperties({
  {LAST_ADD_ON_QUANTITY}: 5,
  {LAST_ADD_ON_DATE}: '{ISO_8601}',
});
```

#### When a subscriber cancels their subscription

```js
// PATTERN: Place inside the handler that runs after the cancellation API confirms success.

analyticsClient.capture('subscription_cancelled', {
  plan_name: '{PLAN_SLUG}',                 // ← the plan being cancelled
  effective_at: '{ISO_8601}',               // ← when the cancellation takes effect
});

// Set person properties — plan_name stays for cohort analysis, add cancellation timestamp
analyticsClient.setPersonProperties({
  plan_name: '{PLAN_SLUG}',
  last_cancellation_timestamp: '{ISO_8601}',
});
```

#### When a subscriber upgrades to a higher plan

```js
// PATTERN: Place inside the handler that runs after the backend confirms the plan upgrade.

analyticsClient.capture('subscription_upgraded', {
  plan_name: '{NEW_PLAN_SLUG}',             // ← the NEW plan after upgrade
  amount: 19.99,
  line_item: 23.99,
  currency: 'USD',
  effective_at: '{ISO_8601}',
  promo_code: '{LOWERCASED_CODE}',          // ← or omit
  discount_amount: 4.00,                    // ← or omit
});

// Set person properties — update plan_name and subscription timestamp
analyticsClient.setPersonProperties({
  plan_name: '{NEW_PLAN_SLUG}',
  last_subscription_start_timestamp: '{ISO_8601}',
});
```

#### What to know

- **Subscriptions and add-on purchases are separate events.** Each revenue event type has its own event name.
- **`plan_name` is included on subscription events.** Passed on started, upgraded, and cancelled events. On upgrade, pass the **new** plan (post-change), not the old one.
- **`promo_code` must be lowercased before capturing.** Only include `promo_code` and `discount_amount` when a promo was successfully applied — omit both fields entirely otherwise.
- **Two calls on every subscription event, not one.** The transaction event (capture) records the event. Set-person-properties (Event 7) persists the user's current plan and related timestamps. Both go in the same success handler.
- **Capture only after confirmed API success.** "Clicked Pay" ≠ "payment succeeded"; "clicked Cancel" ≠ "subscription cancelled."
- **`effective_at` is an ISO 8601 timestamp.** On purchase/upgrade events, it's when the transaction occurred. On cancellation events, it's when the change takes effect.
- **`line_item` is the pre-tax, pre-discount total.** `amount` is the final charge the customer pays. Both are numbers, not strings.
- **Values come from your data, not hardcoded.** In practice, all property values should be read from your API response or app state.

#### Acceptance Criteria: Purchases & Subscriptions Complete

| Check | How to Verify |
| --- | --- |
| `subscription_started` fires | Complete a subscription → activity feed → `subscription_started` with `plan_name`, `amount`, `line_item`, `currency`, `effective_at` |
| Add-on purchase fires | Purchase add-on → activity feed → event with quantity, `amount`, `line_item`, `currency`, `effective_at` |
| Promo code captured correctly | Apply a promo → `promo_code` lowercased, `discount_amount` present. Without promo → both absent. |
| `subscription_upgraded` fires | Upgrade → activity feed → `subscription_upgraded` with new `plan_name` |
| `subscription_cancelled` fires | Cancel → activity feed → `subscription_cancelled` with `plan_name` and `effective_at` (only after API confirms) |

<a id="event-6"></a>

## Event 6: Product Engagement — Phase 1

> `[Customize]` Replace the search example below with your product's core engagement action(s). The pattern — one event on intent, one on outcome — applies to any action with an async backend step.

**Two events.** `{ENGAGEMENT_STARTED}` fires when a user initiates the core action. `{ENGAGEMENT_COMPLETED}` fires when the action returns successfully. Together they measure adoption and completion rate — a core engagement signal for the product-led growth model.

### Engineering

Pattern, not paste: The code below shows **what to capture and when**. Place these calls inside your existing handlers.

#### When a user initiates the core action

```js
// PATTERN: Place where the action is dispatched — the moment the user triggers it.
// Fire BEFORE the API call, not after.

// [Customize] Build a properties object that describes the action without PII.
// Example: which fields were used, which options were selected.
const eventProps = {
  {USAGE_FIELDS}: {USAGE_VALUES},           // ← describe the action, never user-entered values
};

analyticsClient.capture('{ENGAGEMENT_STARTED}', eventProps);
```

#### When the action completes successfully

```js
// PATTERN: Place inside the success callback (.then() or after await).
// Only fire when the API returns successfully — do not fire on errors or timeouts.

analyticsClient.capture('{ENGAGEMENT_COMPLETED}', {
  id: response.{ACTION_ID},                 // ← unique ID from the API response
  {USAGE_FIELDS}: {USAGE_VALUES},           // ← same properties from the started event
});
```

#### What to know

- **Two events, not one.** The started event fires on intent; the completed event fires on outcome. The gap between the two measures completion rate and helps identify drop-off from slow or failed actions.
- **Started fires before the API call.** This captures intent regardless of whether the action succeeds. If the API errors, you'll see a started event without a matching completed event — that's the signal, not a bug.
- **Completed fires only on success.** Do not fire on API errors, timeouts, or failures.
- **Completed carries a unique ID.** This links the completed event to the specific result. The started event does not carry an ID because the ID is assigned by the backend after the action executes.
- **Never capture PII in event properties.** Track which options were used (field names, categories, counts), never the values themselves (emails, phone numbers, names).

#### Acceptance Criteria: Product Engagement

| Check | How to Verify |
| --- | --- |
| Started event fires on action initiation | Trigger the action → activity feed → started event with expected properties |
| Completed event fires on success | Trigger action → wait for results → activity feed → completed event with `id` |
| Started fires even on failures | Trigger an action that will error → started fires, completed does NOT |
| No PII in event properties | Inspect both events — no user-entered values anywhere in properties |

<a id="event-7"></a>

## Event 7: User Properties Updated — Phase 1

**Why this exists:** Without person properties, attributes like `plan_name` only live on individual events. A PM cannot ask "show me engagement by users on the Premium plan" because the engagement event doesn't know the user's plan. Setting person properties persists user-level attributes so they're attached to every subsequent event — enabling segmentation by plan tier, subscription state, registration cohort, and more.

> `[Customize]` Replace the property list below with your product's user-level properties. The pattern of overwrite properties vs. write-once properties applies regardless of analytics platform.

### Person properties and their trigger points

| Property | Type | Set Where | Notes |
| --- | --- | --- | --- |
| `registration_timestamp` | Write-once | Registration | ISO 8601. Never overwritten. |
| `plan_name` | Overwrite | Subscription start, upgrade, downgrade, cancellation, login | Current plan slug. |
| `last_subscription_start_timestamp` | Overwrite | Subscription start, upgrade, downgrade | ISO 8601. |
| `first_subscription_timestamp` | Write-once | First-ever subscription | ISO 8601. Never overwritten — stays as original subscription date for cohort analysis. |
| `last_cancellation_timestamp` | Overwrite | Cancellation | ISO 8601. |
| {ADD_ON_PROPERTIES} | Overwrite | Add-on purchase | Quantity and date of most recent purchase. |

### Engineering

The set-person-properties calls are already shown inline with their trigger events (Events 4 and 5). This section documents the complete list and the reasoning.

#### What to know

- **Multiple call sites.** Each trigger event (registration, subscription, login, cancellation, upgrade/downgrade, add-on purchase) includes a set-person-properties call alongside its capture call.
- **Two categories of properties.** Overwrite properties always reflect the current state. Write-once properties are set on first occurrence and never overwritten — even if the user cancels and resubscribes.
- **Overwrite vs. write-once mechanism.** Most analytics platforms support both: a "set" operation that always overwrites, and a "set once" operation that only writes if the property doesn't already exist. Use the appropriate method for each property.

#### Events vs. person properties — what's reportable

**Event properties** are fully preserved. Every capture call creates a separate event in the analytics platform's timeline. Nothing gets overwritten. You can query "show me all subscription events for this person" and see each one with its full properties.

**Most person properties** are overwritten on each update. This is by design — they represent the person's *current* state, not their history. When a new subscription fires, `plan_name` overwrites to the new plan. The previous value is gone from the person's properties.

**Write-once properties are immutable.** `registration_timestamp` and `first_subscription_timestamp` are set once and never overwritten, even if the user cancels and resubscribes.

**So can you report on the full status history?** Yes — from the *events*, not the person properties. Build an insight that filters for subscription events for a person over a date range. That gives the full chronological story with all values intact.

**Person properties serve a different purpose:** filtering *other* events by the person's *current* state. For example, "show me all button clicks by Premium users" works because `plan_name` is always set to the current value. Person properties are not a history log — the events are.

#### Acceptance Criteria: User Properties Persist

| Check | How to Verify |
| --- | --- |
| Properties set after registration | Create account → Persons → `registration_timestamp` present |
| Properties set after subscription | Subscribe → Persons → `plan_name`, `last_subscription_start_timestamp` present |
| Write-once property not overwritten | Subscribe → cancel → resubscribe → `first_subscription_timestamp` unchanged |
| Properties restored on login | Log in with paid account → Persons → all expected properties present |
| Properties set after cancellation | Cancel → Persons → `last_cancellation_timestamp` present |
| Properties set after add-on purchase | Purchase add-on → Persons → add-on properties present |
| Funnels work | Insights → Funnel: `registration_completed` → `subscription_started` shows conversion |

---

<a id="phase-1-qa"></a>

## Phase 1 — QA Verification Checklist

Run through this after Phase 1 implementation, before marking Phase 1 as done.

#### Live Events

- Navigate 3+ routes → page view fires each time with correct `page_path`
- Click 3+ Phase 1 tracked buttons → `button_clicked` fires with correct `track_id` and `track_location`
- Sign up → `registration_completed` fires with `method`, person is identified, `registration_timestamp` set
- Log in → only `login_completed` fires (no `registration_completed`), person is re-identified
- Log out → `user_logged_out` fires, then new anonymous events appear under a fresh distinct ID
- Initiate account deletion → `account_deletion` fires only after backend confirms
- Complete subscription payment → `subscription_started` fires with expected properties; person properties set
- Upgrade subscription → `subscription_upgraded` fires with new `plan_name`; person properties updated
- Purchase add-on → add-on event fires with expected properties; person properties set
- Apply promo code → `promo_code` is lowercased, `discount_amount` present; without promo → both absent
- Cancel subscription → `subscription_cancelled` fires with `plan_name` and `effective_at`; `last_cancellation_timestamp` set
- Trigger core engagement action → started event fires immediately; completed event fires on success
- Trigger failing engagement action → started fires, completed does NOT
- No PII in engagement events → properties contain field names only, never actual values

#### Person Profiles

- Person profile shows pre-login events after identify (anonymous → identified merge)
- After logout, new anonymous events appear under a fresh distinct ID
- All expected person properties present after full lifecycle flow
- Write-once properties not overwritten on repeat actions
- Funnels work: `registration_completed` → `subscription_started` shows conversion

#### No Double-Counting

- Auto page view capture disabled in SDK init
- One route change = one page view event (not two)

---

## Phase 2+ — Event Implementation

Events and properties with priority 2 are implemented in Phase 2. Events and properties with no assigned priority (`null`) should be reviewed for inclusion in Phase 2 or deferral to Phase 3.

<a id="event-2-phase-2"></a>

## Event 2: Button Clicks — Phase 2+ (`track_id` values)

The `data-track` infrastructure (global click listener in the app shell) is already in place from Phase 1. Phase 2+ adds `data-track` attributes to the remaining tracked buttons.

**Phase 2 buttons (priority 2):** {LIST_PHASE_2_TRACK_IDS}

**Remaining buttons (unassigned priority — review for Phase 2 or Phase 3):** All other `track_id` values in the [Event Taxonomy](./taxonomy/) not listed above or in Phase 1.

Engineering adds `data-track` (and `data-track-location` for modal buttons) to each element following the same patterns described in [Event 2 (Phase 1)](#event-2). No new code is needed — the existing global click listener fires `button_clicked` automatically for any element with a `data-track` attribute.

<a id="event-3-phase-2"></a>

## Event 3: Modal Lifecycle — Phase 2

**Three events.** `modal_viewed` fires when a modal opens. `modal_dismissed` fires when it closes without completing the action. `modal_confirmed` fires when the action inside the modal **succeeds** — use it when "clicked" ≠ "succeeded" (e.g. a payment API call the server can reject). For modals where clicking the button always completes the action, `button_clicked` (Event 2) alone is sufficient and `modal_confirmed` is not needed.

### Engineering

Pattern, not paste: The code below shows **where to place** the capture calls relative to your modal's open/close lifecycle. The component shape assumes a typical modal API — **adapt to whatever modal component your app uses**. Replace `modal_name` values with the names from the [Event Taxonomy](./taxonomy/).

#### Capture `modal_viewed` when the modal opens

```jsx
// PATTERN: Place this inside the component that controls your modal.

useEffect(() => {
  if (isOpen) {
    const eventProps = {
      modal_name: '{MODAL_NAME}',           // ← replace with value from Taxonomy
    };

    // [Customize] If any modal carries additional properties (e.g. a search ID
    // linking back to a prior event), add them conditionally here.

    analyticsClient.capture('modal_viewed', eventProps);
  }
}, [isOpen]);
```

#### Capture `modal_dismissed` on close WITHOUT completing

```jsx
// PATTERN: Add the capture call to your modal's close/dismiss handler.

<Modal
  show={isOpen}
  onHide={() => {                           // ← your modal's close callback
    analyticsClient.capture('modal_dismissed', {
      modal_name: '{MODAL_NAME}',
    });
    setIsOpen(false);
  }}
>
  {/* Confirm button uses data-track (Event 2) for the click itself */}
  <Button
    data-track="{CONFIRM_TRACK_ID}"
    data-track-location="{MODAL_NAME}"
    onClick={() => {
      processAction().then(() => {
        // Capture modal_confirmed ONLY after the action succeeds
        analyticsClient.capture('modal_confirmed', {
          modal_name: '{MODAL_NAME}',
        });
        setIsOpen(false);
      });
    }}
  >
    Confirm
  </Button>
</Modal>
```

#### What to know

- **One `modal_name` per modal, used in all events.** The value in `modal_viewed`, `modal_dismissed`, and `modal_confirmed` must match so analytics can pair opens with outcomes.
- **The confirm button click is tracked by Event 2.** Its `data-track` attribute fires `button_clicked` automatically. `modal_confirmed` is a separate event that fires on **success**, not on click.
- **`modal_confirmed` is conditional.** Only add it to modals where the confirm action can fail (API calls, payment processing). For modals where the click always completes the action, `button_clicked` alone is sufficient.
- **Dismissal = any close that isn't the confirm action.** Backdrop click, Escape key, X button — if your modal component funnels all of these through one callback, the single capture covers them all.

#### Acceptance Criteria: Modal Lifecycle Fires Correctly

| Check | How to Verify |
| --- | --- |
| `modal_viewed` fires on open | Open a modal → activity feed → `modal_viewed` with `modal_name` |
| `modal_dismissed` fires on close-without-action | Open modal → close via X or backdrop → `modal_dismissed` |
| `modal_confirmed` fires on success | Open modal with async action → click confirm → action succeeds → `modal_confirmed` |
| No `modal_confirmed` on failure | Click confirm → action fails → no `modal_confirmed` |
| No `modal_dismissed` on confirm | Click confirm → only `button_clicked` (+ `modal_confirmed` on success), no `modal_dismissed` |

<a id="event-5-phase-2"></a>

## Event 5: Subscription Downgraded — Phase 2

### Engineering

#### When a subscriber downgrades to a lower plan

```js
// PATTERN: Place inside the handler that runs after the backend confirms the plan downgrade.

analyticsClient.capture('subscription_downgraded', {
  plan_name: '{NEW_PLAN_SLUG}',             // ← the NEW plan after downgrade
  effective_at: '{ISO_8601}',               // ← when the downgrade takes effect
});

// Set person properties — update plan_name and subscription timestamp
analyticsClient.setPersonProperties({
  plan_name: '{NEW_PLAN_SLUG}',
  last_subscription_start_timestamp: '{ISO_8601}',
});
```

#### Acceptance Criteria: Subscription Downgraded

| Check | How to Verify |
| --- | --- |
| `subscription_downgraded` fires | Downgrade → activity feed → `subscription_downgraded` with new `plan_name` and `effective_at` |
| Person properties update | Persons → `plan_name` and `last_subscription_start_timestamp` updated |

---

<a id="phase-2-qa"></a>

## Phase 2+ — QA Verification Checklist

Run through this after Phase 2+ implementation, in addition to the Phase 1 checklist.

#### Live Events

- Click Phase 2 tracked buttons → `button_clicked` fires with correct `track_id` and `track_location`
- Open a modal → `modal_viewed` fires with correct `modal_name`
- Close modal without action → `modal_dismissed` fires
- Close modal by confirming (async action) → `button_clicked` fires on click, `modal_confirmed` fires on success, `modal_dismissed` does NOT fire
- Downgrade subscription → `subscription_downgraded` fires with new `plan_name` and `effective_at`; person properties updated

#### No Double-Counting

- Modal confirm = one `button_clicked` (no duplicate `modal_confirmed`)

---

<a id="architecture"></a>

## Reference — Architecture Diagram

> `[Customize]` Adapt the system names and data flows to your stack.

Data flows left to right across two systems. Engineering owns the left side (backend API + frontend code). The analytics platform receives events directly from the SDKs.

```
┌───────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  User & Subscriber│     │   {FRAMEWORK} App    │     │  {ANALYTICS_PLATFORM}│
│  Database         │     │                      │     │                      │
│                   │     │  {CLIENT_SDK}         │     │  $pageview           │
│  Source of truth  │     │    .capture()         │────▶│  button_clicked      │
│  for user profile │────▶│    .identify()        │     │  registration_       │
│  + subscription   │ API │    .reset()           │     │    completed         │
│  data             │resp.│    .setPersonProps()  │     │  subscription_       │
│                   │     │                      │     │    started           │
│  Provides:        │     │  {SERVER_SDK}         │     │  ...                 │
│  · user_id        │     │    .capture()         │────▶│                      │
│  · plan_name      │     │    (API routes,       │     │  Person Profiles     │
│  · timestamps     │     │     server-side       │     │  · plan_name         │
│  · {add-on data}  │     │     rendering)        │     │  · registration_ts   │
│  · is first sub?  │     │                      │     │  · first_sub_ts      │
│                   │     │  <Button              │     │  · ...               │
│                   │     │    data-track="..."   │     │                      │
│                   │     │  />                   │     │  Session Replay      │
│                   │     │                      │     │  Funnels & Cohorts   │
│                   │     │  Global click listener│     │  Feature Flags       │
└───────────────────┘     └──────────────────────┘     └──────────────────────┘

  ◀──── BACKEND ────▶      ◀─────── FRONTEND ──────▶     ◀──── ANALYTICS ────▶
  Confirms actions;        Calls analytics SDKs          Receives events,
  returns user profile     directly; reads API            builds person profiles,
  + subscription data      responses; adds data-track     runs funnels & reports
```

<a id="companion"></a>

## Reference — Companion Documents

> `[Customize]` List the companion documents for your implementation.

| Document | Purpose | Owner |
| --- | --- | --- |
| **Event Taxonomy** (`analytics/taxonomy/`) | Complete registry of all pre-determined values: every `data-track` name, `data-track-location`, `modal_name`, `plan_name`, and `method` value used in the implementation, along with priority assignments and lifecycle stage mappings. Engineering uses this as the source of truth when adding attributes and capture calls. | Product / MarOps maintains; Engineering consumes |
| **{ANALYTICS_PLATFORM} Framework Integration Guide** | Official documentation for framework setup with the client and server SDKs. | {ANALYTICS_PLATFORM} (external) |
