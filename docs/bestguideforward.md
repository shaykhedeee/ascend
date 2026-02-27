---
title: Build a custom checkout flow with a new payment method
description: Learn how to use the Clerk API to build a custom checkout flow that
  allows users to add a new payment method during checkout.
sdk: nextjs, react
sdkScoped: "true"
canonical: /docs/:sdk:/guides/development/custom-flows/billing/checkout-new-payment-method
lastUpdated: 2026-02-13T18:28:41.000Z
availableSdks: nextjs,react
notAvailableSdks: js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/development/custom-flows/billing/checkout-new-payment-method.mdx
---

> \[!WARNING]
> This guide is for users who want to build a <Tooltip><TooltipTrigger>custom flow</TooltipTrigger><TooltipContent>A **custom flow** refers to a user interface built entirely from scratch using the Clerk API. Learn more about [custom flows](/docs/guides/development/custom-flows/overview).</TooltipContent></Tooltip>. To use a *prebuilt* UI, use the [Account Portal pages](/docs/guides/account-portal/overview) or <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink>.

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

This guide will walk you through how to build a custom user interface for a checkout flow that allows users to **add a new payment method during checkout**.

See the dedicated guides for other custom payment flows:

* <SDKLink href="/docs/:sdk:/guides/development/custom-flows/billing/checkout-existing-payment-method" sdks={["nextjs","react"]}>Checkout with an **existing payment method**</SDKLink>
* <SDKLink href="/docs/:sdk:/guides/development/custom-flows/billing/add-new-payment-method" sdks={["nextjs","react"]}>Add a new payment method **outside of a checkout flow**</SDKLink>

<Steps>
  ## Enable Billing Features

  To use Billing Features, you first need to ensure they are enabled for your application. Follow the [Billing documentation](/docs/guides/billing/overview) to enable them and setup your Plans.

  ## Checkout flow

  To create a checkout session with a new payment card, you must:

  1. Set up the checkout provider with Plan details.
  2. Initialize the checkout session when the user is ready.
  3. Render the payment form for card collection.
  4. Confirm the payment with the collected payment method.
  5. Complete the checkout process and redirect the user.

  The following example:

  1. Uses the <SDKLink href="/docs/:sdk:/reference/hooks/use-checkout" sdks={["nextjs","react"]} code={true}>useCheckout()</SDKLink> hook to get to initiate and manage the checkout session.
  2. Uses the <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-element" sdks={["nextjs","react"]} code={true}>usePaymentElement()</SDKLink> hook to control the payment element, which is rendered by `<PaymentElement />`.
  3. Assumes that you have already have a valid `planId`, which you can acquire in many ways.
     * [Copy from the Clerk Dashboard](https://dashboard.clerk.com/~/billing/plans?tab=user).
     * Use the [Clerk Backend API](/docs/reference/backend-api/tag/commerce/get/commerce/plans#tag/commerce/get/commerce/plans){{ target: '_blank' }}.
     * Use the new <SDKLink href="/docs/:sdk:/reference/hooks/use-plans" sdks={["nextjs","react"]} code={true}>usePlans()</SDKLink> hook to get the Plan details.

  **This example is written for Next.js App Router but can be adapted for any React-based framework, such as React Router or Tanstack React Start.**

  ```tsx {{ filename: 'app/checkout/page.tsx', collapsible: true }}
  'use client'

  import * as React from 'react'
  import { SignedIn, ClerkLoaded } from '@clerk/nextjs'
  import {
    CheckoutProvider,
    useCheckout,
    PaymentElementProvider,
    PaymentElement,
    usePaymentElement,
  } from '@clerk/nextjs/experimental'
  import { useRouter } from 'next/navigation'

  export default function CheckoutPage() {
    return (
      <CheckoutProvider for="user" planId="cplan_xxx" planPeriod="month">
        <ClerkLoaded>
          <SignedIn>
            <CustomCheckout />
          </SignedIn>
        </ClerkLoaded>
      </CheckoutProvider>
    )
  }

  function CustomCheckout() {
    const { checkout } = useCheckout()
    const { status } = checkout

    if (status === 'needs_initialization') {
      return <CheckoutInitialization />
    }

    return (
      <div className="checkout-container">
        <CheckoutSummary />

        <PaymentElementProvider checkout={checkout}>
          <PaymentSection />
        </PaymentElementProvider>
      </div>
    )
  }

  function CheckoutInitialization() {
    const { checkout } = useCheckout()
    const { start, status, fetchStatus } = checkout

    if (status !== 'needs_initialization') {
      return null
    }

    return (
      <button onClick={start} disabled={fetchStatus === 'fetching'} className="start-checkout-button">
        {fetchStatus === 'fetching' ? 'Initializing...' : 'Start Checkout'}
      </button>
    )
  }

  function PaymentSection() {
    const { checkout } = useCheckout()
    const { isConfirming, confirm, finalize, error } = checkout

    const { isFormReady, submit } = usePaymentElement()
    const [isProcessing, setIsProcessing] = React.useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!isFormReady || isProcessing) return
      setIsProcessing(true)

      try {
        // Submit payment form to get payment method
        const { data, error } = await submit()
        // Usually a validation error from stripe that you can ignore
        if (error) {
          return
        }
        // Confirm checkout with payment method
        await confirm(data)
        // Complete checkout and redirect
        await finalize({
          navigate: () => router.push('/dashboard'),
        })
      } catch (error) {
        console.error('Payment failed:', error)
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement fallback={<div>Loading payment element...</div>} />

        {error && <div>{error.message}</div>}

        <button type="submit" disabled={!isFormReady || isProcessing || isConfirming}>
          {isProcessing || isConfirming ? 'Processing...' : 'Complete Purchase'}
        </button>
      </form>
    )
  }

  function CheckoutSummary() {
    const { checkout } = useCheckout()
    const { plan, totals } = checkout

    if (!plan) {
      return null
    }

    return (
      <div>
        <h2>Order Summary</h2>
        <span>{plan.name}</span>
        <span>
          {totals.totalDueNow.currencySymbol} {totals.totalDueNow.amountFormatted}
        </span>
      </div>
    )
  }
  ```
</Steps>

---
title: Clerk Billing for B2C SaaS
description: Clerk Billing is a feature that allows you to create and manage
  Plans and Features for your application.
sdk: nextjs, react, expo, react-router, astro, tanstack-react-start, remix,
  nuxt, vue, js-frontend, expressjs, fastify, js-backend
sdkScoped: "true"
canonical: /docs/:sdk:/guides/billing/for-b2c
lastUpdated: 2026-02-11T17:16:16.000Z
availableSdks: nextjs,react,expo,react-router,astro,tanstack-react-start,remix,nuxt,vue,js-frontend,expressjs,fastify,js-backend
notAvailableSdks: chrome-extension,android,ios,go,ruby
activeSdk: nextjs
sourceFile: /docs/guides/billing/for-b2c.mdx
---

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

Clerk Billing for B2C SaaS allows you to create Plans and manage Subscriptions **for individual users** in your application. If you'd like to charge companies or organizations, see <SDKLink href="/docs/:sdk:/guides/billing/for-b2b" sdks={["nextjs","react","expo","react-router","astro","tanstack-react-start","remix","nuxt","vue","js-frontend","expressjs","fastify","js-backend"]}>Billing for B2B SaaS</SDKLink>. You can also combine both B2C and B2B Billing in the same application.

## Enable Billing

To enable Billing for your application, navigate to the [**Billing Settings**](https://dashboard.clerk.com/~/billing/settings) page in the Clerk Dashboard. This page will guide you through enabling Billing for your application.

Clerk Billing costs the same as using Stripe Billing directly, just 0.7% per transaction, plus transaction fees which are paid directly to Stripe. Clerk Billing is **not** the same as Stripe Billing. Plans and pricing are managed directly through the Clerk Dashboard and won't sync with your existing Stripe products or plans. Clerk uses Stripe **only** for payment processing, so you don't need to set up Stripe Billing.

### Payment gateway

Once you have enabled Billing, you will see the following **Payment gateway** options for collecting payments via Stripe:

* **Clerk development gateway**: A shared **test** Stripe account used for development instances. This allows developers to test and build Billing flows **in development** without needing to create and configure a Stripe account.
* **Stripe account**: Use your own Stripe account for production. **A Stripe account created for a development instance cannot be used for production**. You will need to create a separate Stripe account for your production environment.

## Create a Plan

Subscription Plans are what your users subscribe to. There is no limit to the number of Plans you can create.

To create a Plan, navigate to the [**Subscription plans**](https://dashboard.clerk.com/~/billing/plans) page in the Clerk Dashboard. Here, you can create, edit, and delete Plans. To setup B2C Billing, select the **Plans for Users** tab and select **Add Plan**. When creating a Plan, you can also create Features for the Plan; see the next section for more information.

> \[!TIP]
> What is the **Publicly available** option?
>
> ***
>
> Plans appear in some Clerk components depending on what kind of Plan it is. All Plans can appear in the `<PricingTable />` component. If it's a user Plan, it can appear in the `<UserProfile />` component. When creating or editing a Plan, if you'd like to hide it from appearing in Clerk components, you can toggle the **Publicly available** option off.

## Add Features to a Plan

[Features](/docs/guides/secure/features) make it easy to give entitlements to your Plans. You can add any number of Features to a Plan.

You can add a Feature to a Plan when you are creating a Plan. To add it after a Plan is created:

1. Navigate to the [**Subscription plans**](https://dashboard.clerk.com/~/billing/plans) page in the Clerk Dashboard.
2. Select the Plan you'd like to add a Feature to.
3. In the **Features** section, select **Add Feature**.

> \[!TIP]
> What is the **Publicly available** option?
>
> ***
>
> Plans appear in some Clerk components depending on what kind of Plan it is. All Plans can appear in the `<PricingTable />` component. If it's a user Plan, it can appear in the `<UserProfile />` component. When adding a Feature to a Plan, it will also automatically appear in the corresponding Plan. When creating or editing a Feature, if you'd like to hide it from appearing in Clerk components, you can toggle the **Publicly available** option off.

## Create a pricing page

You can create a pricing page by using the <SDKLink href="/docs/:sdk:/reference/components/billing/pricing-table" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<PricingTable /></SDKLink> component. This component displays a table of Plans and Features that users can subscribe to. **It's recommended to create a dedicated page**, as shown in the following example.

<If sdk="nextjs">
  ```tsx {{ filename: 'app/pricing/page.tsx' }}
  import { PricingTable } from '@clerk/nextjs'

  export default function PricingPage() {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <PricingTable />
      </div>
    )
  }
  ```
</If>

## Control access with Features and Plans

You can use Clerk's Features and Plans to gate access to the content. There are a few ways to do this, but the recommended approach is to either use the <SDKLink href="/docs/reference/backend/types/auth-object#has" sdks={["js-backend"]} code={true}>has()</SDKLink> method or the <SDKLink href="/docs/:sdk:/reference/components/control/protect" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<Protect></SDKLink> component.

The `has()` method is available for any JavaScript framework, while `<Protect>` is only available for React-based frameworks.

### Example: Using `has()`

Use the `has()` method to test if the user has access to a **Plan**:

```jsx
const hasPremiumAccess = has({ plan: 'gold' })
```

Or a **Feature**:

```jsx
const hasPremiumAccess = has({ feature: 'widgets' })
```

The <SDKLink href="/docs/reference/backend/types/auth-object#has" sdks={["js-backend"]} code={true}>has()</SDKLink> method is a server-side helper that checks if the Organization has been granted a specific type of access control (Role, Permission, Feature, or Plan) and returns a boolean value. `has()` is available on the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>auth object</SDKLink>, which you will access differently <SDKLink href="/docs/reference/backend/types/auth-object#how-to-access-the-auth-object" sdks={["js-backend"]}>depending on the framework you are using</SDKLink>.

<Tabs items={[ "Plan", "Feature"]}>
  <Tab>
    The following example demonstrates how to use `has()` to check if a user has a Plan.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/bronze-content/page.tsx' }}
          import { auth } from '@clerk/nextjs/server'

          export default async function BronzeContentPage() {
            const { has } = await auth()

            const hasBronzePlan = has({ plan: 'bronze' })

            if (!hasBronzePlan) return <h1>Only subscribers to the Bronze plan can access this content.</h1>

            return <h1>For Bronze subscribers only</h1>
          }
          ```
        </If>
  </Tab>

  <Tab>
    The following example demonstrates how to use `has()` to check if a user has a Feature.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/premium-content/page.tsx' }}
          import { auth } from '@clerk/nextjs/server'

          export default async function PremiumContentPage() {
            const { has } = await auth()

            const hasPremiumAccess = has({ feature: 'premium_access' })

            if (!hasPremiumAccess)
              return <h1>Only subscribers with the Premium Access feature can access this content.</h1>

            return <h1>Our Exclusive Content</h1>
          }
          ```
        </If>
  </Tab>
</Tabs>

### Example: Using `<Protect>`

The <SDKLink href="/docs/:sdk:/reference/components/control/protect" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<Protect></SDKLink> component protects content or even entire routes by checking if the user has been granted a specific type of access control (Role, Permission, Feature, or Plan). You can pass a `fallback` prop to `<Protect>` that will be rendered if the user does not have the access control.

<Tabs items={["Plan", "Feature"]}>
  <Tab>
    The following example demonstrates how to use `<Protect>` to protect a page by checking if the user has a Plan.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/protected-content/page.tsx' }}
          import { Protect } from '@clerk/nextjs'

          export default function ProtectedContentPage() {
            return (
              <Protect
                plan="bronze"
                fallback={<p>Only subscribers to the Bronze plan can access this content.</p>}
              >
                <h1>Exclusive Bronze Content</h1>
                <p>This content is only visible to Bronze subscribers.</p>
              </Protect>
            )
          }
          ```
        </If>
  </Tab>

  <Tab>
    The following example demonstrates how to use `<Protect>` to protect a page by checking if the user has a Feature.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/protected-premium-content/page.tsx' }}
          import { Protect } from '@clerk/nextjs'

          export default function ProtectedPremiumContentPage() {
            return (
              <Protect
                feature="premium_access"
                fallback={<p>Only subscribers with the Premium Access feature can access this content.</p>}
              >
                <h1>Exclusive Premium Content</h1>
                <p>This content is only visible to users with Premium Access feature.</p>
              </Protect>
            )
          }
          ```
        </If>
  </Tab>
</Tabs>
