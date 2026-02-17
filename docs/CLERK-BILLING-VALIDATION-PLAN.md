# Clerk Billing Production Validation Plan

**App**: Ascendify  
**Date**: 2026-02-17  
**Scope**: End-to-end purchase → webhook → plan sync → feature gating cycle  
**Environment targets**: Vercel production (`ascend-wheat-six.vercel.app`) + Convex cloud

---

## 0) Prerequisites — must pass before any test

### A. Environment readiness

| Variable | Location | Current status | Required action |
|---|---|---|---|
| `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL` | Vercel env | **EMPTY** | Create Pro Monthly product in Clerk → paste hosted link |
| `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL` | Vercel env | **EMPTY** | Create Pro Yearly product in Clerk → paste hosted link |
| `NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL` | Vercel env | **EMPTY** | Create Lifetime product in Clerk → paste hosted link |
| `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL` | Vercel env | **EMPTY** | Enable billing portal in Clerk → paste portal link |
| `CLERK_WEBHOOK_SECRET` | Vercel env | **EMPTY** | Register webhook in Clerk dashboard → copy signing secret |
| `BILLING_WEBHOOK_SYNC_SECRET` | Vercel env **AND** Convex env | **EMPTY** | Generate a 32+ char secret, set in both places (must match) |

### B. Clerk dashboard configuration

1. **Products/Prices created**
   - Pro Monthly: $12/mo recurring
   - Pro Yearly: $96/yr recurring
   - Lifetime: $199 one-time

2. **Webhook endpoint registered**
   - URL: `https://ascend-wheat-six.vercel.app/api/webhooks/clerk-billing`
   - Events subscribed:
     - `billing.subscription.created`
     - `billing.subscription.updated`
     - `billing.subscription.deleted`

3. **Billing portal enabled**
   - Hosted portal URL copied to env

### C. Middleware allowlist verified

The webhook route is already public in middleware (`/api/webhooks(.*)`).  
Confirm by checking `src/proxy.ts` — the route matcher includes `/api/webhooks(.*)` as a public route.

---

## 1) Test Case Matrix

### TC-01: Free user baseline

| Step | Action | Expected result |
|---|---|---|
| 1 | Sign up as new user | User created in Convex with `plan: "free"` |
| 2 | Open `/billing` | See 4 plan cards (Free highlighted as current) |
| 3 | Open `/dashboard` | Gating limits applied (10 habits max, 3 goals max) |
| 4 | Try AI insights | Available (`canUse('aiInsights') === true`) |

**Pass criteria**: Free restrictions enforce correctly (10 habits, 3 goals), AI insights available on free, billing page renders with all plan cards.

---

### TC-02: Pro Monthly purchase — happy path

| Step | Action | Expected result |
|---|---|---|
| 1 | Click "Start Pro Monthly" on `/billing` | Redirected to Clerk-hosted checkout |
| 2 | Complete payment with Clerk test card | Checkout success page shown |
| 3 | _Wait 5-30s for webhook_ | Clerk fires `billing.subscription.created` |
| 4 | Check Vercel function logs | Log entry: `[Webhook] Updating plan for <clerkId> → pro` |
| 5 | Check Convex dashboard | User document: `plan: "pro"` |
| 6 | Reload `/dashboard` | All pro features unlocked (unlimited habits, AI insights, etc.) |
| 7 | Open `/billing` | "Manage" button links to portal |

**Pass criteria**: Plan updates to `pro` within 60s of payment without manual intervention.

---

### TC-03: Pro Yearly purchase

| Step | Action | Expected result |
|---|---|---|
| 1 | Click "Start Pro Yearly" on `/billing` | Clerk checkout for yearly plan |
| 2 | Complete payment | Success |
| 3 | Webhook fires | `billing.subscription.created` with yearly plan identifier |
| 4 | `mapClerkPlanToUserPlan()` maps to `pro` | Convex user plan = `pro` |
| 5 | Dashboard reflects pro access | Unlimited features available |

**Pass criteria**: Yearly variant correctly maps to `pro` (not a new plan type).

---

### TC-04: Lifetime purchase

| Step | Action | Expected result |
|---|---|---|
| 1 | Click "Get Lifetime Access" on `/billing` | Clerk checkout for one-time payment |
| 2 | Complete payment | Success |
| 3 | Webhook fires | Event with lifetime plan identifier |
| 4 | `mapClerkPlanToUserPlan()` maps to `lifetime` | Convex user plan = `lifetime` |
| 5 | Dashboard shows lifetime badge | No recurring billing UI shown |

**Pass criteria**: Lifetime correctly stored, no subscription renewal expectations in UI.

---

### TC-05: Subscription cancellation — downgrade to free

| Step | Action | Expected result |
|---|---|---|
| 1 | Open billing portal (click "Manage" on `/billing`) | Portal loaded |
| 2 | Cancel subscription | Cancellation confirmed in portal |
| 3 | Clerk fires `billing.subscription.deleted` | Webhook received |
| 4 | Check Vercel logs | `[Webhook] Subscription cancelled for <clerkId>` |
| 5 | Check Convex | User plan = `free` |
| 6 | Reload dashboard | Free limits re-applied |

**Pass criteria**: Downgrade is automatic and immediate after cancellation webhook.

---

### TC-06: Subscription update (plan change)

| Step | Action | Expected result |
|---|---|---|
| 1 | User on Pro Monthly upgrades to Pro Yearly via portal | `billing.subscription.updated` fires |
| 2 | Plan stays `pro` in Convex | No interruption — same app-level plan |

**Pass criteria**: Plan change within the same tier does not reset or break state.

---

### TC-07: Webhook retry resilience

| Step | Action | Expected result |
|---|---|---|
| 1 | Same webhook event delivered twice (Clerk retry) | Second call is a no-op (idempotent `patch`) |
| 2 | No duplicate users, no errors | Convex mutation patches same value |

**Pass criteria**: No 500 errors, no data corruption on retries.

---

### TC-08: Webhook before user sync (race condition)

| Step | Action | Expected result |
|---|---|---|
| 1 | Webhook arrives for a `clerkId` not yet in Convex | Mutation logs warning: `User not found for clerkId=...` |
| 2 | Returns 200 OK (no crash) | Clerk does not retry endlessly |
| 3 | User signs in later → `store` mutation creates user with `plan: free` | User exists; next webhook will update plan |

**Pass criteria**: No crash, safe no-op, warning logged.

---

### TC-09: Invalid/unknown plan identifier

| Step | Action | Expected result |
|---|---|---|
| 1 | Webhook payload has plan_id = `"some_unknown_thing"` | `mapClerkPlanToUserPlan()` returns `"free"` |
| 2 | User plan set to `free` (safe fallback) | No crash |

**Pass criteria**: Unknown plans default to `free`, logged for review.

---

### TC-10: Signature verification failure

| Step | Action | Expected result |
|---|---|---|
| 1 | Send POST to `/api/webhooks/clerk-billing` without valid Svix headers | 400 response |
| 2 | Send POST with tampered body | 400 "Invalid signature" |
| 3 | No Convex mutation called | Data integrity preserved |

**Pass criteria**: Unsigned/tampered requests rejected, no plan changes.

---

### TC-11: Missing `BILLING_WEBHOOK_SYNC_SECRET`

| Step | Action | Expected result |
|---|---|---|
| 1 | Remove `BILLING_WEBHOOK_SYNC_SECRET` from env | Webhook route returns 500 `Server config error` |
| 2 | No Convex mutation attempted | Safe failure |

**Pass criteria**: Explicit error logged, no silent data corruption.

---

### TC-12: Secret mismatch between Next.js and Convex

| Step | Action | Expected result |
|---|---|---|
| 1 | Set different `BILLING_WEBHOOK_SYNC_SECRET` in Next.js vs Convex | Convex mutation throws `Unauthorized webhook plan update` |
| 2 | Webhook route returns 500 | Plan not updated |

**Pass criteria**: Mismatched secrets fail loudly.

---

## 2) Feature gating verification matrix

After plan update, verify these transitions:

| Feature | `free` | `pro` / `lifetime` |
|---|---|---|
| Max habits | 10 | Unlimited |
| Max goals | 3 | Unlimited |
| AI insights | Available | Available |
| Advanced analytics | Blocked | Available |
| Habit stacking | Blocked | Available |
| Identity system | Blocked | Available |
| Data export | Blocked | Available |
| Custom themes | Blocked | Available |
| Priority support | No | Yes |

Source: `src/hooks/usePlanGating.ts`

---

## 3) Observability checkpoints

### Vercel function logs
- Filter by function: `/api/webhooks/clerk-billing`
- Look for:
  - `[Webhook] Received: <event_type>`
  - `[Webhook] Updating plan for <clerkId> → <plan>`
  - `[Webhook] Subscription cancelled for <clerkId>`
  - Any `Error processing` entries

### Convex dashboard
- Open Data tab → users table
- Filter by the test user's `clerkId`
- Verify `plan` field changes after each test

### Clerk dashboard
- Billing → Subscriptions tab
- Confirm subscription state matches expected for each test

---

## 4) Test execution order (recommended)

```
TC-10 (auth rejection)       ← validate security first
TC-11 (missing secret)       ← validate config safety
TC-12 (secret mismatch)      ← validate config safety
TC-01 (free baseline)        ← establish baseline
TC-02 (pro monthly purchase) ← critical happy path
TC-05 (cancellation)         ← critical downgrade path
TC-03 (pro yearly)           ← variant check
TC-04 (lifetime)             ← variant check
TC-06 (plan change)          ← edge case
TC-07 (webhook retry)        ← resilience
TC-08 (race condition)       ← edge case
TC-09 (unknown plan)         ← fallback safety
```

---

## 5) Sign-off criteria

All of the following must be true before declaring billing production-ready:

- [ ] TC-02 passes end-to-end (pro monthly purchase → plan sync)
- [ ] TC-05 passes end-to-end (cancellation → downgrade)
- [ ] TC-10 passes (unsigned requests rejected)
- [ ] No 500 errors in Vercel logs during test suite
- [ ] Convex user plan matches expected state after each test
- [ ] Feature gating reflects plan changes in real-time
- [ ] Billing page renders correctly for both signed-in and signed-out users

---

## 6) Known limitations / future work

1. **No trial period**: Current plans go directly to paid. Trial support requires Clerk pricing model changes + additional webhook events.
2. **No proration handling**: Plan upgrades/downgrades don't show prorated amounts in-app (handled by Clerk portal).
3. **No invoice display**: Invoices are managed in Clerk portal, not surfaced in-app.
4. **Webhook-only sync**: If a webhook is lost, plan state could be stale until next webhook. Consider adding a periodic plan check or Clerk API polling as a fallback.


webhooks for clerk billing: ---
title: Clerk Billing webhooks
description: Clerk Billing webhooks allow you to track Subscription lifecycles
  and monitor payment attempts.
sdk: nextjs, react, expo, react-router, astro, tanstack-react-start, remix,
  nuxt, vue, js-frontend, expressjs, fastify, js-backend
sdkScoped: "true"
canonical: /docs/:sdk:/guides/development/webhooks/billing
lastUpdated: 2026-02-11T17:16:16.000Z
availableSdks: nextjs,react,expo,react-router,astro,tanstack-react-start,remix,nuxt,vue,js-frontend,expressjs,fastify,js-backend
notAvailableSdks: chrome-extension,android,ios,go,ruby
activeSdk: nextjs
sourceFile: /docs/guides/development/webhooks/billing.mdx
---

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

Clerk Billing supports webhook events that allow you to track information like Subscription lifecycles and payments. This reference describes the events Clerk supports for Billing. For more information about webhooks, see the [dedicated guide](/docs/guides/development/webhooks/overview).

## Subscriptions

A Subscription is a top-level container unique to each user or organization. Subscription events can help you track billing changes for each of your customers.

| Event Name | Description |
| - | - |
| `subscription.created` | The top-level Subscription is created. This usually happens when a user or organization is created. For existing users and organizations, a Subscription will be created when Billing is enabled for the application. |
| `subscription.updated` | The top-level Subscription is updated. This event is triggered when any property of the Subscription has changed, except for status changes. For example, when the Subscription Items for the payer change. |
| `subscription.active` | The top-level Subscription transitions to active from a non-active status. This happens when any Subscription Item is set to active, including items from the free default Plan. |
| `subscription.pastDue` | The top-level Subscription contains a Subscription Item that has become past due. |

## Subscription Items

A Subscription Item provides details about the relationship between the payer (user or Organization) and a Plan. A top-level Subscription may contain multiple Subscription Items.

There can only be one `active` Subscription Item per payer and Plan. In addition, the Subscription Item for the default Plan will always have the same `id` to allow easier tracking of which users and Organizations are not paid customers.

| Event Name | Description |
| - | - |
| `subscriptionItem.updated` | The Subscription Item is updated. This event is triggered when a property of the Subscription Item has changed that does not result in a status change. For example, when a Subscription Item is renewed and the recurring monthly charge succeeds, the status doesn't change (remains `active`), but `period_start` and `period_end` are updated. This results in a `subscriptionItem.updated` event. |
| `subscriptionItem.active` | The Subscription Item is set to active. For paid Plans, this happens on successful payment. |
| `subscriptionItem.canceled` | The Subscription Item is canceled. The payer retains Plan features until the end of the current billing period. |
| `subscriptionItem.upcoming` | The Subscription Item is set as upcoming after the current billing period. This can happen in the case of a deferred Plan change from a higher-priced to lower-priced Plan. In the case a paid Plan is canceled, the Subscription Item for the default, free Plan will be set as `upcoming`. |
| `subscriptionItem.ended` | The Subscription Item has ended. |
| `subscriptionItem.abandoned` | The Subscription Item is abandoned. This can happen to `upcoming` Subscription Items if the payer subscribes to another Plan, or re-subscribes to a currently canceled Plan. |
| `subscriptionItem.incomplete` | The Subscription Item is incomplete. This means the payer has started a checkout for a Plan, but the payment hasn't been successfully processed yet. Once payment succeeds, the Subscription Item transitions to an `active` status. |
| `subscriptionItem.pastDue` | The Subscription Item is past due because a recurring charge has failed. |
| `subscriptionItem.freeTrialEnding` | The Subscription Item is a free trial and is ending soon. This event is sent three days before the trial ends. If the trial is shorter than three days, it's sent immediately. |

## Payment attempts

Payment attempts allow you to track successful and failed payments, for both checkout and recurring charges.

Payment attempt events contain a `type`, which can be either `checkout` or `recurring`. You can use these values to determine whether a payment attempt was for a checkout or a Subscription Item renewal's recurring charge.

| Event Name | Description |
| - | - |
| `paymentAttempt.created` | A payment attempt has been created with `pending` status. It can either succeed or fail in the future. |
| `paymentAttempt.updated` | A payment attempt has been updated to `paid` or `failed` status. |

Looking for other webhook events? To find a list of all the events Clerk supports, navigate to the [**Webhooks**](https://dashboard.clerk.com/~/webhooks) page in the Clerk Dashboard and select the **Event Catalog** tab.


---
title: Install Clerk with shadcn/ui CLI
description: Use the shadcn/ui CLI to bootstrap your Next.js app with Clerk.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/guides/development/shadcn-cli
lastUpdated: 2026-02-11T17:16:16.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/development/shadcn-cli.mdx
---

The [shadcn/ui CLI](https://ui.shadcn.com/docs/cli) is a tool that allows you to bootstrap your Next.js app with Clerk. Clerk's shadcn/ui registry enables developers to add pre-built components and configurations to their projects with a single command. You can either get started with the [complete quickstart package](#quickstart), or add [pages](#pages) and [components](#components) individually.

## Quickstart

Get started with Clerk authentication in seconds using the complete quickstart package:

```npm {{ filename: 'terminal' }}
npx shadcn@latest add @clerk/nextjs-quickstart
```

This single command will install:

* App layout with ClerkProvider and theme integration
* Sign-in and sign-up pages with catch-all routes
* Clerk middleware for route protection
* Header component with authentication buttons
* Theme provider for dark/light mode support

## Pages

### Sign In

The sign-in page is a dedicated page that allows users to sign in to their account.

```npm {{ filename: 'terminal' }}
npx shadcn@latest add @clerk/nextjs-sign-in-page
```

### Sign Up

The sign-up page is a dedicated page that allows users to sign up for a new account which includes a two column layout with a list of selling points and a form to sign up.

```npm {{ filename: 'terminal' }}
npx shadcn@latest add @clerk/nextjs-sign-up-page
```

### Waitlist

The following example includes a basic implementation of the `<Waitlist />` component hosted on the `/waitlist` route. You can use this as a starting point for your own implementation.

```npm {{ filename: 'terminal' }}
npx shadcn@latest add @clerk/nextjs-waitlist-page
```

## Components

### `<ClerkProvider />`

The <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider /></SDKLink> component is required to integrate Clerk into your React application, providing session and user context to Clerk's hooks and components.

```npm {{ filename: 'terminal' }}
npx shadcn@latest add @clerk/nextjs-clerk-provider
```

With the ClerkProvider component installed, you can wrap your app's layout to provide Clerk's authentication context to your app.

```tsx {{ filename: 'app/layout.tsx', mark: ['ClerkProvider'] }}
import { ClerkProvider } from '@/components/clerk-provider'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

## Files

### Middleware

The <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware()</SDKLink> helper integrates Clerk authentication into your Next.js application through Middleware.

```npm {{ filename: 'terminal' }}
npx shadcn@latest add @clerk/nextjs-middleware
```


---
title: Default Plans
description: Learn more about default Plans and how they work in Clerk Billing
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/billing/default-plans
sourceFile: /docs/guides/billing/default-plans.mdx
---

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

When Billing is enabled, Clerk automatically assigns the free Plan to every new user or organization as the **default Plan**. This ensures every customer always has an active Subscription.

Users are moved to the free Plan when they:

* Downgrade from a paid Subscription
* Stop paying for a paid Subscription
* Cancel a paid Subscription

## Can I update it?

You can update the name, slug, and public visibility.

Changing public visibility doesn't change the free Subscription functionality; it just hides it from the pricing table.

## Is it possible to change the default Plan?

Not yet, but additional features are planned to support paid-customers-only use cases.

---
title: Test emails and phones
description: Write end to end tests by simulating OTP verifications.
lastUpdated: 2026-02-13T18:28:41.000Z
sdkScoped: "false"
canonical: /docs/guides/development/testing/test-emails-and-phones
sourceFile: /docs/guides/development/testing/test-emails-and-phones.mdx
---

Most of Clerk's sign-in and sign-up flows involve verifying ownership of an email address or phone number via a <Tooltip><TooltipTrigger>one-time password (OTP)</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip>. To confirm that your integration works correctly, you can simulate verification flows without sending an email or SMS, by using reserved values in test mode.

Verification messages are used during sign-up, sign-in, and when adding an email address or phone number to an existing account.

## Limitations

If Clerk is used to deliver SMS messages and/or emails for your development instance, a maximum of 20 SMS messages and 100 emails can be delivered per calendar month.

After that, requests resulting in SMS and/or email <Tooltip><TooltipTrigger>OTPs</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> will be rejected. Other SMS or email notifications will still produce a webhook but won't be sent to the target address.

The following cases do not count toward the limit:

* SMS messages sent to US numbers
* SMS messages or emails sent to test numbers/addresses
* Self-delivered SMS messages or emails (i.e. not delivered by Clerk)
* SMS messages or emails for apps with a paid subscription

If your development instance requires a higher allowance of monthly SMS messages or emails, contact support to request a limit increase.

## Set up test mode

Every development instance has **test mode** enabled by default. If you need to use **test mode** on a production instance, you can enable it in the Clerk Dashboard. However, this is highly discouraged.

To enable or disable **test mode**, in the Clerk Dashboard, navigate to the [**Settings**](https://dashboard.clerk.com/~/settings) page.

### Email addresses

Any email with the `+clerk_test` subaddress is a test email address. No emails will be sent, and they can be verified with the code `424242`.

For example:

`jane+clerk_test@example.com`

`doe+clerk_test@example.com`

### Phone numbers

Any [fictional phone number](https://en.wikipedia.org/wiki/555_\(telephone_number\)) is a test phone number. No SMS will be sent, and they can all be verified with the code `424242`.

Fictional phone numbers have the following structure:

`+1 (XXX) 555-0100` to `+1 (XXX) 555-0199`

For example:

`+12015550100`

`+19735550133`

### Email links

Testing email links in E2E suites is an uphill task. We recommend turning on the [**Email verification code**](/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) setting, and using that flow to authenticate your tests. The flows are very similar.

## Code examples

### Testing sign in via email code

```tsx
const testSignInWithEmailCode = async () => {
  const { signIn } = useSignIn()

  const emailAddress = 'john+clerk_test@example.com'
  const signInResp = await signIn.create({ identifier: emailAddress })
  const { emailAddressId } = signInResp.supportedFirstFactors.find(
    (ff) => ff.strategy === 'email_code' && ff.safeIdentifier === emailAddress,
  )! as EmailCodeFactor

  await signIn.prepareFirstFactor({
    strategy: 'email_code',
    emailAddressId: emailAddressId,
  })

  const attemptResponse = await signIn.attemptFirstFactor({
    strategy: 'email_code',
    code: '424242',
  })

  if (attemptResponse.status == 'complete') {
    console.log('success')
  } else {
    console.log('error')
  }
}
```

### Testing sign up with phone number

```jsx
const testSignUpWithPhoneNumber = async () => {
  const { signUp } = useSignUp()

  await signUp.create({
    phoneNumber: '+12015550100',
  })
  await signUp.preparePhoneNumberVerification()

  const res = await signUp.attemptPhoneNumberVerification({
    code: '424242',
  })
  if (res.verifications.phoneNumber.status == 'verified') {
    console.log('success')
  } else {
    console.log('error')
  }
}
```


---
title: Deploying a Clerk app to Vercel
description: Learn how to deploy a Clerk app to Vercel.
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/development/deployment/vercel
sourceFile: /docs/guides/development/deployment/vercel.mdx
---

> \[!WARNING]
> This guide assumes that you have already installed Clerk in your application locally and are ready to deploy. If you haven't installed Clerk yet, see the [setup guide](/docs/getting-started/quickstart/setup-clerk).

If you haven't set up your application in Vercel yet, [set up a new Vercel project](#set-up-a-new-vercel-project).

If you already have a Vercel project for your application and need to integrate Clerk, [add Clerk API keys to an existing Vercel project](#add-clerk-api-keys-to-existing-vercel-project).

## Set up a new Vercel project

1. To set up a new Vercel project, start by going to your [Vercel Dashboard](https://vercel.com/dashboard). Here, you'll see a list of your projects or, if you don't have any projects yet, a prompt to create a new project.
2. Create a new project by pressing the **Add New** button in the top right corner of the screen or by [pressing this link](https://vercel.com/new). You'll be redirected to a page where you can import a Git repository.
3. Find the Git repository you want to use and press **Import**. You'll be redirected to the **Configure Project** page.
4. Fill out the necessary information. And most importantly, ensure to add your Clerk API keys to the **[Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)**. You can find your Clerk API keys by navigating to the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.

> \[!WARNING]
> If you would like to deploy to production, you will need to add your **production** API keys to your Vercel project. Refer to the [Deploy to production](/docs/guides/development/deployment/production) guide for more information.

## Add Clerk API keys to existing Vercel project

1. To add your Clerk API keys to an existing Vercel project, start by selecting your project from your [Vercel dashboard](https://vercel.com/dashboard).
2. Select **Settings** in the navigation bar at the top.
3. In the sidenav, select **Environment Variables** and add your Clerk API keys. You can find your Clerk API keys by navigating to the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.
4. When adding **Environment Variables**, you can select which keys associate with which Vercel deployment environments. Using this, you can have your production Vercel environment use your production Clerk API keys while having your preview and development Vercel deployments use your development Clerk API keys.

> \[!WARNING]
> If you would like to deploy to production, you will need to add your **production** API keys to your Vercel project. Refer to the [Deploy to production](/docs/guides/development/deployment/production) guide for more information.

## Vercel preview environment

To configure Clerk within your Vercel preview environment, see the [guide for configuring a preview environment](/docs/guides/development/managing-environments).

## Deploy to production

If you would like to deploy your Vercel project to production, you will need to add your **production** API keys to your Vercel project. You will also need a domain that you own, as you cannot use a `*.vercel.app` domain for production. Refer to the [Deploy to production](/docs/guides/development/deployment/production) guide for more information.

> \[!QUIZ]
> Why can't you use a `*.vercel.app` domain for production?
>
> ***
>
> To deploy to production, you need to set DNS records, which isn't possible with `vercel.app` domains.---
title: SDK development
description: A reference for implementing a new Clerk SDK from scratch.
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/development/sdk-development/overview
sourceFile: /docs/guides/development/sdk-development/overview.mdx
---

Clerk believes that truly optimal developer experience can only be achieved by building SDKs independently for each framework. Each framework differentiates itself with nuanced patterns, and it's important to lean into those patterns to avoid feeling like a square peg in a round hole.

The following guides provide contributors with all the necessary guidance on how to build a new SDK from scratch.

> \[!TIP]
> Need help while developing a new SDK? Join the `#sdk-community-devs` channel on [Discord](https://clerk.com/discord) to chat with fellow SDK maintainers. You can also look at existing SDKs [on GitHub](https://github.com/clerk/javascript). **Note:** Clerk does not have an official support system for community developers.

## Get started

Before building a new Clerk SDK, familiarize yourself with terminology and core concepts:

* [Terminology](/docs/guides/development/sdk-development/terminology)
* [Philosophy](/docs/guides/development/sdk-development/philosophy)
* [Conventions](/docs/guides/development/sdk-development/conventions)
* [SDK Types](/docs/guides/development/sdk-development/types)

## Guides

After understanding the fundamentals, follow these guides to start developing your SDK:

* [Frontend-only SDK](/docs/guides/development/sdk-development/frontend-only)
* [Backend-only SDK](/docs/guides/development/sdk-development/backend-only)
* [Fullstack SDK](/docs/guides/development/sdk-development/fullstack)
---
title: Terminology
description: A list of common terms and their explanations used inside Clerk's SDKs.
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/development/sdk-development/terminology
sourceFile: /docs/guides/development/sdk-development/terminology.mdx
---

A consistent terminology should be used across all user interactions with Clerk's services (e.g., SDKs, documentation, dashboard, error messages, support). The following list includes the most common terms and their explanations. Use these terms in your SDKs, documentation, and support materials.

| Name | Description |
| - | - |
| Client | A [client](/docs/reference/javascript/client){{ target: '_blank' }} represents the current device or software accessing an application such as your web browser, native application, Chrome Extension, or Electron app. |
| Session | A [session](/docs/reference/javascript/session){{ target: '_blank' }} is a secure representation of the authentication state of the current user. Each client can hold multiple sessions on the same device. This is identical to how Gmail works in a browser. |
| User | A user represents the current user of the session. The [`User`](/docs/reference/javascript/user){{ target: '_blank' }} object holds all the basic user information e.g. name, email addresses, phone numbers, etc… including their public, private, and unsafe metadata. |
| Organization | An [Organization](/docs/reference/javascript/organization){{ target: '_blank' }} represents the current Organization of the session. Users can belong to many Organizations. One of them will be the <Tooltip><TooltipTrigger>Active Organization</TooltipTrigger><TooltipContent>A user can be a member of multiple Organizations, but only one can be active at a time. The **Active Organization** determines which Organization-specific data the user can access and which Role and related Permissions they have within the Organization.</TooltipContent></Tooltip> of the session. |
| FAPI | [Frontend API of Clerk](/docs/reference/frontend-api){{ target: '_blank' }}. Example: `https://random-name.clerk.accounts.dev` (Production example: `https://clerk.your-domain.com`). FAPI is the primary API for Clerk's UI components. Every Clerk development/production instance has a dedicated FAPI. This is the authentication, session, user & organization management API you or your users will interact with. |
| BAPI | [Backend API of Clerk](/docs/reference/backend-api){{ target: '_blank' }}. Currently set to `https://api.clerk.com`. A restful CRUD API for the server-side. |
| Secret Key | Your app's <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip> for use in the backend. Do not expose this on the frontend with a public environment variable. Allows for CRUD operations. |
| Publishable Key | Your app's <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip> for use in the frontend. |
| Instances | When creating an app, you're provided with two instances: Development and Production. [Learn more](/docs/guides/development/managing-environments). |
| Hotloading ClerkJS | `@clerk/clerk-js`, or ClerkJS, is the foundational JavaScript library for all frontend JS SDKs, e.g. used in `@clerk/clerk-react`. When you install `@clerk/clerk-react` through npm, you don't install `@clerk/clerk-js`. Instead, once the React code is executed in the browser, the React SDK adds a `<script>` tag to load ClerkJS from a CDN. Clerk internally calls this “hotloading”. |
| UI components | All components displayed in the <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>component reference</SDKLink> and available through the [`Clerk`](/docs/reference/javascript/clerk) class. |
| Authorization header verification | This refers to the HTTP Authorization request header. Clerk uses this HTTP header instead of the `__client` cookie for secure communication with the FAPI in non-standard web browser environments. For example, in React Native apps, Chrome extensions, and hybrid apps like Electron, the `__client` JWT will be stored in a secure storage provided by the platform and injected into the HTTP header of each FAPI request. |
| Handshake | The client handshake is a mechanism that is used to resolve a request's authentication state from “unknown” to definitively signed in or signed out. Clerk's session management architecture relies on a short-lived session JWT to validate requests, along with a long-lived session that is used to keep the session JWT fresh by interacting with the FAPI. The long-lived session token is stored in an `HttpOnly` cookie associated with the FAPI domain. If a short-lived session JWT is expired on a request to an application's backend, the SDK doesn't know if the session has ended, or if a new short-lived JWT needs to be issued. When an SDK gets into this state, it triggers the handshake. |

## Cookies

Clerk is using cookies in order to keep user sessions alive. It's useful to know about these when debugging issues.

### Development instance cookies

| Cookie Name | Description |
| - | - |
| `__clerk_db_jwt` | The **Development Browser JWT**. Helps Clerk sync the session between the development instance domain, `localhost`, and the Clerk FAPI and Account Portal domain, `https://name.accounts.dev`. |
| `__client_uat` | `uat` stands for **Updated At** and helps Clerk to check if the user session is still valid. It is set by `clerk-js` on the client-side. |
| `__session` | A short-lived session JWT to validate requests in your application or your API. |

### Production instance cookies

| Cookie Name | Description |
| - | - |
| `__client` | This is a long-lived `HttpOnly` cookie that is used to issue short-lived session JWTs. It is set by the Clerk FAPI. |
| `__client_uat` | `uat` stands for **Updated At** and helps Clerk to check if the user session is still valid. It is set by the Clerk FAPI. |
| `__session` | A short-lived session JWT to validate requests in your application or your API. |

Clerk is using other non-persistent cookies (e.g. `__clerk_handshake`) for internal mechanisms but for the sake of creating a new SDK from scratch, you don't need to worry about those.
---
title: SDK types
description: "Learn about the three different types of SDKs: frontend-only,
  backend-only, and fullstack."
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/development/sdk-development/types
sourceFile: /docs/guides/development/sdk-development/types.mdx
---

Clerk categorizes its SDKs into three different types:

* Frontend-only
* Backend-only
* Fullstack

Take a look at your framework and check which type it enables. Then place your SDK into one of these three categories when first creating it. Arguably, creating a fullstack SDK is the most work so feel free to start off with frontend-only/backend-only SDK — you can still make it fullstack at a later point. Also, the framework you’re building the SDK for might evolve in the future, so maybe naturally your SDK will also need to change over time.

| SDK Type | FAPI HTTP client | BAPI HTTP client | Hotloading ClerkJS | `window.Clerk` UI components | Authorization header verification | `__session` cookie verification | Handshake support |
| - | - | - | - | - | - | - | - |
| Frontend-only | ✅ | | ✅ | ✅ | | | |
| Backend-only | | ✅ | | | ✅ | ✅ | |
| Fullstack | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Frontend-only

Frontend-only SDKs are used in frameworks that only support client-side rendering (CSR) or static site generation (SSG) with rehydration. The app is rendered in the browser using JavaScript and this bundle doesn’t contain any authenticated information itself but uses client-side code to fetch the authenticated data.

**Examples:** Vite React, Vue, iOS/Swift, Android/Kotlin

**SDK Examples:** [`@clerk/clerk-react`](https://github.com/clerk/javascript/tree/main/packages/react)

## Backend-only

Backend-only SDKs are used in frameworks to build APIs without directly serving HTML. They provide authenticated data to power your frontend.

**Examples:** Express.js/Hono with a Vite React/Vue frontend

**SDK Examples:** [`@clerk/express`](https://github.com/clerk/javascript/tree/main/packages/express), `@hono/clerk-auth`, [`clerk-sdk-go`](https://github.com/clerk/clerk-sdk-go)

## Fullstack

Fullstack SDKs are used in frameworks that support SSR and subsequently can render HTML from a server with authenticated data.

**Examples:** Next.js, Rails

**SDK Examples:** [`@clerk/nextjs`](https://github.com/clerk/javascript/tree/main/packages/nextjs), [`clerk-sdk-ruby`](https://github.com/clerk/clerk-sdk-ruby)
---
title: Fullstack SDK
description: A reference for implementing a fullstack Clerk SDK
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/development/sdk-development/fullstack
sourceFile: /docs/guides/development/sdk-development/fullstack.mdx
---

A fullstack SDK combines the [frontend-only SDK](/docs/guides/development/sdk-development/frontend-only) and [backend-only SDK](/docs/guides/development/sdk-development/backend-only) into one. A fullstack SDK is necessary for frameworks that support multiple rendering strategies (SSR, SSG, etc.), middleware, data fetching, and more. Examples of such frameworks would be Next.js or Rails.

## Expected features

* User only needs to provide their <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip> and <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip>
* User only needs to adjust one or two files to add Clerk to their app (e.g. adding Clerk to the configuration file of that framework)
* User can use <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Clerk’s components</SDKLink> in their choice of framework (e.g. in a React-based framework you import these components as React components)
* Give users access to [`Client`](/docs/reference/javascript/client){{ target: '_blank' }}, [`Session`](/docs/reference/javascript/session){{ target: '_blank' }}, [`User`](/docs/reference/javascript/user){{ target: '_blank' }}, and [`Organization`](/docs/reference/javascript/organization){{ target: '_blank' }} properties through the framework’s choice of state management
* User should be able to use [ClerkJS options](/docs/reference/javascript/clerk#clerk-options){{ target: '_blank' }}
* Centralized request authentication (e.g. in a middleware or plugin)
* Give access to the instance of [BAPI](/docs/guides/development/sdk-development/terminology) client (so that users can use all methods)
* User should be able to limit access to routes by checking for [Roles and Permissions](/docs/guides/organizations/control-access/roles-and-permissions)

## Optional features

* User should be able to enforce authentication on individual routes (e.g. with a [`requireAuth`](/docs/guides/development/sdk-development/backend-only#create-a-require-auth-helper) helper)
* Use singleton pattern to only create a pre-configured instance of Clerk backend client

## Implementation

See the respective [frontend-only SDK](/docs/guides/development/sdk-development/frontend-only) and [backend-only SDK](/docs/guides/development/sdk-development/backend-only) implementation instructions.

In addition to these instructions, you'll need to go through the following steps to support all required features.

> \[!NOTE]
> If you're looking for a real-world example, have a look at [`@clerk/nextjs`](https://github.com/clerk/javascript/tree/main/packages/nextjs).

<Steps>
  ### Add handshake support

  Inside your Clerk middleware, add checks for the `headers` on the `requestState`. Apply these headers to the `Response` and handle any existing `location` headers (e.g. redirects).

  ```ts {{ filename: 'clerk-middleware.ts', mark: [[9, 20]] }}
  import { clerkClient as defaultClerkClient } from './client.ts'

  const clerkMiddleware = (options) => {
    return async (context, next) => {
      const clerkClient = options.clerkClient || defaultClerkClient

      const requestState = await clerkClient.authenticateRequest(context.req, {
        authorizedParties: ['https://example.com'],
      })

      if (requestState.headers) {
        // This adds observability headers to the res
        requestState.headers.forEach((value, key) => context.res.headers.append(key, value))

        const locationHeader = requestState.headers.get('location')

        if (locationHeader) {
          return context.redirect(locationHeader, 307)
        } else if (requestState.status === 'handshake') {
          throw new Error('Clerk: unexpected handshake without redirect')
        }
      }

      context.set('clerkAuth', requestState.toAuth())
      context.set('clerk', clerkClient)

      await next()
    }
  }
  ```
</Steps>
---
title: Clerk Dashboard overview
description: Learn how to use the Clerk Dashboard to manage your application
  settings, users, and more.
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/dashboard/overview
sourceFile: /docs/guides/dashboard/overview.mdx
---

The Clerk Dashboard is where you create your Clerk application and is the central hub for managing your instance's settings, users, Organizations, and more.

At the top of the Clerk Dashboard, you will see a few notable features:

* The workspace dropdown: Allows you to switch between [workspaces](#workspaces) or create a new one.
* The application dropdown: Allows you to choose which application you want to manage or create a new one.
* The instance dropdown: Allows you to switch between your [development and production instances](#instances).
* The <SDKLink href="/docs/:sdk:/reference/components/user/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserButton /></SDKLink>: Allows you to manage your account and sign out.

We try to make the Clerk Dashboard as intuitive as possible, but if you ever need help or have any feedback, you can always reach out to our [support team](https://clerk.com/support).

## Workspaces

Workspaces are a way to group applications and resources together.

When you create a Clerk account in the Clerk Dashboard, you are automatically added to a workspace called your **Personal workspace**. You can edit the name of this workspace, along with other settings, on the Clerk Dashboard's [**Settings**](https://dashboard.clerk.com/settings) page.

When you visit the Clerk Dashboard, a workspace is always selected/active. The last workspace used will be selected by default. You can switch between workspaces or create a new one by selecting the workspace dropdown in the top-left of the Clerk Dashboard.

Each workspace can have a **team** with multiple members. You can invite team members to a workspace by visiting the [**Team**](https://dashboard.clerk.com/team) page and then selecting **Invite user**. Each team member can have a different [role](#roles-in-a-workspace), which determines their access levels and permissions within the workspace.

### Roles in a workspace

Clerk distinguishes between different roles to help manage team members' access levels and permissions within a workspace. Each role within Clerk is assigned specific permissions that determine what actions a member can perform. When assigning roles to team members, consider the following:

* Which resources does this team member need access to?
* What actions should this team member be able to perform?
* What level of system configuration access is required?

**The available roles are:**

> \[!IMPORTANT]
> Only the **owner** and **viewer** roles are available on the Hobby and Pro plans. For the Business plan, all roles are available.

| Role | Description |
| - | - |
| [**Owner**](#owner) | Full access to all resources, including workspace member management and instance keys. |
| [**Admin**](#admin) | Manage applications, instances, billing, configuration, API keys, and instance keys; can impersonate users. |
| [**Developer**](#developer) | Manage restrictions, view API keys and Billing, and manage configuration and API keys in development instances only; dev-only user impersonation. |
| [**Support**](#support) | Provide user support with read-only access to application configuration; can impersonate users and manage restrictions. |
| [**Viewer**](#viewer) | Read-only access to configuration; least-privileged role for basic Dashboard visibility. |

#### Owner

The **Owner** role is the highest level of authority within a workspace, possessing comprehensive access and control over all settings and resources.

**Key responsibilities**

* Oversee and manage all resources and applications within a workspace
* Modify workspace settings, including billing and member roles
* Access and modify all applications, including their settings, API keys, and domains
* Impersonate users and manage restrictions *(allowlist, blocklist, waitlist)*

**Permissions**

<ComparisonTable>
  <thead>
    <tr>
      <th />

      <th>Read</th>
      <th>Manage</th>
      <th>Create</th>
      <th>Delete</th>
      <th>Impersonation</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td><Tooltip><TooltipTrigger>Global</TooltipTrigger><TooltipContent>A generic feature that controls the top-level permissions of a user</TooltipContent></Tooltip></td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Applications</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Instances</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Configuration</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Billing</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Secrets</td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Restrictions</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Users</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>
    </tr>
  </tbody>
</ComparisonTable>

#### Admin

The **Admin** role handle day-to-day management across applications and instances.

**Key responsibilities**

* Manage applications and instances within a workspace
* Modify workspace settings, including billing and member roles
* Access and modify all applications, including their settings, API keys, and domains, but **cannot delete or transfer applications**
* Impersonate users and manage restrictions *(allowlist, blocklist, waitlist)*

**Permissions**

> \[!IMPORTANT]
> Admins **cannot transfer applications** in addition to the permissions below.

<ComparisonTable>
  <thead>
    <tr>
      <th />

      <th>Read</th>
      <th>Manage</th>
      <th>Create</th>
      <th>Delete</th>
      <th>Impersonation</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td><Tooltip><TooltipTrigger>Global</TooltipTrigger><TooltipContent>A generic feature that controls the top-level permissions of a user</TooltipContent></Tooltip></td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Applications</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Instances</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Configuration</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Billing</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Secrets</td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Restrictions</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Users</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>
    </tr>
  </tbody>
</ComparisonTable>

#### Developer

The **Developer** role focuses on technical configuration and integrations with limited production access.

**Key responsibilities**

* Manage restrictions *(allowlist, blocklist, waitlist)*
* View API keys and billing information
* Manage configuration and API keys in development instances only
* Impersonate users in development instances only

**Permissions**

<ComparisonTable>
  <thead>
    <tr>
      <th />

      <th>Read</th>
      <th>Manage</th>
      <th>Create</th>
      <th>Delete</th>
      <th>Impersonation</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td><Tooltip><TooltipTrigger>Global</TooltipTrigger><TooltipContent>A generic feature that controls the top-level permissions of a user</TooltipContent></Tooltip></td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Applications</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Instances</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Configuration</td>

      <td>
        <CompareYes />
      </td>

      <td><ComparePartial>Dev only</ComparePartial></td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Billing</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Secrets</td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Restrictions</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Users</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td><ComparePartial>Dev only</ComparePartial></td>
    </tr>
  </tbody>
</ComparisonTable>

#### Support

The **Support** role provides tools to assist customers while preventing modifications to sensitive application configurations.

**Key responsibilities**

* Provide direct user support and troubleshooting
* Impersonate users for issue resolution and debugging
* Manage restrictions *(allowlist, blocklist, waitlist)*

**Permissions**

<ComparisonTable>
  <thead>
    <tr>
      <th />

      <th>Read</th>
      <th>Manage</th>
      <th>Create</th>
      <th>Delete</th>
      <th>Impersonation</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td><Tooltip><TooltipTrigger>Global</TooltipTrigger><TooltipContent>A generic feature that controls the top-level permissions of a user</TooltipContent></Tooltip></td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Applications</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Instances</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Configuration</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Billing</td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Secrets</td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Restrictions</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Users</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareYes />
      </td>
    </tr>
  </tbody>
</ComparisonTable>

#### Viewer

The **Viewer** role has read-only access to configuration and workspace-level data.

**Key responsibilities**

* Review configuration settings of applications
* Review workspace-level information and configuration

**Permissions**

<ComparisonTable>
  <thead>
    <tr>
      <th />

      <th>Read</th>
      <th>Manage</th>
      <th>Create</th>
      <th>Delete</th>
      <th>Impersonation</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td><Tooltip><TooltipTrigger>Global</TooltipTrigger><TooltipContent>A generic feature that controls the top-level permissions of a user</TooltipContent></Tooltip></td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Applications</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Instances</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Configuration</td>

      <td>
        <CompareYes />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Billing</td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Secrets</td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Restrictions</td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>

      <td>
        <CompareNotApplicable />
      </td>
    </tr>

    <tr>
      <td>Users</td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>

      <td>
        <CompareNo />
      </td>
    </tr>
  </tbody>
</ComparisonTable>

### Create additional workspaces

1. In the top-left of the [Clerk Dashboard](https://dashboard.clerk.com), select the workspace dropdown.
2. Select **Create workspace**. A modal will open.
3. Complete the form. Workspace slugs are unique across all instances, so common naming conventions might already be in use by another instance.
4. Select **Create workspace**. The newly created workspace will be set the active workspace.

### Invite team members to your workspace

1. In the top-left of the [Clerk Dashboard](https://dashboard.clerk.com), select the workspace dropdown.
2. Select **Manage**. You will be redirected to the Team settings page of the active workspace.
3. Select **Invite user**.
4. In the **Invite user** form, enter the email of the user you want to invite and select the [role](#roles-in-a-workspace) to assign.
5. Select **Invite**.

### Transfer ownership of an application

Transferring an application between two workspaces does not cause disruptions. Your API keys, settings, domains, and other configurations remain unchanged, and your app will continue to function as expected. Only the ownership is updated, so no further action is needed to maintain continuity for existing users.

1. In the top-left of the [Clerk Dashboard](https://dashboard.clerk.com), open the workspace dropdown and select the workspace that contains the application you want to transfer.
2. Locate and select the application to transfer.
3. Navigate to the application's [**Settings**](https://dashboard.clerk.com/~/settings) page.
4. In the **Danger zone** section, select **Transfer ownership**. A modal will open.
5. Complete the form and select **Transfer ownership**. The page will redirect to the **Applications** page and show the transferred application.

#### Transfer to a workspace without billing information

**An application with an existing paid Subscription can only be transferred to a workspace with active billing information**. You can set up billing information on the receiving workspace without being charged.

To set up a payment method without being charged:

1. In the top-left of the [Clerk Dashboard](https://dashboard.clerk.com), select the workspace dropdown.
2. Select the workspace that you want to transfer the application to.
3. Select the workspace dropdown again, and select **Manage**.
4. In the top menu bar, select **Billing**, then select **Upgrade to unlimited members**.
5. Add your billing information. **You will not be charged immediately**. Doing this just ensures billing information is added to the workspace.
6. Once that billing information is added, you will be able to transfer your Clerk app to the receiving workspace.

> \[!NOTE]
> This is a temporary solution for this issue. Clerk is actively working to improve this process.

## Instances

Each Clerk application can have two different instances: `Development` or `Production`. The names are self-explanatory, but you can learn more about the differences between the two in the [dedicated guide](/docs/guides/development/managing-environments).

When you create a new application, it is automatically provisioned with a `Development` instance. You can switch between instances or provision your `Production` instance by selecting the instance dropdown in the top-left of the Clerk Dashboard.
---
title: Sign-up and sign-in options
description: Clerk provides various options for configuring a sign-up and sign-in flow.
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/configure/auth-strategies/sign-up-sign-in-options
sourceFile: /docs/guides/configure/auth-strategies/sign-up-sign-in-options.mdx
---

Clerk provides multiple options for configuring a sign-up and sign-in flow for your application. This guide will walk you through each option.

You can modify your authentication options after your application has been created by navigating to the [Clerk Dashboard](https://dashboard.clerk.com/) and selecting any of the options under **User & authentication** in the left sidenav.

## User & authentication

To configure the options available to users for authentication, navigate to the [**User & authentication**](https://dashboard.clerk.com/~/user-authentication/user-and-authentication) page in the Clerk Dashboard.

The easiest way to allow your users to create and manage their authentication options is to use the prebuilt <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile></SDKLink> component. If you're building a custom user interface using the Clerk API, refer to the [custom flow guides](/docs/guides/development/custom-flows/overview).

### Email

Users can authenticate with their email address using the following options:

* **Email verification code**: Users receive an <Tooltip><TooltipTrigger>OTP</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> to their email address to sign in.
* **Email verification link**: Users receive an email with a link to sign in. As a security measure, email links expire after 10 minutes to prevent the use of compromised or stale links.
  <If sdk="expo">
    > \[!WARNING]
    > Expo does not support email links. You can request this feature on [Clerk's roadmap](https://feedback.clerk.com/).
  </If>
  * **Require the same device and browser**: Email links are required to be verified from the same device and browser on which the sign-up or sign-in was initiated. For example:
    * A user tries to sign in from their desktop browser.
    * They open the email link on their mobile phone to verify their email address.
    * The user's sign-in on the desktop browser **gets an error**, because the link was verified on a different device and browser.

### Phone

> \[!WARNING]
> This feature requires a [paid plan](/pricing){{ target: '_blank' }} for production use, but all features are free to use in development mode so that you can try out what works for you. See the [pricing](/pricing){{ target: '_blank' }} page for more information.

Users can authenticate with their phone number and verify it with an <Tooltip><TooltipTrigger>OTP</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip>.

SMS functionality is restricted to phone numbers from countries enabled on your [SMS allowlist](#sms-allowlist).

### SMS allowlist

SMS functionality, including SMS <Tooltip><TooltipTrigger>OTPs</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip>, is restricted to phone numbers from countries that are enabled on your SMS allowlist. This can be useful for avoiding extraneous SMS fees from countries from which your app is not expected to attract traffic. **By default, only the US and Canada are enabled.**

Every instance starts off with a default set of enabled SMS country tiers. To tailor it to your needs:

1. In the Clerk Dashboard, navigate to the [**SMS**](https://dashboard.clerk.com/~/customization/sms) page.
2. Select the **Settings** tab.
3. Enable or disable countries as needed.

If a country is disabled, then phone numbers starting with the corresponding country calling code:

* Cannot receive <Tooltip><TooltipTrigger>OTPs</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> and a request to receive an OTP will be rejected with an error
* Cannot receive notifications for password or passkey modifications
* Cannot be used upon sign-up
* Cannot be added to an existing user profile

### Username

In this section, you can allow users to set their username. Usernames must be between 4 and 64 characters long and do not allow special characters (^$!.`#+~`), but this can be customized.

> \[!IMPORTANT]
> Usernames only support Latin-based characters. This restriction helps protect against Unicode spoofing and homograph attacks, where characters from non-Latin scripts can be used to impersonate users.

### Password

When **Password** is enabled, users provide a password to sign in.

Disabling **Password** will only affect new users. Existing users will still be able to sign in with their existing password.

### Passkeys

> \[!WARNING]
> This feature requires a [paid plan](/pricing){{ target: '_blank' }} for production use, but all features are free to use in development mode so that you can try out what works for you. See the [pricing](/pricing){{ target: '_blank' }} page for more information.

A passkey is a type of sign-in credential that requires one user action, but uses two authentication factors:

1. A pin number or biometric data
2. A physical device

**Users can only create passkeys after signing up**, so you'll need to enable another authentication strategy for the sign-up process. After signing in, users can create a passkey.

> \[!NOTE]
> When setting up passkeys with Android or Expo, there are a few additional steps to follow:
>
> * <SDKLink href="/docs/reference/android/passkeys" sdks={["android"]}>Set up passkeys for Android</SDKLink>.
> * <SDKLink href="/docs/reference/expo/passkeys" sdks={["expo"]}>Set up passkeys for Expo</SDKLink>.

#### Passkey limitations

* Passkeys are not currently available as an [MFA](#multi-factor-authentication) option.
* Not all devices and browsers are compatible with passkeys. Passkeys are built on WebAuthn technology and you should check [the Browser Compatibility docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#browser_compatibility) for an up-to-date list.
* Passkey related APIs will not work with Expo.
* Your users can have a max of 10 passkeys per account.

#### Domain restrictions for passkeys

Passkeys are tied to the domain they are created on and **cannot be used across different domains**. However, passkeys **do work on subdomains** if they are registered on the root domain. For example:

* Passkeys created on `your-domain.com` **cannot be used** on `your-domain-admin.com` (different domains).
* Passkeys created on `your-domain.com` **can be used** on `accounts.your-domain.com` (subdomain of the same root domain).
* Passkeys created on `staging1.your-domain.com` **cannot be used** on `staging2.your-domain.com` (sibling subdomains) unless the passkey was scoped to `your-domain.com` (i.e. the shared root domain).

**If you're using [satellite domains](/docs/guides/dashboard/dns-domains/satellite-domains)**, in both development and production, passkeys won't be portable between your primary domain and your satellite domains so you should avoid using them.

If you're **not** using satellite domains:

* **In development**, you can either:
  * **The recommended approach**. Use Clerk's <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>components</SDKLink>, [Elements](/docs/guides/customizing-clerk/elements/overview), or <Tooltip><TooltipTrigger>custom flows</TooltipTrigger><TooltipContent>A **custom flow** refers to a user interface built entirely from scratch using the Clerk API. Learn more about [custom flows](/docs/guides/development/custom-flows/overview).</TooltipContent></Tooltip>, instead of the [Account Portal](/docs/guides/account-portal/overview). This ensures the passkey is created and used entirely on your development domain, so passkeys created on `localhost` will only work on `localhost`.
  * Create a passkey directly through the Account Portal instead of your local application to keep it tied to the Account Portal's domain. Passkeys created on your Account Portal (e.g., `your-app.accounts.dev`) will only work on that domain, which can cause issues if you switch between `localhost` and the Account Portal during development. If you choose this approach, ensure all testing happens on the same domain where the passkey was created.

* **In production,** your Account Portal is usually hosted on a subdomain of your main domain (e.g. `accounts.your-domain.com`), enabling passkeys to work seamlessly across your app. However, as stated above, if you use **satellite domains**, passkeys will not work as intended.

### User model

In this section, you can:

* Allow users to set their first and last name.
* Allow users to delete their accounts.

## SSO connections

SSO connections are a way to allow users to authenticate with their existing accounts from other services. For example, if a user already has an account with Google, they can sign in with their Google account instead of creating a new account with your application.

Clerk offers two different types of SSO connections:

* For all users, which are also known as OAuth connections, or social connections. Read more about [OAuth connections](/docs/guides/configure/auth-strategies/social-connections/overview).
* For specific domains and Organizations, which are also known as Enterprise SSO connections. Read more about [Enterprise SSO connections](/docs/guides/configure/auth-strategies/enterprise-connections/overview).

To enable SSO connections, navigate to the [**SSO connections**](https://dashboard.clerk.com/~/user-authentication/sso-connections) page in the Clerk Dashboard.

## Web3 authentication

Clerk provides Web3 authentication with either [Base](/docs/guides/configure/auth-strategies/web3/base), [MetaMask](/docs/guides/configure/auth-strategies/web3/metamask), [Coinbase Wallet](/docs/guides/configure/auth-strategies/web3/coinbase-wallet), or [OKX Wallet](/docs/guides/configure/auth-strategies/web3/okx-wallet). As part of validating the accuracy of the returned Web3 account address, Clerk handles the signing of a message and verifying the signature. Because sign-in with Web3 uses the same abstraction as our other authentication factors, like passwords or email links, other Clerk features like multi-factor authentication and profile enrichment work for Web3 users out-of-the-box.

To enable Web3 authentication, navigate to the [**Web3**](https://dashboard.clerk.com/~/user-authentication/web3) page in the Clerk Dashboard.

## Multi-factor authentication

Clerk supports multi-factor authentication (MFA), also known as two-factor authentication (2FA). If a user enables MFA for their account, they are required to complete a second verification step during sign-in. This enhances security by enforcing two different types of verification. Many websites offer this as an optional step, giving users control over their own security.

MFA is not available on the new application screen, but it can be enabled in the Clerk Dashboard.

1. In the Clerk Dashboard, navigate to the [**Multi-factor**](https://dashboard.clerk.com/~/user-authentication/multi-factor) page.
2. Toggle on the MFA strategies you would like to enable.

The following MFA strategies are currently available:

* **SMS verification code**
* **Authenticator application (also known as TOTP - Time-based One-time Password)**
* **Backup codes**

Enabling MFA allows users of your app to turn it on for their own accounts through their [User Profile](/docs/guides/account-portal/overview#user-profile) page. Enabling MFA does not automatically turn on MFA for all users.

> \[!WARNING]
> If you're using Duo as an authenticator app, please note that Duo generates TOTP codes differently than other authenticator apps. Duo allows a code to be valid for 30 seconds from *the moment it is first displayed*, which may cause frequent `invalid_code` errors if the code is not entered promptly. More information can be found in [Duo's Help Center](https://help.duo.com/s/article/2107).

If you're building a custom user interface instead of using the [Account Portal](/docs/guides/account-portal/overview) or <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink>, you can use [elements](/docs/guides/customizing-clerk/elements/examples/sign-in#multi-factor-authentication-mfa) or [the Clerk API](/docs/guides/development/custom-flows/authentication/email-password-mfa) to build a custom sign-in flow that allows users to sign in with MFA.

### Reset a user's MFA

You can reset a user's MFA by deleting their MFA enrollments. This will remove all of their MFA methods and they will have to enroll in MFA again.

To reset a user's MFA:

1. At the top of the [Clerk Dashboard](https://dashboard.clerk.com/), select **Users**.
2. Select the user from the list.
3. Select the **Reset MFA enrollments** button.

## Restrictions

Clerk provides a set of restriction options designed to provide you with enhanced control over who can gain access to your application. Restrictions can limit sign-ups or prevent accounts with specific identifiers, such as email addresses, phone numbers, and even entire domains, from accessing your application. [Learn more about restrictions](/docs/guides/secure/restricting-access).
---
title: Social connections (OAuth)
description: Learn how to effortlessly add social connections to your
  application using popular social providers like Google, Facebook, GitHub and
  more.
lastUpdated: 2026-02-11T17:16:16.000Z
sdkScoped: "false"
canonical: /docs/guides/configure/auth-strategies/social-connections/overview
sourceFile: /docs/guides/configure/auth-strategies/social-connections/overview.mdx
---

Social connections, also known as OAuth connections in Clerk, allow users to gain access to your application by using their existing credentials from an Identity Provider (IdP), like Google or Microsoft. For example, if you enable Google as a social provider, then when a user wants to sign in to your application, they can select Google and use their Google account to sign in.

> \[!NOTE]
> When using social connections, the sign-up and sign-in flows are equivalent. If a user doesn't have an account and tries to sign in, an account will be made for them, and vice versa.

The easiest way to add social connections to your Clerk app is by using <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink>. If prebuilt components don't meet your specific needs or if you require more control over the logic, you can [rebuild the existing Clerk flows using the Clerk API](/docs/guides/development/custom-flows/authentication/oauth-connections).

## Before you start

* You need to create a Clerk application in the [Clerk Dashboard](https://dashboard.clerk.com/). For more information, check out the [setup guide](/docs/getting-started/quickstart/setup-clerk).
* You need to install the correct SDK for your application. For more information, see the [quickstart guides](/docs/getting-started/quickstart/overview).

## Enable a social connection

### Development instances

For **development** instances, Clerk uses **pre-configured shared** OAuth credentials and redirect URIs to make the development flow as smooth as possible. This means that you can enable most social providers **without additional configuration**.

To enable a social connection:

1. In the Clerk Dashboard, navigate to the [**SSO connections**](https://dashboard.clerk.com/~/user-authentication/sso-connections) page.
2. Select the **Add connection** button, and select **For all users**.
3. Select the provider you want to use.

### Production instances

For **production** instances, you will need to configure the provider with custom OAuth credentials. See the social provider's [dedicated guide](/docs/guides/configure/auth-strategies/social-connections/overview) for more information.

## Configure additional OAuth scopes

Each OAuth provider requires a specific set of scopes that are necessary for proper authentication with Clerk. These essential scopes are pre-configured and automatically included by Clerk. They typically include permissions for basic profile information and email access, which are fundamental for user authentication and account creation.

In addition to the core scopes, you can specify additional scopes supported by the provider. These scopes can be used to access additional user data from the provider.

To add additional OAuth scopes, when you are [enabling a new social connection](#enable-a-social-connection), enable **Use custom credentials**. The **Scopes** field will appear.

## Request additional OAuth scopes after sign-up

Clerk allows you to request additional OAuth scopes even after a user has signed up.

Pass the <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>additionalOAuthScopes</SDKLink> prop to the <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile/></SDKLink> or <SDKLink href="/docs/:sdk:/reference/components/user/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserButton /></SDKLink> component, with any additional OAuth scope you would like per provider. The user will be prompted to reconnect their account on their user profile page.

Use the following tabs to see how to add additional OAuth scopes to the `<UserProfile/>` and `<UserButton/>` components.

<CodeBlockTabs options={["<UserProfile />", "<UserButton />"]}>
  ```tsx {{ filename: 'app/page.tsx' }}
  <UserProfile
    additionalOAuthScopes={{
      google: ['foo', 'bar'],
      github: ['qux'],
    }}
  />
  ```

  ```tsx {{ filename: 'app/page.tsx' }}
  <UserButton
    userProfileProps={{
      additionalOAuthScopes: {
        google: ['foo', 'bar'],
        github: ['qux'],
      },
    }}
  />
  ```
</CodeBlockTabs>

## Get an OAuth access token for a social provider

You can use a social provider's OAuth <Tooltip><TooltipTrigger>access token</TooltipTrigger><TooltipContent>An **access token** is a credential used to access protected resources in an API, typically issued by an authorization server and used in <Tooltip><TooltipTrigger>OAuth</TooltipTrigger><TooltipContent>An **OAuth access token** is a credential issued by an authorization server that grants the <Tooltip><TooltipTrigger>client</TooltipTrigger><TooltipContent>The **client** is the application that wants to access a user's data from your application (the **resource service**). The client needs to be configured to obtain an OAuth access token from Clerk.</TooltipContent></Tooltip> access to protected resources on behalf of a user. Access tokens represent the authorization granted to the client and are typically short-lived for security purposes. Learn more about [how OAuth works](/docs/guides/configure/auth-strategies/oauth/overview).</TooltipContent></Tooltip> and OpenID Connect protocols.</TooltipContent></Tooltip> to access user data from that provider in addition to their data from Clerk.

Use the [`getUserOauthAccessToken()`](/docs/reference/backend/user/get-user-oauth-access-token) method to get the user's OAuth access token. **This method must be used in a server environment, and cannot be run on the client.**

> \[!NOTE]
> Clerk does not automatically keep OAuth access tokens fresh behind the scenes. When you request an access token using [the relevant backend API endpoint](/docs/reference/backend-api/tag/oauth-access-tokens/post/oauth_applications/access_tokens/verify){{ target: '_blank' }}, Clerk will attempt to obtain a fresh access token as well as a new refresh token. However, this process occurs only when you initiate the request; Clerk does not proactively refresh tokens on your behalf.

The following example demonstrates how to retrieve the OAuth access token for a user and use it to fetch user data from the Notion API. It assumes:

* You have already [enabled the Notion social connection in the Clerk Dashboard](/docs/guides/configure/auth-strategies/social-connections/notion).
* The user has already connected their Notion account to your application.
* The user has the correct permissions to access the Notion API.

**If your SDK isn't listed, you can use the comments in the example to help you adapt it to your SDK.**

<Tabs items={["Next.js", "Astro", "Express", "JS Backend SDK", "React Router", "TanStack React Start"]}>
  <Tab>
    ```tsx {{ filename: 'app/api/notion/route.tsx' }}
    import { auth, clerkClient } from '@clerk/nextjs/server'
    import { NextResponse } from 'next/server'

    export async function GET() {
      // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
      // Accessing the `Auth` object differs depending on the SDK you're using
      // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
      const { isAuthenticated, userId } = await auth()

      // Protect the route from unauthenticated users
      if (!isAuthenticated) {
        return NextResponse.json({ message: 'User not found' })
      }

      const provider = 'notion'

      // Initialize the JS Backend SDK
      // This varies depending on the SDK you're using
      // https://clerk.com/docs/js-backend/getting-started/quickstart
      const client = await clerkClient()

      // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
      const clerkResponse = await client.users.getUserOauthAccessToken(userId, provider)
      const accessToken = clerkResponse.data[0].token || ''
      if (!accessToken) {
        return NextResponse.json({ message: 'Access token not found' }, { status: 401 })
      }

      // Fetch the user data from the Notion API
      // This endpoint fetches a list of users
      // https://developers.notion.com/reference/get-users
      const notionUrl = 'https://api.notion.com/v1/users'

      const notionResponse = await fetch(notionUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      })

      // Handle the response from the Notion API
      const notionData = await notionResponse.json()

      return NextResponse.json({ message: notionData })
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'src/api/notion.ts' }}
    import { clerkClient } from '@clerk/astro/server'
    import type { APIRoute } from 'astro'

    export const GET: APIRoute = async (context) => {
      // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
      // Accessing the `Auth` object differs depending on the SDK you're using
      // https://clerk.com/docs/references/backend/types/auth-object#how-to-access-the-auth-object
      const { isAuthenticated, userId } = context.locals.auth()

      // Protect the route from unauthenticated users
      if (!isAuthenticated) {
        return new Response('Unauthorized', { status: 401 })
      }

      const provider = 'notion'

      // Initialize the JS Backend SDK
      // This varies depending on the SDK you're using
      // https://clerk.com/docs/js-backend/getting-started/quickstart
      // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
      const clerkResponse = await clerkClient(context).users.getUserOauthAccessToken(userId, provider)
      const accessToken = clerkResponse.data[0].token || ''
      if (!accessToken) {
        return new Response('Access token not found', { status: 401 })
      }

      // Fetch the user data from the Notion API
      // This endpoint fetches a list of users
      // https://developers.notion.com/reference/get-users
      const notionUrl = 'https://api.notion.com/v1/users'

      const notionResponse = await fetch(notionUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      })

      // Handle the response from the Notion API
      const notionData = await notionResponse.json()

      // Return the Notion data
      return new Response(JSON.stringify({ notionData }))
    }
    ```
  </Tab>

  <Tab>
    ```js {{ filename: 'notion.js' }}
    import { createClerkClient, getAuth } from '@clerk/express'
    import express from 'express'

    const app = express()
    // Initialize the JS Backend SDK
    // This varies depending on the SDK you're using
    // https://clerk.com/docs/js-backend/getting-started/quickstart
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

    app.get('/user', async (req, res) => {
      // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
      // Accessing the `Auth` object differs depending on the SDK you're using
      // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
      const { isAuthenticated, userId } = getAuth(req)

      // Protect the route from unauthenticated users
      if (!isAuthenticated) {
        res.status(401).json({ error: 'User not authenticated' })
      }

      const provider = 'notion'

      // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
      const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, provider)
      const accessToken = clerkResponse.data[0].token || ''
      if (!accessToken) {
        res.status(401).json({ error: 'Access token not found' })
      }

      // Fetch the user data from the Notion API
      // This endpoint fetches a list of users
      // https://developers.notion.com/reference/get-users
      const notionUrl = 'https://api.notion.com/v1/users'

      const notionResponse = await fetch(notionUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      })

      // Handle the response from the Notion API
      const notionData = await notionResponse.json()

      // Return the Notion data
      res.json(notionData)
    })
    ```
  </Tab>

  <Tab>
    ```js
    import { createClerkClient } from '@clerk/backend'

    // Initialize the JS Backend SDK
    // This varies depending on the SDK you're using
    // https://clerk.com/docs/js-backend/getting-started/quickstart
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

    async function getNotionData(request) {
      // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
      // Accessing the `Auth` object differs depending on the SDK you're using
      // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
      const { isAuthenticated, userId } = request.auth

      // Protect the route from unauthenticated users
      if (!isAuthenticated) {
        return null
      }

      // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
      const provider = 'notion'
      const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, provider)
      const accessToken = clerkResponse.data[0].token || ''
      if (!accessToken) {
        return null
      }

      // Fetch the user data from the Notion API
      // This endpoint fetches a list of users
      // https://developers.notion.com/reference/get-users
      const notionUrl = 'https://api.notion.com/v1/users'

      const notionResponse = await fetch(notionUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      })

      // Handle the response from the Notion API
      const notionData = await notionResponse.json()

      // Return the Notion data
      return notionData
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/routes/notion.tsx' }}
    import { getAuth } from '@clerk/react-router/ssr.server'
    import { createClerkClient } from '@clerk/react-router/api.server'
    import type { Route } from './+types/notion'

    // Initialize the JS Backend SDK
    // This varies depending on the SDK you're using
    // https://clerk.com/docs/js-backend/getting-started/quickstart
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

    export async function loader(args: Route.LoaderArgs) {
      // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
      // Accessing the `Auth` object differs depending on the SDK you're using
      // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
      const { isAuthenticated, userId } = await getAuth(args)

      // Protect the route from unauthenticated users
      if (!isAuthenticated) {
        return new Response('User not authenticated', {
          status: 404,
        })
      }

      const provider = 'notion'

      // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
      const clerkResponse = await clerkClient.users.getUserOauthAccessToken(userId, provider)
      const accessToken = clerkResponse.data[0].token || ''
      if (!accessToken) {
        return new Response('Access token not found', {
          status: 401,
        })
      }

      // Fetch the user data from the Notion API
      // This endpoint fetches a list of users
      // https://developers.notion.com/reference/get-users
      const notionUrl = 'https://api.notion.com/v1/users'

      const notionResponse = await fetch(notionUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      })

      // Handle the response from the Notion API
      const notionData = await notionResponse.json()

      // Return the Notion data
      return json({ notionData })
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/routes/api/notion.tsx' }}
    import { json } from '@tanstack/react-start'
    import { createFileRoute } from '@tanstack/react-router'
    import { auth, clerkClient } from '@clerk/tanstack-react-start/server'

    export const ServerRoute = createFileRoute('/api/notion')({
      server: {
        handlers: {
          GET: async () => {
            // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
            // Accessing the `Auth` object differs depending on the SDK you're using
            // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
            const { isAuthenticated, userId } = await auth()

            // Protect the route from unauthenticated users
            if (!isAuthenticated) {
              return new Response('User not authenticated', {
                status: 404,
              })
            }

            const provider = 'notion'

            // Initialize the JS Backend SDK
            // This varies depending on the SDK you're using
            // https://clerk.com/docs/js-backend/getting-started/quickstart
            // Use the `getUserOauthAccessToken()` method to get the user's OAuth access token
            const clerkResponse = await clerkClient().users.getUserOauthAccessToken(userId, provider)
            const accessToken = clerkResponse.data[0].token || ''
            if (!accessToken) {
              return new Response('Access token not found', {
                status: 401,
              })
            }

            // Fetch the user data from the Notion API
            // This endpoint fetches a list of users
            // https://developers.notion.com/reference/get-users
            const notionUrl = 'https://api.notion.com/v1/users'

            const notionResponse = await fetch(notionUrl, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28',
              },
            })

            // Handle the response from the Notion API
            const notionData = await notionResponse.json()

            return json(notionData)
          },
        },
      },
    })
    ```
  </Tab>
</Tabs>

## Add a social connection after sign-up

For each social provider, you can disable the option to sign up and sign in to your application using the provider. This is especially useful for users that want to connect their OAuth account *after* authentication.

For example, say your application wants to read a user's GitHub repository data but doesn't want to allow the user to authenticate with their GitHub account. The user can sign up with their email and password, or whatever authentication method you choose, and then afterwards, connect their GitHub account to your application through their user profile. The easiest way to enable this for your users is by using the <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component. If you prefer to build a custom user interface, see how to [build a social connection flow using the Clerk API](/docs/guides/development/custom-flows/authentication/oauth-connections).

To configure the option for users to sign up and sign in with a social provider:

1. In the Clerk Dashboard, navigate to the [**SSO connections**](https://dashboard.clerk.com/~/user-authentication/sso-connections) page.
2. Select the social provider you want to configure.
3. Enable or disable **Enable for sign-up and sign-in**.
4. Save the changes.

## Connecting to social providers while signed in

When signed in, a user can connect to further social providers. There is no need to perform another sign-up.

When using the [Account Portal](/docs/guides/account-portal/overview) pages, users can see which providers they have already connected to and which ones they can still connect to on their [user profile page](/docs/guides/account-portal/overview#user-profile).

When using the <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink>, you can use the <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile/></SDKLink> component to allow users to connect to further social providers.

## OAuth for native applications

Currently, the prebuilt components are not supported in native applications, but you can use the Clerk API to [build a custom flow for authenticating with social connections](/docs/guides/development/custom-flows/authentication/oauth-connections).

Clerk ensures that security critical nonces are passed only to allowlisted URLs when the SSO flow is completed in native browsers or webviews. For maximum security in your **production** instances, you need to allowlist your custom redirect URLs via the [Clerk Dashboard](https://dashboard.clerk.com/) or the [Clerk Backend API](/docs/reference/backend/redirect-urls/create-redirect-url).

To allowlist a redirect URL via the Clerk Dashboard:

1. In the Clerk Dashboard, navigate to the [**Native applications**](https://dashboard.clerk.com/~/native-applications) page.
2. Scroll down to the **Allowlist for mobile SSO redirect** section and add your redirect URLs.

> \[!NOTE]
> By default, Clerk uses `{bundleIdentifier}://callback` as the redirect URL.

## OAuth for Apple native applications

You can use [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/) to offer a native authentication experience in your iOS, watchOS, macOS or tvOS apps.

Instead of the typical OAuth flow that performs redirects in a browser context, you can utilize Apple's native authorization and provide the openID token and grant code to Clerk. Clerk ensures that the user will be verified in a secure and reliable way with the information that Apple has provided about the user.

For additional information on how to configure Apple as a social provider for your Clerk instance, see the [dedicated guide](/docs/guides/configure/auth-strategies/social-connections/apple).

## Supported social providers

Clerk provides a wide range of social providers to ease your user's sign-up and sign-in processes. Select a provider to learn how to configure it for your Clerk app.

<Cards>
  * [Apple](/docs/guides/configure/auth-strategies/social-connections/apple)
  * Add Apple as an authentication provider for your Clerk app.
  * ![Apple logo](/docs/images/logos/auth_providers/apple.svg){{ dark: '/docs/images/logos/auth_providers/apple-dark.svg' }}

  ***

  * [Atlassian](/docs/guides/configure/auth-strategies/social-connections/atlassian)
  * Add Atlassian as an authentication provider for your Clerk app.
  * ![Atlassian logo](/docs/images/logos/auth_providers/atlassian.svg)

  ***

  * [Bitbucket](/docs/guides/configure/auth-strategies/social-connections/bitbucket)
  * Add Bitbucket as an authentication provider for your Clerk app.
  * ![Bitbucket logo](/docs/images/logos/auth_providers/bitbucket.svg)

  ***

  * [Box](/docs/guides/configure/auth-strategies/social-connections/box)
  * Add Box as an authentication provider for your Clerk app.
  * ![Box logo](/docs/images/logos/auth_providers/box.svg)

  ***

  * [Coinbase](/docs/guides/configure/auth-strategies/social-connections/coinbase)
  * Add Coinbase as an authentication provider for your Clerk app.
  * ![Coinbase logo](/docs/images/logos/auth_providers/coinbase.svg)

  ***

  * [Discord](/docs/guides/configure/auth-strategies/social-connections/discord)
  * Add Discord as an authentication provider for your Clerk app.
  * ![Discord logo](/docs/images/logos/auth_providers/discord.svg){{ dark: '/docs/images/logos/auth_providers/discord-dark.svg' }}

  ***

  * [Dropbox](/docs/guides/configure/auth-strategies/social-connections/dropbox)
  * Add Dropbox as an authentication provider for your Clerk app.
  * ![Dropbox logo](/docs/images/logos/auth_providers/dropbox.svg)

  ***

  * [Facebook](/docs/guides/configure/auth-strategies/social-connections/facebook)
  * Add Facebook as an authentication provider for your Clerk app.
  * ![Facebook logo](/docs/images/logos/auth_providers/facebook.svg)

  ***

  * [GitHub](/docs/guides/configure/auth-strategies/social-connections/github)
  * Add GitHub as an authentication provider for your Clerk app.
  * ![GitHub logo](/docs/images/logos/auth_providers/github.svg){{ dark: '/docs/images/logos/auth_providers/github-dark.svg' }}

  ***

  * [GitLab](/docs/guides/configure/auth-strategies/social-connections/gitlab)
  * Add GitLab as an authentication provider for your Clerk app.
  * ![GitLab logo](/docs/images/logos/auth_providers/gitlab.svg)

  ***

  * [Google](/docs/guides/configure/auth-strategies/social-connections/google)
  * Add Google as an authentication provider for your Clerk app.
  * ![Google logo](/docs/images/logos/auth_providers/google.svg)

  ***

  * [HubSpot](/docs/guides/configure/auth-strategies/social-connections/hubspot)
  * Add HubSpot as an authentication provider for your Clerk app.
  * ![HubSpot logo](/docs/images/logos/auth_providers/hubspot.svg)

  ***

  * [Hugging Face](/docs/guides/configure/auth-strategies/social-connections/hugging-face)
  * Add Hugging Face as an authentication provider for your Clerk app.
  * ![Hugging Face logo](/docs/images/logos/auth_providers/huggingface.svg)

  ***

  * [LINE](/docs/guides/configure/auth-strategies/social-connections/line)
  * Add LINE as an authentication provider for your Clerk app.
  * ![LINE logo](/docs/images/logos/auth_providers/line.svg)

  ***

  * [Linear](/docs/guides/configure/auth-strategies/social-connections/linear)
  * Add Linear as an authentication provider for your Clerk app.
  * ![Linear logo](/docs/images/logos/auth_providers/linear.svg)

  ***

  * [LinkedIn](/docs/guides/configure/auth-strategies/social-connections/linkedin-oidc)
  * Add LinkedIn as an authentication provider for your Clerk app.
  * ![LinkedIn logo](/docs/images/logos/auth_providers/linkedin.svg)

  ***

  * [Microsoft](/docs/guides/configure/auth-strategies/social-connections/microsoft)
  * Add Microsoft as an authentication provider for your Clerk app.
  * ![Microsoft logo](/docs/images/logos/auth_providers/microsoft.svg)

  ***

  * [Notion](/docs/guides/configure/auth-strategies/social-connections/notion)
  * Add Notion as an authentication provider for your Clerk app.
  * ![Notion logo](/docs/images/logos/auth_providers/notion.svg)

  ***

  * [Slack](/docs/guides/configure/auth-strategies/social-connections/slack)
  * Add Slack as an authentication provider for your Clerk app.
  * ![Slack logo](/docs/images/logos/auth_providers/slack.svg)

  ***

  * [Spotify](/docs/guides/configure/auth-strategies/social-connections/spotify)
  * Add Spotify as an authentication provider for your Clerk app.
  * ![Spotify logo](/docs/images/logos/auth_providers/spotify.svg)

  ***

  * [TikTok](/docs/guides/configure/auth-strategies/social-connections/tiktok)
  * Add TikTok as an authentication provider for your Clerk app.
  * ![TikTok logo](/docs/images/logos/auth_providers/tiktok.svg)

  ***

  * [Twitch](/docs/guides/configure/auth-strategies/social-connections/twitch)
  * Add Twitch as an authentication provider for your Clerk app.
  * ![Twitch logo](/docs/images/logos/auth_providers/twitch.svg)

  ***

  * [Vercel](/docs/guides/configure/auth-strategies/social-connections/vercel)
  * Add Vercel as an authentication provider for your Clerk app.
  * ![Vercel logo](/docs/images/logos/auth_providers/vercel.svg){{ dark: '/docs/images/logos/auth_providers/vercel-dark.svg' }}

  ***

  * [X/Twitter v2](/docs/guides/configure/auth-strategies/social-connections/x-twitter)
  * Add X (Twitter v2) as an authentication provider for your Clerk app.
  * ![X/Twitter logo](/docs/images/logos/auth_providers/x-twitter.svg){{ dark: '/docs/images/logos/auth_providers/x-twitter-dark.svg' }}

  ***

  * [Xero](/docs/guides/configure/auth-strategies/social-connections/xero)
  * Add Xero as an authentication provider for your Clerk app.
  * ![Xero logo](/docs/images/logos/auth_providers/xero.svg)
</Cards>

Don't see the provider you're looking for? You can [configure a custom OIDC-compatible provider](/docs/guides/configure/auth-strategies/social-connections/custom-provider) or [request a new one](https://feedback.clerk.com/roadmap/f9045ac8-0c8e-4f30-b84f-8d551b0767b9?_gl=1*1ywoqdy*_gcl_au*OTUwODgxMjg2LjE3MTI1OTEwNzMuMTczNjk0NTcxMC4xNzE1MTk4MTEyLjE3MTUxOTgxMTI.).
---
title: Build your own sign-in-or-up page for your Next.js app with Clerk
description: Learn how to add a custom sign-in-or-up page to your Next.js app
  with Clerk's prebuilt components.
sdk: nextjs, react-router, remix, tanstack-react-start
sdkScoped: "true"
canonical: /docs/:sdk:/guides/development/custom-sign-in-or-up-page
lastUpdated: 2026-02-11T16:09:04.000Z
availableSdks: nextjs,react-router,remix,tanstack-react-start
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/development/custom-sign-in-or-up-page.mdx
---

This guide shows you how to use the <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink> component to build a custom page that **allows users to sign in or sign up within a single flow**.

To set up separate sign-in and sign-up pages, follow this guide, and then follow the <SDKLink href="/docs/nextjs/guides/development/custom-sign-up-page" sdks={["nextjs","react-router","remix","tanstack-react-start"]}>custom sign-up page guide</SDKLink>.

> \[!NOTE]
> Just getting started with Clerk and Next.js? See the <SDKLink href="/docs/nextjs/getting-started/quickstart" sdks={["nextjs","react","js-frontend","chrome-extension","expo","android","ios","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>quickstart tutorial</SDKLink>!

<Steps>
  ## Build a sign-in-or-up page

  The following example demonstrates how to render the <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink> component on a dedicated page using the [Next.js optional catch-all route](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments).

  ```tsx {{ filename: 'app/sign-in/[[...sign-in]]/page.tsx' }}
  import { SignIn } from '@clerk/nextjs'

  export default function Page() {
    return <SignIn />
  }
  ```

  ## Make the sign-in-or-up route public

  By default, `clerkMiddleware()` makes all routes public. **This step is specifically for applications that have configured `clerkMiddleware()` to make <SDKLink href="/docs/reference/nextjs/clerk-middleware#protect-all-routes" sdks={["nextjs"]}>all routes protected</SDKLink>.** If you have not configured `clerkMiddleware()` to protect all routes, you can skip this step.

    <If sdk="nextjs">
      > \[!IMPORTANT]
      >
      > If you're using Next.js ≤15, name your file `middleware.ts` instead of `proxy.ts`. The code itself remains the same; only the filename changes.
    </If>

  To make the sign-in route public:

  * Navigate to your `proxy.ts` file.
  * Create a new <SDKLink href="/docs/reference/nextjs/clerk-middleware#create-route-matcher" sdks={["nextjs"]}>route matcher</SDKLink> that matches the sign-in route, or you can add it to your existing route matcher that is making routes public.
  * Create a check to see if the user's current route is a public route. If it is not a public route, use <SDKLink href="/docs/reference/nextjs/app-router/auth#auth-protect" sdks={["nextjs"]} code={true}>auth.protect()</SDKLink> to protect the route.

  ```tsx {{ filename: 'proxy.ts' }}
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

  const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

  export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  })

  export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  ```

  ## Update your environment variables

  * Set the `CLERK_SIGN_IN_URL` environment variable to tell Clerk where the `<SignIn />` component is being hosted.
  * Set `CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` as a fallback URL incase users visit the `/sign-in` route directly.
  * Set `CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` as a fallback URL incase users select the 'Don't have an account? Sign up' link at the bottom of the component.

  Learn more about these environment variables and how to customize Clerk's redirect behavior in the [dedicated guide](/docs/guides/development/customize-redirect-urls).

  ```env {{ filename: '.env' }}
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
  ```

  ## Visit your new page

  Run your project with the following command:

  ```npm
  npm run dev
  ```

  Visit your new custom page locally at [localhost:3000/sign-in](http://localhost:3000/sign-in).
</Steps>

## Next steps

Learn more about Clerk components, how to use them to create custom pages, and how to use Clerk's client-side helpers using the following guides.

<Cards>
  * [Create a custom sign-up page](/docs/nextjs/guides/development/custom-sign-up-page)
  * Learn how to add a custom sign-up page to your Next.js app with Clerk components.

  ***

  * [Protect content and read user data](/docs/nextjs/guides/users/reading)
  * Learn how to use Clerk's hooks and helpers to protect content and read user data in your Next.js app.

  ***

  * [Client-side helpers](/docs/reference/nextjs/overview#client-side-helpers)
  * Learn more about Clerk's client-side helpers and how to use them.

  ***

  * [Prebuilt components](/docs/reference/components/overview)
  * Learn how to quickly add authentication to your app using Clerk's suite of components.

  ***

  * [Clerk Next.js SDK Reference](/docs/reference/nextjs/overview)
  * Learn about the Clerk Next.js SDK and how to integrate it into your app.
</Cards>
