---
title: How Clerk works
description: Learn how Clerk is architected and how it works under the hood.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/overview
sourceFile: /docs/guides/how-clerk-works/overview.mdx
---

This guide provides a deep dive into Clerk's architecture and internal workings. For developers who are simply looking to add authentication to their app, see the [quickstart guides](/docs/getting-started/quickstart/overview).

## The frontend API

When you create a new application through the [Clerk Dashboard](https://dashboard.clerk.com/), Clerk provisions a dedicated frontend API (FAPI) instance for your application. It is hosted at `https://<slug>.clerk.accounts.dev` in development environments, where `<slug>` is a unique identifier generated for your application. You can find your application's <Tooltip><TooltipTrigger>FAPI URL</TooltipTrigger><TooltipContent>Your Clerk **Frontend API URL**, or **FAPI URL**, is the URL of your Clerk app's dedicated Frontend API instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip> in the [**Domains**](https://dashboard.clerk.com/~/domains) page of the Clerk Dashboard.

When configuring your Clerk app, you must provide a <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip>. The Publishable Key tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance.

The Clerk Publishable Key follows a specific format: it consists of your FAPI URL encoded in base64, prefixed with an environment identifier (e.g. `pk_test_` for development environments, `pk_live_` for production environments), and suffixed with a `$` delimiter for future extensibility. The base64-encoded URL enables your application to locate and communicate with your dedicated FAPI instance. You can verify this structure by decoding the key yourself:

```js
const publishableKey = 'pk_test_ZXhhbXBsZS5hY2NvdW50cy5kZXYk'
const keyWithoutPrefix = publishableKey.replace('pk_test_', '')

atob(keyWithoutPrefix) // => example.accounts.dev$
```

> \[!NOTE]
> In previous versions of Clerk, the <Tooltip><TooltipTrigger>FAPI URL</TooltipTrigger><TooltipContent>Your Clerk **Frontend API URL**, or **FAPI URL**, is the URL of your Clerk app's dedicated Frontend API instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip> was exposed directly rather than being encoded within a Publishable Key. This was a source of confusion for users, so we transitioned to encoding it as base64 and making it a key.

FAPI manages authentication flows on a per-user basis. For instance, it handles flows for signing up a user, retrieving a user's active sessions, creating an Organization on behalf of a user, or fetching a user's Organization invites. You can find the complete FAPI documentation [here](/docs/reference/frontend-api){{ target: '_blank' }}.

FAPI *does not* handle administrative actions that impact multiple users, such as listing all users, banning users, or impersonating a user. These types of tasks are handled by [the backend API](#the-backend-api).

Some tasks, such as [signing up a user](/docs/reference/frontend-api/tag/sign-ups/post/v1/client/sign_ups){{ target: '_blank' }}, don't require authentication, as that would defeat the purpose of the endpoint. However, endpoints designed for authenticated users, like [updating a user's details](/docs/reference/frontend-api/tag/user/patch/v1/me){{ target: '_blank' }}, require FAPI to first identify the user making the request and then verify their authorization. This ensures that users cannot modify another user's details. Typically, this is achieved by sending a signed token with the request, either as a cookie or a header. You can [learn more about Clerk's authentication tokens later in this guide](#stateful-authentication).

While it's possible to build complete authentication flows directly on top of the frontend API, it involves significantly more work. Most users prefer our frontend SDKs, which provide higher-level abstractions like the <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in#mount-sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>mountSignIn()</SDKLink> method or the <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink> component (for React-based SDKs). These abstractions offer a well-tested, thoughtfully designed, a11y-optimized, and customizable UI for authentication flows, handling all possible configurations of your authentication preferences out-of-the-box.

## Levels of abstraction

FAPI is the lowest level of abstraction that authentication flows can be built on with Clerk. However, there are several other abstraction layers that offer less work and more convenience.

### Clerk's prebuilt components

Clerk's <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt UI components</SDKLink> are Clerk's highest level of abstraction. They are "all in one" components, offering the most complete implementation of authentication with the least amount of effort. While it's strongly recommended to use these components, due to the amount of research we have put into delivering an optimal experience, it's not the only option if you feel that you need more control over your authentication flows.

> **Customizability:** You can <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>modify the CSS for any part of the prebuilt components</SDKLink>, but not the HTML structure or the logic/ordering of how the authentication flow works.

### Clerk Elements

The next level of abstraction is [Clerk Elements](/docs/guides/customizing-clerk/elements/overview), a headless UI library that provides the foundational building blocks used in Clerk's prebuilt components. Similar to established libraries like [Radix](https://www.radix-ui.com), [Reach UI](https://reach.tech), and [Headless UI](https://headlessui.com), Clerk Elements exposes a set of unstyled React components that handle complex authentication logic while giving you complete control over the presentation layer. **Clerk Elements is still in beta**, and only supports sign-up and sign-in flows, with more components planned for future releases.

> **Customizability:** You have full control over both the CSS and the HTML structure of the components, but you can't change the logic/ordering of how the authentication flow works.

### Custom flows

Finally, if you need complete control over the authentication flow, Clerk provides low-level primitives that directly wrap our API endpoints. These primitives enable you to build fully custom authentication flows from scratch. Clerk refers to these as ["custom flows"](/docs/guides/development/custom-flows/overview). While this approach offers maximum flexibility, it also requires significant development effort to implement and maintain. Custom flows should only be considered when you have specific requirements that cannot be met using the prebuilt components or Clerk Elements, as you'll need to handle all authentication logic, error states, and edge cases yourself.

> **Customizability:** You have full control over every part of the authentication flow, including HTML structure, CSS, and the logic/ordering of how the authentication flow works.

## The backend API

The frontend API (FAPI) is designed for use primarily from the frontend of your application. Its methods focus on signing in users and managing user-related resources and data once they are authenticated. However, as an application developer, you might also need to perform administrative tasks, such as modifying multiple user or Organization details, retrieving a list of all users, banning or impersonating a user, and more.

To maintain security, these administrative tasks should only be executed on the server side using a secret key inaccessible to your users or the browser. These operations are handled by a separate API known as the backend API (BAPI). You can find the BAPI documentation [here](/docs/reference/backend-api){{ target: '_blank' }}.

Although the administrative features of BAPI are useful for many applications, it's most commonly used to verify a user's authentication state when processing requests from your app's frontend. For instance, if a user submits a request to update some data associated with their account, **your server must ensure the user is authenticated and authorized to make this change.** Without proper validation, malicious actors could potentially take over user accounts.

Like FAPI, while you can interact directly with BAPI, most developers opt to use Clerk's SDKs for smoother integration with their preferred language or framework. Documentation for Clerk's SDKs is available in [the left sidenav of the docs](https://clerk.com/docs). That being said, FAPI is a much more complex and nuanced API that relies on more custom logic outside of its endpoints to create a functional SDK on top of it. As such, **interacting directly with FAPI is not recommended**, whereas interacting directly with BAPI is generally reasonable.

## Stateful authentication

To understand how authentication works in Clerk, it's important to first understand how the most common implementation of authentication logic works: the traditional "stateful authentication" model, also known as "session token authentication".

A user's process of signing in would work as follows. This example assumes that the user already signed up and their credentials are stored in a database.

1. The user initiates authentication by navigating to `example.com/sign-in`, entering their credentials (e.g. username/password), and submitting the form, usually by clicking a "submit" button. This makes a request to the server with the credentials.
2. The server validates the credentials against a database. This is normally done by [hashing](https://clerk.com/glossary#hash) the password and comparing it with a stored password hash. Upon successful validation, it creates a new [session](https://clerk.com/glossary#session) in the database associated with the user.
3. The server responds to the browser's request by setting the session ID in a [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header in the response, which sets a cookie with this value in the browser. This cookie will be automatically included in future requests from the browser in order to authenticate the user.
   <Video src="/docs/images/how-clerk-works/stateful-auth.mp4" width="1400" height="700" autoPlay muted loop playsInline controls />
4. The next time the browser sends a request to the server, it [automatically includes](/docs/guides/how-clerk-works/cookies) the session cookie. The server checks the database for the session ID and retrieves the associated user ID and session metadata. If the session is valid and active, the server has verified that the user has authenticated, and can then use the user ID to fetch any required user data and process the request.
   <Video src="/docs/images/how-clerk-works/stateful-auth-2.mp4" width="1400" height="700" autoPlay muted loop playsInline controls />

> \[!NOTE]
> What happens if an attacker gets their hands on your session ID? Generally, the answer here is that you're in trouble. If an attacker gets your session ID, they can sign in as you. Therefore, it's best practice to use [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS) (ensures attacker can't [sniff it](https://en.wikipedia.org/wiki/Sniffing_attack)) and ensure the cookie is [set as `HttpOnly`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#httponly) (ensures attacker can't get it via remote JavaScript execution).

This is a perfectly reasonable authentication model and works great for most apps as it's straightforward to understand and implement. Additionally, since it checks the database for *every request* that requires authentication, sessions can be instantly revoked if needed (by setting the state to `revoked` and adding a check in the server logic). However, because it requires every request to query the database, it introduces additional latency and can be difficult to scale as you start to shard out your database.

## Stateless authentication

An alternative approach is "stateless" authentication, which addresses the scalability and latency challenges of stateful authentication while introducing different tradeoffs.

The stateless authentication flow operates as follows. This example assumes that the user already signed up and their credentials are stored in a database.

1. The user initiates authentication by navigating to `example.com/sign-in`, entering their credentials (e.g. username/password), and submitting the form, usually by clicking a "submit" button. This makes a request to the server with the credentials.
2. The server validates the credentials against a database. Upon successful validation, it generates a [cryptographically signed token](/docs/guides/how-clerk-works/tokens-and-signatures) containing essential user data like the user ID and any relevant [claims](https://clerk.com/glossary#claim). JSON Web Tokens (JWTs) are by far the most common form of signed tokens in the modern web.
3. The server responds to the browser's request by sending the token in a [`Set-Cookie` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) in the response. This token serves as a self-contained proof of authentication, and will be included in future requests from the browser in order to authenticate the user.
   <Video src="/docs/images/how-clerk-works/stateless-auth.mp4" width="1400" height="700" autoPlay muted loop playsInline controls />
4. The next time the browser sends a request to the server, it sends the cookie containing the token. The server verifies the signature of the token to ensure that it's valid, and then uses the user ID within the token to fetch any required user data and process the request.
   <Video src="/docs/images/how-clerk-works/stateless-auth-2.mp4" width="1400" height="700" autoPlay muted loop playsInline controls />

While more complex to implement, this stateless model offers significant advantages. Because verifying the JWT doesn't require interacting with a database, the latency overhead and scaling challenges caused by database lookups are eliminated, leading to faster request processing.

> \[!QUIZ]
> How exactly does stateless authentication mitigate database scaling challenges?
>
> ***
>
> When you are first building an application, a single database instance is often sufficient to handle your traffic. As your application grows, you'll need to scale your database to manage increased load. This typically involves creating multiple database copies or splitting the database into multiple instances through a process called [sharding](https://en.wikipedia.org/wiki/Shard_\(database_architecture\)).
>
> Sharding involves dividing a database into smaller, more manageable databases (called shards), each handling a subset of the total data. To manage this complexity, a [load balancer](https://en.wikipedia.org/wiki/Load_balancing_\(computing\)) often serves as an entry point that directs traffic to ensure no single database instance becomes overwhelmed.
>
> Keeping multiple database instances synchronized is a challenging problem that software engineers have grappled with for decades. The potential consequences of unsynchronized instances can be significant. For example, if a user signs in on one database instance and a subsequent request for that user's data is routed to an unsynchronized instance, the user might encounter a confusing authentication error.
>
> Stateless authentication offers an elegant solution. By using [signed tokens](/docs/guides/how-clerk-works/tokens-and-signatures) that contain all necessary authentication information, the server can verify a user's credentials **without direct database interaction**, effectively bypassing the synchronization complexities that arise in traditional, stateful authentication methods.

However, this approach also comes with important technical tradeoffs. The most significant limitation is that **JWTs cannot be revoked** due to their self-contained nature. Since JWT validation happens locally without consulting a central authority (i.e., they never "phone home"), there's no direct mechanism to invalidate them before their natural expiration.

This creates challenges for session management. To forcibly terminate a user's session, you have two suboptimal choices:

1. Wait for the JWT to expire naturally.
2. Rotate the signing keys, which invalidates all active sessions across your entire user base, signing out all of your users.

Furthermore, even after rotating keys, the revocation may be delayed if your application caches the public key used for verification - a common practice for performance optimization. The cached key would continue to validate the old tokens until the cache expires.

This limitation poses significant security risks, as it hampers your ability to quickly respond to security incidents that require immediate session termination for specific users.

## Clerk's authentication model

Clerk implements a hybrid authentication model that combines the benefits of both stateful and stateless approaches while mitigating their respective drawbacks, at the cost of adding a substantial amount of complexity to the implementation on Clerk's side. However, for a developer implementing Clerk, like you, this is all upside since the complexity is handled internally by Clerk.

The hybrid model incorporates the same flow when signing in as the stateless flow, but with a key change: **the session token's expiration is decoupled from the session lifetime**. See the following section for more details.

### Authentication flow

This example assumes that the user already signed up and their credentials are stored in a database.

1. The user initiates authentication by navigating to `example.com/sign-in`, entering their credentials (e.g. username/password), and submitting the form, usually by clicking a "submit" button. This makes a request to the server with the credentials.
2. The server validates the credentials against a database and, upon successful validation:
   * Creates a session record in the database (stateful component).
   * Generates a [signed JWT](/docs/guides/how-clerk-works/tokens-and-signatures) with its expiration set to the session lifetime (stateless component) - this JWT is stored as a cookie on the FAPI domain, and is not accessible to the application. Clerk calls this the **client token**.
   * Generates a **second** signed JWT that expires after 60 seconds which is returned directly to the application and contains user data like the user ID and other claims. Clerk calls this the **session token**.
3. The server responds to the browser's request by sending the **client token** in a [`Set-Cookie` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) in the response, which is set on the FAPI domain. Clerk's client-side SDK then makes a request to FAPI to get a **session token** and sets it on your app's domain.

   > \[!QUIZ]
   > Why doesn't Clerk set a **session token** using the `Set-Cookie` header when its setting the **client token**?
   >
   > ***
   >
   > This is a great test of your mastery of [how cookies work](/docs/guides/how-clerk-works/cookies)!
   >
   > Remember, **the domain of a cookie can only be set as the domain of the server that set the cookie**. In this case, the server returning the request to your app is FAPI. For the **`__client` cookie**, this is ok, since the **`__client` cookie** needs to be set on FAPI. However, the **`__session` cookie** needs to be set on your app's domain, not on FAPI. So, FAPI returns the **JWT value** of the `__session` cookie in its response, and when the Clerk client-side SDK integrated in your app receives the response, it gets the **JWT value** and uses JavaScript to set the **`__session` cookie** on your app directly, since the JavaScript is running on your app's domain.

   <Video src="/docs/images/how-clerk-works/hybrid-auth.mp4" width="1400" height="700" autoPlay muted loop playsInline controls />
4. And just like stateless auth, the next time the browser sends a request to the server, it sends the cookie containing the **session token**. The server verifies the signature of the token to ensure that it's valid, and then uses the user ID within the token to fetch any required user data and process the request.
   <Video src="/docs/images/how-clerk-works/hybrid-auth-2.mp4" width="1400" height="700" autoPlay muted loop playsInline controls />

So far, this is the same as stateless auth, with one key distinction: the session token's expiration time. This is because normally, in stateless authentication implementations, the token's expiration is set to match the intended session duration - commonly ranging from one week to one month. But since JWTs can't be revoked, if a token is compromised, the attacker has the entirety of the session lifetime to be able to take over the user's account. This will be several days at least on average, if not several weeks.

Clerk's model mitigates this issue by setting an extremely short session token lifetime of 60 seconds. Normally, a Clerk token will have already expired before an attacker gets the chance to even try to use it. This is great for security, but it does create a complication in the authentication flow, as signing users out every 60 seconds would not be an acceptable user experience. So, for this architecture to work, **it must decouple token expiration from session lifetime**. To make this happen, Clerk introduces a new "token refresh" mechanism that runs in the background and is responsible for refreshing the token every minute.

### Token refresh mechanism

To maintain session continuity despite the 60-second token lifetime, Clerk's frontend SDKs implement an automatic refresh mechanism that:

* Runs on a 50-second interval (allowing 10 seconds for network latency).
* Makes requests to the [`/client/sessions/<id>/tokens` endpoint](/docs/reference/frontend-api/tag/sessions/post/v1/client/sessions/\{session_id}/tokens){{ target: '_blank' }}.
* Updates the session token before expiration.

If you open the network tab in your browser's developer tools on a Clerk application, you will see this request being sent, and a session token being returned in the response.

This approach provides several security benefits:

* Minimizes the window of opportunity for token misuse
* Maintains the ability to revoke sessions quickly
* Preserves the performance benefits of stateless authentication

<Video src="/docs/images/how-clerk-works/renewal.mp4" width="1400" height="700" autoPlay muted loop playsInline />

<br />

<Video src="/docs/images/how-clerk-works/invalidation.mp4" width="1400" height="700" autoPlay muted loop playsInline />

## Clerk's cookies & tokens in detail

> \[!TIP]
> To understand Clerk's architecture, it's important to have a solid foundational understanding of how browser cookies work at a detailed level. If you need a refresher on cookie fundamentals, including domain scoping, `SameSite` policies, and `HttpOnly` flags, see the [guide on cookies](/docs/guides/how-clerk-works/cookies).

If the token lifetime is 60 seconds, how does Clerk know how long your entire session lifetime is?

Clerk's authentication model relies on two distinct tokens - a "client token" and a "session token". Let's break down each of these tokens and how they are configured as cookies.

### Client token

The client token is a long-lived token that is stored in the `__client` cookie, which is set on your FAPI domain.

* **Cookie name:** `__client`
* **Contents:** A Clerk-signed JWT containing:
  * `id`: Unique client identifier
  * `rotating_token`: [Anti-session-fixation](/docs/guides/secure/best-practices/fixation-protection) token that rotates on each sign-in across any device
* **Domain:** Set on your FAPI domain (`clerk.example.com`), rather than on your app domain (`example.com`). It's set on the FAPI domain as a security measure - for example, if your app logs are leaked, they wouldn't contain client token values, since it's scoped to a different domain.
* **Expiration:** Browser dependent. The `Expires/Max-Age` of this cookie is limited by the browser.
* **HttpOnly:** Yes
* **SameSite:** Lax

The client token serves as the source of truth for authentication state. When a user signs in, Clerk either creates a new client token or rotates the existing token's `rotating_token` value. A valid client token enables Clerk to generate short-lived session tokens for the application.

**The client token is only used in production environments**.

In production, Clerk uses a [client token](/docs/guides/how-clerk-works/overview#client-token) to represent the user's session. This client token is stored as an `HttpOnly` cookie (`__client`) on the [Clerk FAPI](/docs/guides/how-clerk-works/overview#the-frontend-api) domain. Because, in production, FAPI is hosted on a subdomain of your application (e.g., `clerk.example.com`) via a CNAME record, your app's frontend and FAPI are on the same site. This allows the client token to be securely and reliably sent with each request from your frontend to FAPI using **same-site** cookies.

However, in development, your app's frontend typically runs on a `localhost` domain, while FAPI for development instances is hosted on a domain ending with `accounts.dev`. As a result, requests from your app's frontend to FAPI are **cross-site**, and the client token cannot be securely and reliably stored or transmitted using cookies.

> \[!QUIZ]
> Why can't the client token be securely and reliably stored and transmitted in a cookie when cross-site requests are made?
>
> ***
>
> In order for cookies to be sent cross-site, the cookie would need to be set with [`SameSite=None`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#none). In theory this would resolve the issue, but in reality, modern browsers are increasingly restrictive on cross-site cookie behavior due to the abuse of cookies for tracking and advertising. Safari specifically [does not support `SameSite=None` for cookies at all](https://support.apple.com/guide/iphone/browse-the-web-privately-iphb01fc3c85/ios) unless a browser flag is enabled. Other browsers also have restrictions around cross-site cookie behavior, which leads to a frustrating and unreliable experience for local development.

To address these limitations, development instances use a different approach to maintain session state. An object called the "dev browser", which is linked directly to the client token within Clerk's internals, is used to maintain session state across the session lifetime, and is transmitted via querystring (`__clerk_db_jwt`) rather than via cookie. This strategy allows for a more reliable experience for local development, as it does not require the use of cross-site cookies.

While this enables smooth local development workflows, it is not secure enough for production use. Including a sensitive value like the client token in a querystring is not a strong security practice, as it can be seen directly in server logs, browser history, internet providers' logs, and could be potentially intercepted by third-parties via malicious browser extensions or network interceptors. This is why the `__clerk_db_jwt` object is not used in production instances and the same-site cookie (`__client`) is used instead.

For this reason:

1. Never deploy a development environment to production.
2. Do not rely on `__clerk_db_jwt` in your application code, as it will break in production.

For more information on the differences between development and production environments, see the [dedicated guide on Clerk environments](/docs/guides/development/managing-environments#session-architecture-differences).

### Session token

The session token is a short-lived token that is stored in the `__session` cookie, which is set on your app's domain.

* **Cookie name:** `__session`
* **Contents:** A Clerk-signed JWT containing [a set of default claims](/docs/guides/sessions/session-tokens#default-claims). Can be customized in the Clerk Dashboard to include additional claims.
* **Domain:** Set on your application's domain directly, scoped strictly so it cannot be shared across subdomains. This is done to prevent a different app on a different subdomain from being able to take over your users' accounts. If you need to send the session token value across subdomain boundaries, such as from `example.com` to `api.example.com`, you can [put the token in a `request` header instead](/docs/guides/development/making-requests).
* **Expiration:** 60 seconds
* **HttpOnly:** No - must be able to be accessed by client-side SDKs
* **SameSite:** Lax

When your app makes a request from the frontend to your backend, if the backend is on the same origin, the `__session` cookie will automatically be sent along with the request. Your backend can then [cryptographically verify](/docs/guides/sessions/manual-jwt-verification) the session token's signature and extract the user ID and other claims.

> \[!QUIZ]
> Why is the `__session` cookie not `HttpOnly`? Is this a security issue?
>
> ***
>
> Setting cookies as `HttpOnly` is generally recommended to prevent client-side JavaScript access, reducing the risk of cross-site scripting (XSS) attacks. However, due to Clerk's architecture, this approach wouldn't work.
>
> Remember that FAPI is hosted on a different origin than your app. Let's say, in production, your app is `example.com`. Then FAPI is `clerk.example.com`. Since cookies are only sent to the domain that set them (or its subdomains, depending on the `Domain` attribute), any cookie set by FAPI would be scoped to `clerk.example.com` and would not be sent to `example.com`.
>
> To work around this, Clerk returns the session token from FAPI after a user signs in, and the client-side SDK used by your app (e.g., React SDK) sets the `__session` cookie containing the session token on your app's domain **via JavaScript**. A benefit of this is that it allows the token's value and session claims to be accessed on the client-side. This is often quite valuable, as it allows developers to send the session token as a custom header in requests and also makes it possible to use a subdomain (like `api.example.com`) for your backend. However, because it's set client-side, it cannot be `HttpOnly`, making it more vulnerable to XSS attacks.
>
> Clerk mitigates this risk substantially by setting the session token's expiration to a very short duration of 60 seconds. For an XSS attack to succeed, the developer would need to ship a vulnerability on their site, and the attacker would need to exfiltrate users' tokens and use them to take over accounts in an average of less than 30 seconds. This is an extremely difficult scenario and extremely unlikely to be an issue for the most common type of XSS attacks, which are broad sweeps across many sites to harvest tokens, typically after a CVE is disclosed, that can take advantage of those who didn't patch their sites in time. Additionally, Clerk's fast-expiring token provides an extra layer of protection against other attacks that `HttpOnly` cookies alone wouldn't mitigate.
>
> Summary: Clerk's `__session` cookie is not `HttpOnly` because it needs to be accessible to the client-side SDKs. However, Clerk mitigates the risk of XSS attacks by setting the session token's expiration to a very short duration of 60 seconds.

## The Handshake

The short-lived nature of session tokens introduces a case that requires special handling. Consider this scenario: A user signs in to your application and then closes their browser tab. When they return after five minutes by opening a new tab, their session token will have expired since the refresh mechanism could not run while the tab was closed. At this point, Clerk needs to determine the user's authentication status and potentially issue a new session token.

For client-rendered applications, this process is straightforward. Clerk's frontend SDK makes a direct request to FAPI with the `__client` cookie. If the client token is valid, FAPI issues and returns a new session token. This is *secure by default*, because only users who are properly authenticated and signed in will have a valid client token in their browser. If the client token is invalid, the user is redirected to the sign-in flow.

However, server-rendered applications present a unique challenge. Server-to-server requests cannot include browser cookies, as cookies are stored by the browser. This means that, if your app's backend made a request directly to FAPI, the client token would not be available with that request, as the request would not flow through the browser. To solve this problem, Clerk implements a "handshake" flow:

1. The server returns a **redirect response** to the browser
2. The browser follows the redirect to FAPI
3. FAPI receives the request with the `__client` cookie
4. FAPI validates the authentication state and issues a new session token

<Video src="/docs/images/how-clerk-works/handshake.mp4" width="1920" height="1080" autoPlay muted loop playsInline />

This server -> browser -> FAPI request includes the client token, so FAPI is able to verify the user's auth state and issue a new session token securely. This handshake ensures secure token renewal while maintaining the benefits of server-side rendering.

> \[!QUIZ]
> Why does handshake do a redirect? Why can't it make a fetch request to FAPI and get a new token back that way? Not needing to redirect would be a better user experience.
>
> ***
>
> First remember that with Clerk, the **session token** is the short-lived one that refreshes every 60 seconds, and the **client token** is the long-lived one whose expiration is your session's lifetime.
>
> Now let's get back to the previous scenario: you open your server-rendered application after having closed the tab for a few minutes, and now you have an expired session token. Normally, to refresh your session token, you make a request to FAPI with the `__client` cookie that contains the long-lived client token. FAPI will validate the client token and check if there's an active session. If there is, it will mint a new session token and send it back.
>
> But in this scenario, you have only an invalid (expired) session token, and since your app is rendering on the server, you cannot send a request with the client token since it's stored in a cookie in the browser and server-to-server requests don't flow through the browser. So the question becomes this: how do you get a new session token?
>
> * You could send the expired session token, but then any attacker with an expired session token would be able to mint a new one and hijack your session.
> * You could verify that the request only comes from your application's domain, but then any attacker could just send an `http` request with a spoofed domain value and get a token on your behalf.
>
> Neither of these options are secure. Clerk's unique authentication model requires a new mechanism to get a new session token. This is where handshake comes in - here's how it works:
>
> 1. A request is made to an application that uses Clerk on the server.
> 2. The Clerk SDK used by your app determines the authentication state of the request: `signed-in` (valid session token), `signed-out` (no session token), or `handshake` (expired session token).
> 3. If the authentication state is `handshake`, meaning Clerk knows the session token is expired but can't be sure if the user is signed in or out, the Clerk SDK responds with a 307 redirect to the handshake endpoint: `fapi/v1/client/handshake`.
> 4. The handshake endpoint gets information about the current session and returns a handshake payload. The encoded handshake payload contains a list of `Set-Cookie` header directives to be passed along with the final response.
>    * If the session is active, a new, valid `__session` cookie is returned.
>    * If the session is inactive, the `__session` cookie is wiped and the request will be treated as signed out.
> 5. The handshake endpoint redirects back to the host application along with the handshake payload, encoded either in the URL (development) or as a cookie (production).
> 6. The handshake payload is parsed and `Set-Cookie` headers are set on the response by the Clerk SDK.
> 7. If an updated `__session` cookie is returned, the JWT is verified. If verification is successful, the request is treated as signed in.
> 8. If an updated `__session` cookie is not returned, the request is treated as signed out.
>
> This makes it such that you can't provide proof of authentication via an API call - the proof comes from the **`__client` cookie** on FAPI which can't be tampered with by attackers since it's not set on the application domain and is `HttpOnly`.

{/*
  Future sections to add
  - the anatomy of clerk's sign up and sign in flows
  - subdomain session sharing
  - satellite domains
  */}
---
title: Cookies
description: Learn how cookies enable secure authentication and manage
  browser-server interactions.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/cookies
sourceFile: /docs/guides/how-clerk-works/cookies.mdx
---

Cookies play a vital role in authentication, state management, and browser-server communication. By understanding their attributes, developers can ensure secure and efficient use in their applications.

## What are cookies?

Cookies are small pieces of information stored in the browser and sent automatically alongside some requests coming from that browser.

By default, HTTP requests are "stateless" and lack memory of previous interactions. Cookies change this behavior, as they are stored long term and can be sent alongside each request.

### Setting cookies

Cookies are typically created by the server and communicated to the browser through the [`Set-Cookie` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie). When the browser receives this header, it stores the cookie and includes it in future requests to the **same domain**. Here's an example:

```http
HTTP/2 200
Content-Type: text/html
Set-Cookie: session_id=sess123

<html>
  <body>
    <p>Hello, world!</p>
  </body>
</html>
```

This response sets a `session_id` cookie with the value `sess123`. To view cookies in your browser's developer tools, navigate to the **Application** tab. Then in the **Storage** section, select **Cookies**. Here's an example from Clerk's website:

![cookies in browser console](/docs/images/how-clerk-works/devtools-cookies.png)

## Cookie domains and scope

Each cookie has a [`Domain`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent) that indicates **the domain from which the cookie was set**. This determines when the cookie will be included in requests.

For example:

* If a cookie is set by `example.com` without a `Domain` value, it will be sent only with requests *to* `example.com`.
* If the cookie's `Domain` value is *explicitly* set to `example.com`, it will also be sent with requests to subdomains like `sub.example.com`.
* However, cookies set by subdomains (e.g., `sub.example.com`) won't be sent with requests to the parent domain (`example.com`).

## Tracking cookies and privacy concerns

Historically, cookies were often used for tracking user behavior across websites.

For example, say you [hotlink](https://developer.mozilla.org/en-US/docs/Glossary/Hotlink) an image from `facebook.com` on to your website, `example.com`, as such:

```
<!doctype html>
<html>
  <body>
    <p>Check out this cool picture of me on vacation that I posted on FB</p>
    <img src='http://facebook.com/images/h0e208whe8r0.jpg alt='Me on vacation' />
  <body>
</html>
```

To display the image, `example.com` requests the image from `facebook.com`. Let's say Facebook's web server:

1. Retrieves the image
2. Creates an entry for you as a user in their database with a unique ID
3. Records that you visited `example.com`
4. Sets a cookie with your unique ID and [the `SameSite` value set to "none"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)

The response from Facebook would look something like:

```
HTTP/2 200
Set-Cookie: fb_tracker=user123; SameSite=none

...the content of the image
```

Now let's say you visit another website, `foobar.com`, and that website is using a script from Facebook for tracking the effectiveness of Facebook ads. So now `foobar.com` makes a request to `facebook.com`, and Facebook gets back the cookie that it set from the image on `example.com`. But how could this happen? Let's revisit this statement one more time:

> Cookies are typically created by the server and communicated to the browser through the [`Set-Cookie` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie). When the browser receives this header, it stores the cookie and includes it in future requests to the **same domain**.

Despite being set on `example.com`, the cookie's domain value is `facebook.com`, since it was set *by* Facebook. And remember that the cookie was set with the `SameSite` value set to “none”, which, according to [the docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value), means that the browser sends the cookie **with both cross-site and same-site requests.**

So in this scenario, even if the cookie was set on a different website, the browser still sends the cookie back to Facebook, because the cookie has `facebook.com` set as its domain. Facebook then gets the cookie, is able to identify you as a user, and can identify that you also visited `foobar.com`. Any other site that you visit that loads anything from Facebook is an opportunity for Facebook to get back the cookie and use it to build a profile of your browsing habits and history.

Clerk doesn't do any of this type of tracking. However, this example is still helpful for building a foundation around the edges of how cookies are stored and transmitted.

## Controlling cross-site cookie behavior with `SameSite`

The `SameSite` attribute of cookies plays a crucial role in controlling cross-site cookie behavior. Clerk uses the `SameSite=Lax` setting to ensure a secure and user-friendly experience. This setting allows cookies to be sent with top-level navigation (e.g., clicking a link) but not with other cross-site requests (e.g., loading images).

See MDN's guide on [`SameSite`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value) for more details.

## Sharing cookies across subdomains

Sharing cookies across subdomains is controlled by the `Domain` attribute.

* A cookie **explicitly** set with `Domain=example.com` will be sent with requests to both `example.com` and `sub.example.com`.
* A cookie set without a domain value will only be sent to the domain that created it (e.g., `example.com`) and not its subdomains.

Cookies **explicitly** set with a domain appear in devtools with a leading period (e.g., `.example.com`). Cookies set without a domain value appear without the leading period (e.g., `example.com`).

## Controlling JavaScript access with `HttpOnly`

By default, cookies can be accessed via `document.cookie` in JavaScript. While this can be useful, it exposes cookies to risks like [Cross-Site Scripting (XSS) attacks](https://owasp.org/www-community/attacks/xss/). Setting the [`HttpOnly`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#httponly) flag prevents JavaScript from accessing the cookie, enhancing security. These cookies are still sent with HTTP requests but are inaccessible to client-side scripts.

## How Clerk uses cookies

Clerk leverages cookies in a secure, privacy-compliant manner to facilitate seamless user authentication across domains and subdomains. Clerk sets cookies when your users interact with your application in ways that trigger requests for services, such as signing in or signing up. This cannot be disabled.

These cookies:

* Are required for Clerk to function, and should not be blocked by you or your users.
* Do not store any personally identifiable information by default.
* Can be configured by modifying the [session token](/docs/guides/sessions/session-tokens) in the [Clerk Dashboard](https://dashboard.clerk.com/~/jwt-templates).

| Cookie Subgroup | Cookies | More Information |
| - | - | - |
| .clerk.com | `__session`, `__client_uat` | First party |
| .clerk.com, .dashboard.clerk.com (cloudflare) | `_cfuvid` | Third party [Cloudflare Cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/) |

> \[!WARNING]
> You should seek legal advice before using this information to craft your privacy policy.

To learn more about how Clerk uses cookies to store user information, see the [guide on how Clerk works](/docs/guides/how-clerk-works/overview).
---
title: Rate limits
description: Learn about rate limiting on the Clerk APIs.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/system-limits
sourceFile: /docs/guides/how-clerk-works/system-limits.mdx
---

Clerk rate limits certain endpoints to help protect users against brute-force attacks or to stop abuse of Clerk's platform.

## Errors

If you receive a `429` error code, you have been rate limited. All subsequent requests to that specific endpoint will be blocked for a given amount of time.

Requests that have been rate limited will receive the `Retry-After` response header, which contains the number of seconds after which the block expires.

## Frontend API requests

Frontend API requests are rate-limited per user and identified by their IP address.

<Properties>
  * Create SignIn
  * `/v1/sign_ins`

  5 requests per 10 seconds

  ***

  * Create SignUp
  * `/v1/sign_ups`

  5 requests per 10 seconds

  ***

  * Attempt SignIn
  * `/v1/sign_ins/attempt_(first|second)_factor`

  3 requests per 10 seconds

  ***

  * Attempt SignUp
  * `/v1/sign_ups/attempt_verification`

  3 requests per 10 seconds
</Properties>

## Backend API requests

Backend API requests are rate-limited per application instance which is identified by the <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip> that is provided when making Backend API requests.
These limits differ based on whether you're using a development or production instance.

<Properties>
  * Production instances

  1000 requests per 10 seconds

  ***

  * Development instances

  100 requests per 10 seconds

  ***

  * Get the JWKS of the instance
  * `GET /v1/jwks`

  No rate limit

  ***

  * Create a new invitation for the given email address and sends the invitation email
  * `POST /v1/invitations`

  100 requests per hour

  ***

  * Create multiple invitations for the provided email addresses
  * `POST /v1/invitations/bulk`

  25 requests per hour

  ***

  * Create a new organization invitation and sends an email to the provided email address
  * `POST /v1/organizations/{organization_id}/invitations`

  250 requests per hour

  ***

  * Create new organization invitations in bulk and send out emails to the provided email addresses
  * `POST /v1/organizations/{organization_id}/invitations/bulk`

  50 requests per hour
</Properties>

> \[!NOTE]
> The `currentUser()` helper uses the `GET /v1/users/me` endpoint, so it is subject to the respective rate limits.
---
title: Routing in Clerk
description: Learn how Clerk handles routing in your application.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/routing
sourceFile: /docs/guides/how-clerk-works/routing.mdx
---

Some of Clerk's components have their own internal routing.

For example, say a user uses their email address to fill out the <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-up" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignUp /></SDKLink> form. Once they submit the form, they are redirected from `/sign-up` to `/sign-up/verify-email-address`, which renders Clerk's UI for verifying a user's email address. This redirect is handled by Clerk's internal routing.

## `routing` prop

The following Clerk components accept a `routing` prop in order to define the routing strategy:

* <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-up" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignUp /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/organization/create-organization" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<CreateOrganization /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/organization/organization-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<OrganizationProfile /></SDKLink>

There following routing strategies can be passed:

* [`path`](#path-routing)
* [`hash`](#hash-routing)

Clerk will attempt to select the routing strategy that best integrates with your framework of choice. If for some reason the default routing strategy doesn't work for you, use the information below to pick a strategy that will work for your setup.

### `path` routing

`path` routing uses the path in the URL to determine the route. This is useful for server-rendered pages where SEO and server-side routing are crucial, such as Next.js or Remix applications.

For example, say you have a Clerk + Next.js application with the `<SignUp />` component on a dedicated `/sign-up` page. A user visit this page and uses their email address to fill out the `<SignUp />` form. Once they submit the form, they are redirected from `/sign-up` to `/sign-up/verify-email-address`.

For the following SDKs, `path` routing is set *by default* on all Clerk components, as these frameworks support server-side routing out-of-the-box. There is no need to pass the `routing` or `path` props to Clerk components in these frameworks.

* Next.js
* Remix
* TanStack React Start
* React Router

### `hash` routing

`hash` routing uses [the hash (#) portion of the URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash) to determine the route. This is useful for single-page applications that use client-side routing.

For example, say you have a Clerk + React application with the `<SignUp />` component on a dedicated `/sign-up` page. A user visit this page and uses their email address to fill out the `<SignUp />` form. Once they submit the form, they are redirected from `/sign-up` to `/sign-up#verify-email-address`.

In Clerk applications that use any SDK other than [the ones listed in the previous section](#path-routing), `hash` routing is set *by default* on all Clerk components.
---
title: Tokens and signatures
description: Learn about JWTs, digital signatures, and how Clerk uses them to
  securely authenticate users.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/tokens-and-signatures
sourceFile: /docs/guides/how-clerk-works/tokens-and-signatures.mdx
---

## Digital signatures

Digital signatures are a cryptographic technique that ensures the authenticity and integrity of messages. They guarantee that:

1. The message originates from a specific sender (authenticity).
2. The message's content hasn't been modified from how it was written by the sender (integrity).

However, digital signatures do **not** encrypt the message—anyone can read its contents.

### How digital signatures work

Digital signatures use **public key cryptography**, which involves a key pair: a private key (kept secret) and a public key (shared openly). Here's the process:

1. A private key is used to create a **signature**:
   1. The message is [hashed](https://www.techtarget.com/searchdatamanagement/definition/hashing) (a unique, fixed-length representation of the message).
   2. The hash is encrypted using the sender's private key, creating the signature.
2. The message and signature are sent to the recipient.
3. The recipient verifies the signature using the sender's public key by:
   1. Decrypting the signature to retrieve the hash.
   2. Independently hashing the message and comparing the two hashes. If they match, the message is authentic and has not been changed.

So for example, imagine you get a publicly readable message, like `hello world`, and the message is “signed” with the signature `j2e80w8dj9f8`. If you'd like to be sure that the message is genuine, and you have a copy of the sender's public key, you can use this key to decrypt the signature and make sure that it is valid. If it is, you know two things for sure: who sent the message, and that nobody intercepted the message and messed with it in the middle, since part of the verification process involves hashing the message and comparing it to the decrypted signature.

### Key Terminology

* **Sign**: The process of generating a digital signature with a private key and attaching it to a message.
* **Verify**: The process of using a public key to confirm the signature's validity and the message's integrity.

Clerk leverages digital signatures in **JSON Web Tokens (JWTs)** to securely authenticate users.

## JSON Web Tokens (JWTs)

JSON Web Tokens (JWTs) are a lightweight format for transmitting digitally signed data over the internet. They are commonly used for authentication and information exchange.

### Structure of a JWT

A JWT's format is three [base64-encoded](https://builtin.com/software-engineering-perspectives/base64-encoding) parts, separated by dots:

```plaintext
<Header>.<Payload>.<Signature>
```

Here's an example of a JWT:

```plaintext
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Eci61G6w4zh_u9oOCk_v1M_sKcgk0svOmW4ZsL-rt4ojGUH2QY110bQTYNwbEVlowW7phCg7vluX_MCKVwJkxJT6tMk2Ij3Plad96Jf2G2mMsKbxkC-prvjvQkBFYWrYnKWClPBRCyIcG0dVfBvqZ8Mro3t5bX59IKwQ3WZ7AtGBYz5BSiBlrKkp6J1UmP_bFV3eEzIHEFgzRa3pbr4ol4TK6SnAoF88rLr2NhEz9vpdHglUMlOBQiqcZwqrI-Z4XDyDzvnrpujIToiepq9bCimPgVkP54VoZzy-mMSGbthYpLqsL_4MQXaI1Uf_wKFAUuAtzVn4-ebgsKOpvKNzVA
```

Let's decode and break down each part:

**Header**: The header specifies metadata about the token, such as the hashing algorithm used for the signature. There are several different hashing algorithms that can be used to digitally sign a JWT. This example's header tells us that the signature's hash was created using the `RS256` algorithm:

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload**: The payload contains the actual information that you want to send. In Clerk's case, this includes information about the authenticated user. [Read more about Clerk's session JWT payload](/docs/guides/sessions/session-tokens).

```json
{
  "sub": "user_123",
  "iat": 1516239022
}
```

**Signature**: The signature is created by hashing the header and payload, and then encrypting the hash with the private key.

```
Error: The string is not correctly encoded
```

When decoding the signature from base64, an error is thrown because the signature is not base64-encoded. This is expected behavior. The recipient must use the JWT issuer's public key and the algorithm specified in the header (e.g., RS256) to verify the signature. Clerk's SDKs all ship with a method for verifying the signature of a Clerk JWT: [`authenticateRequest()`](/docs/reference/backend/authenticate-request). But if you'd like to verify the signature yourself, see the [guide on manual JWT verification](/docs/guides/sessions/manual-jwt-verification).

### How Clerk uses JWTs

To learn more about how Clerk uses JWTs, read the [guide on how Clerk works](/docs/guides/how-clerk-works/overview).
---
title: Vulnerability disclosure policy
description: Clerk's vulnerability disclosure policy.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/security/vulnerability-disclosure-policy
sourceFile: /docs/guides/how-clerk-works/security/vulnerability-disclosure-policy.mdx
---

## Guidelines

We require that all researchers:

1. Make every effort to avoid privacy violations, degradation of user experience, disruption to production systems, and destruction of data during security testing.
2. Perform research only within the scope set out below.
3. Use the identified communication channels to report vulnerability information to us.
4. Keep information about any vulnerabilities you've discovered confidential between yourself and Clerk, Inc. until we've had 90 days to resolve the issue.

If you follow these guidelines when reporting an issue to us, we commit to:

* Not pursue or support any legal action related to your research;
* Work with you to understand and resolve the issue quickly (including an initial confirmation of your report within 3 business days of submission);

## Scope

* `https://dashboard.clerk.com`
* `https://accounts.clerk.com`
* `https://api.clerk.com`
* `https://clerk.clerk.com`
* Production instances created on `https://dashboard.clerk.com`

## Out of scope

Any services hosted by 3rd party providers and services are excluded from scope. These services include:

* `https://clerk.com`

In the interest of the safety of our users, staff, the Internet at large and you as a security researcher, the following test types are excluded from scope:

* Findings in Development or Staging instances created on `https://dashboard.clerk.com`
* Findings from physical testing such as office access (e.g. open doors, tailgating)
* Findings derived primarily from social engineering (e.g. phishing, vishing)
* Findings from applications or systems not listed in the ‘Scope’ section
* UI and UX bugs and spelling mistakes
* Network level Denial of Service (DoS/DDoS) vulnerabilities

## Things we do not want to receive

* Personally identifiable information (PII)
* Credit card holder data

## How to report a security vulnerability

If you believe you've found a security vulnerability in one of our products or platforms send it to us by emailing [security@clerk.dev](mailto:security@clerk.dev). Include the following details with your report:

Description of the location and potential impact of the vulnerability; and
A detailed description of the steps required to reproduce the vulnerability (POC scripts, screenshots, and compressed screen captures are all helpful to us).
---
title: Clerk Telemetry
description: Clerk collects telemetry data from its SDKs about general product
  and feature usage.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/security/clerk-telemetry
sourceFile: /docs/guides/how-clerk-works/security/clerk-telemetry.mdx
---

Clerk collects telemetry data from its SDKs about general product and feature usage. Participation in telemetry collection is optional and users of the product can opt-out at any time.

## Why is Clerk collecting telemetry data?

While we actively engage with our users and community to gather feedback and inform our product roadmap, the information collected from these efforts only represents a small subset of our users.

Collecting telemetry data gives us a clearer picture into how our SDKs, components, and authentication helpers are used for a diverse set of problems. This data provides valuable insights to help us prioritize features that are useful and impactful for as many of our users as possible.

## What data is being collected?

We track general usage information about our SDKs, components, and authentication helpers from **development instances only**. While we collect identifiers that allows us to associate events with specific Clerk instances, **we do not collect any information from your users**.

Examples of data we are interested in:

* How often are our different components (`<SignIn />`, `<SignUp />`, `<UserProfile />`) rendered?
* What props are being used?
* How are developers utilizing the `appearance` prop on our components?
* What versions of our SDKs are being used?
* What associated framework versions are being used? (e.g. what `next` version is being used along with `@clerk/nextjs`)
* Usage of new features

> \[!NOTE]
> We regularly audit this list to ensure it is an accurate representation of the data we are collecting. To audit telemetry data sent from our SDKs yourself, you can set a `CLERK_TELEMETRY_DEBUG=1` environment variable in your application. In this mode, telemetry events are only logged to the console and not sent to Clerk.

An example event looks like this:

```js {{ prettier: false }}
{
  event: 'COMPONENT_MOUNTED',
  cv: '4.62.1',
  sdk: '@clerk/nextjs',
  sdkv: '4.25.6',
  pk: 'pk_test_YmFsYW5jZWQtY293YmlyZC0xNi5jbGVyay5hY2NvdW50cy5kDXyk',
  payload: { component: 'SignIn', appearanceProp: false },
}
```

* `event` — A unique identifier for the event type.
* `cv` — Clerk Version. The version of the core Clerk library in use.
* `sdk` — SDK. The Clerk SDK that is being used.
* `sdkv` — SDK Version. The version of the Clerk SDK.
* `pk` — Publishable Key. The instance's <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip>.
* `payload` — Each unique event can provide custom data as part of the payload. As seen above, for the `COMPONENT_MOUNTED` event we track the component name and additional data about prop usage.

## What about sensitive data?

We will not collect sensitive data from your application or development environment that is not directly related to your implementation of Clerk's SDKs. Notably, we will not collect: environment variables unrelated to Clerk, any information about your users, file paths, contents of files, logs, git remote information, or raw JavaScript errors.

## How is my data protected?

Clerk takes data privacy and protection seriously. Telemetry data is most useful in aggregate form to gain product insights, and the raw data is only available to a small subset of Clerk employees.

We will never share with or sell telemetry data to third parties. The data is used strictly to help improve the Clerk product.

## How do I opt-out?

### Environment variables

> \[!WARNING]
> Note that the variable name might differ between frameworks. See the [framework specific instructions](#framework-specific-instructions) below.

For meta-framework SDKs, you can opt-out of telemetry collection by setting the environment variable:

```env {{ filename: '.env' }}
CLERK_TELEMETRY_DISABLED=1
```

### `telemetry` prop

If you are using `@clerk/clerk-react` directly, or using an SDK that doesn't have environment variable support, you can opt out by passing the `telemetry` prop to `<ClerkProvider>`:

```tsx
<ClerkProvider telemetry={false} />
```

### Framework specific instructions

<CodeBlockTabs options={["Next.js", "React", "Remix", "JavaScript", "Chrome Extension", "Expo", "Astro", "React Router", "TanStack React Start"]}>
  ```env {{ filename: '.env' }}
  NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED=1
  ```

  ```tsx
  <ClerkProvider telemetry={false} />
  ```

  ```env {{ filename: '.env' }}
  CLERK_TELEMETRY_DISABLED=1
  ```

  ```js
  const clerk = new Clerk(publishableKey)
  c.load({ telemetry: false })
  ```

  ```tsx
  <ClerkProvider telemetry={false} />
  ```

  ```tsx
  <ClerkProvider telemetry={false} />
  ```

  ```env {{ filename: '.env' }}
  PUBLIC_CLERK_TELEMETRY_DISABLED=1
  ```

  ```env {{ filename: '.env' }}
  VITE_CLERK_TELEMETRY_DISABLED=1
  ```

  ```env {{ filename: '.env' }}
  VITE_CLERK_TELEMETRY_DISABLED=1
  ```
</CodeBlockTabs>
---
title: Multi-tenant architecture
description: This guide outlines a number of the common architecture scenarios
  for building B2B, B2C, and Platform applications with Clerk, their
  characteristics, and limitations.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/how-clerk-works/multi-tenant-architecture
sourceFile: /docs/guides/how-clerk-works/multi-tenant-architecture.mdx
---

There are several ways to model how users and Organizations fit into your application. The 3 scenarios that will be covered in this guide are:

1. B2C: Business to Consumer
2. B2B: Business to Business
3. Platforms

We will share some of the common characteristics of apps in each scenario as well as the level of support for these features in Clerk.

## B2C: Business to Consumer

B2C companies focus on selling products or services directly to consumers. Some popular examples are Netflix, Headspace, and Spotify. Clerk supports the B2C user management model out-of-the-box, with little-to-no configuration.

In a B2C scenario, applications generally share the following characteristics:

* A user creates a single account with your service
* There is a single, shared user-pool which all the users belong to
* Any connections enabled for your application are available to all users to authenticate with
* The application branding is that of your company (as in, not white-labelled per customer or organization)
* The application is accessible under a single domain (for example: `example.com` or `app.example.com`)

> \[!NOTE]
> In the B2C scenario, Organizations are generally not necessary since users that sign up to your application typically do not exist as part of a team, organization, or workspace.

## B2B: Business to Business

B2B companies sell to other businesses. Some examples include: GitHub, Vercel, Salesforce, Sentry, and Clerk.

In the B2B model, multi-tenant SaaS applications generally leverage organizations (sometimes called teams or workspaces) to manage users and their memberships. This approach allows for control over what resources users have access to across different organizations based on their Roles.

Oftentimes such applications will also allow users to create <Tooltip><TooltipTrigger>Personal Accounts</TooltipTrigger><TooltipContent>**Personal Accounts** are individual workspaces that allow users to operate independently without belonging to an Organization. Learn more about [Personal Accounts](/docs/guides/organizations/configure#personal-accounts).</TooltipContent></Tooltip> that are separate from other organizations. For example, GitHub allows users to create repositories under their own Personal Account or an organization they are part of.

The user pool for multi-tenant, SaaS applications will generally fall into one of two categories:

1. **Shared user-pool**: the application has a single pool of users. A user can create one account and belong to multiple organizations. The user can have separate Roles in each Organization.
2. **Isolated user-pool**: each organization has its own pool of users. A user must create a separate account for each organization.

> \[!NOTE]
> Clerk supports the **shared user-pool** model for B2B scenarios which will be discussed in this section. The **isolated user-pool** model is more relevant in the Platforms scenario which will be discussed in the next section.

B2B SaaS applications with the following characteristics are well-supported with Clerk:

* A single application deployment that serves multiple business customers (multi-tenant)
* A shared user-pool model where a user can log in with a single account and belong to multiple organizations
* Enabled connections can be available to all users or linked to specific organizations
* The application may carry your own branding or some elements of your customer's branding
* The application is served from a single domain (for example: `app.example.com`)

### Integrating Organizations with your application

Clerk offers a number of building blocks to help integrate Organizations into your application:

* The <SDKLink href="/docs/:sdk:/reference/components/organization/organization-switcher" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<OrganizationSwitcher /> component</SDKLink> provides a way for your users to select which Organization is the <Tooltip><TooltipTrigger>Active Organization</TooltipTrigger><TooltipContent>A user can be a member of multiple Organizations, but only one can be active at a time. The **Active Organization** determines which Organization-specific data the user can access and which Role and related Permissions they have within the Organization.</TooltipContent></Tooltip>. The [`useOrganizationList()` hook](/docs/guides/development/custom-flows/organizations/organization-switcher) can be used for more control.
* The <SDKLink href="/docs/:sdk:/reference/hooks/use-organization" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useOrganization() hook</SDKLink> can be used to fetch the <Tooltip><TooltipTrigger>Active Organization</TooltipTrigger><TooltipContent>A user can be a member of multiple Organizations, but only one can be active at a time. The **Active Organization** determines which Organization-specific data the user can access and which Role and related Permissions they have within the Organization.</TooltipContent></Tooltip>.
* The <SDKLink href="/docs/:sdk:/reference/components/control/protect" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<Protect> component</SDKLink> enables you to limit who can view certain pages based on their role. Additionally, Clerk exposes a number of helper functions, such as <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink>, and hooks, such as <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useAuth()</SDKLink>, to check the user's authorization throughout your app and API endpoints.

The Organization's ID should be stored in your database alongside each resource so that it can be used to filter and query the resources that should be rendered or returned according to the <Tooltip><TooltipTrigger>Active Organization</TooltipTrigger><TooltipContent>A user can be a member of multiple Organizations, but only one can be active at a time. The **Active Organization** determines which Organization-specific data the user can access and which Role and related Permissions they have within the Organization.</TooltipContent></Tooltip>.

## Platforms

> \[!NOTE]
> Today, Clerk does not currently support the Platforms scenario. We are working on [Clerk for Platforms](https://feedback.clerk.com/roadmap/3b40265e-d8ae-41b0-a4b3-9c947d460218) to enable developers building platforms to offer their users Clerk's full range of features and customizability.

In the Platforms scenario, businesses can create multiple, isolated applications with their own user pools, branding, security policies, and limits. Some examples in this scenario are e-commerce platforms like Shopify, e-learning platforms, and mortgage lending platforms.

For example, you may be creating an e-learning platform that allows universities to create courses and enroll students. In this case, each customer would be a university who would have their own set of students, professors, and administrators as their users. Additionally, each university would likely have a custom domain (`courses.example.com`) with their branding where their users can authenticate and use the platform.

In the e-learning platform scenario, the users of one university should be completely isolated from another university and each university might have its own set of authentication strategies and security policies.

The following are some of the most commonly requested features for the Platforms scenario (Clerk for Platforms):

* Vanity domains (`customer.example.com`) or a custom domain (`customer.com`) for each of your customers
* Allow your customers to independently customize their branding, including their authentication screens, SMS and email templates
* Isolated user pools such that users from one customer are logically separated from users of another customer
* Independently enforce different limits based on your customer's subscription (for example: limit their number of users they can invite to an organization)
* Enable your customers to independently configure the authentication policies, enabled connections, and MFA policies available to their users
---
title: Next.js Quickstart (App Router)
description: Add authentication and user management to your Next.js app.
sdk: nextjs, react, js-frontend, chrome-extension, expo, android, ios,
  expressjs, fastify, react-router, remix, tanstack-react-start, go, astro,
  nuxt, vue, ruby, js-backend
llm:
  displayText: Use this pre-built prompt to get started faster.
  src: prompts/nextjs-quickstart.md
sdkScoped: "true"
canonical: /docs/:sdk:/getting-started/quickstart
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs,react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
notAvailableSdks: ""
activeSdk: nextjs
sourceFile: /docs/getting-started/quickstart.mdx
---

<TutorialHero
  exampleRepo={[
    {
      title: "Next.js App Router Quickstart Repo",
      link: "https://github.com/clerk/clerk-nextjs-app-quickstart"
    }
  ]}
/>

<Steps>
  ## Create a new Next.js app

  If you don't already have a Next.js app, run the following commands to [create a new one](https://nextjs.org/docs/getting-started/installation).

  ```npm
  npm create next-app@latest clerk-nextjs -- --yes
  cd clerk-nextjs
  npm install
  ```

  ## Install `@clerk/nextjs`

  The <SDKLink href="/docs/reference/nextjs/overview" sdks={["nextjs"]}>Clerk Next.js SDK</SDKLink> gives you access to prebuilt components, hooks, and helpers to make user authentication easier.

  Run the following command to install the SDK:

  ```npm
  npm install @clerk/nextjs
  ```

  ## Add `clerkMiddleware()` to your app

  <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware()</SDKLink> grants you access to user authentication state throughout your app. It also allows you to protect specific routes from unauthenticated users. To add `clerkMiddleware()` to your app, follow these steps:

    <If sdk="nextjs">
      > \[!IMPORTANT]
      >
      > If you're using Next.js ≤15, name your file `middleware.ts` instead of `proxy.ts`. The code itself remains the same; only the filename changes.
    </If>

  1. Create a `proxy.ts` file.

     * If you're using the `/src` directory, create `proxy.ts` in the `/src` directory.
     * If you're not using the `/src` directory, create `proxy.ts` in the root directory.

  2. In your `proxy.ts` file, export the `clerkMiddleware()` helper:

     ```tsx {{ filename: 'proxy.ts' }}
     import { clerkMiddleware } from '@clerk/nextjs/server'

     export default clerkMiddleware()

     export const config = {
       matcher: [
         // Skip Next.js internals and all static files, unless found in search params
         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
         // Always run for API routes
         '/(api|trpc)(.*)',
       ],
     }
     ```

  3. By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes. See the <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware() reference</SDKLink> to learn how to require authentication for specific routes.

  ## Add `<ClerkProvider>` to your app

  The <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider></SDKLink> component provides session and user context to Clerk's hooks and components. It's recommended to wrap your entire app at the entry point with `<ClerkProvider>` to make authentication globally accessible. See the <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]}>reference docs</SDKLink> for other configuration options.

  Add the `<ClerkProvider>` component to your app's layout, as shown in the following example:

  ```tsx {{ filename: 'app/layout.tsx', mark: [2, 27, 33], fold: [[6, 19]] }}
  import type { Metadata } from 'next'
  import { ClerkProvider } from '@clerk/nextjs'
  import { Geist, Geist_Mono } from 'next/font/google'
  import './globals.css'

  const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
  })

  const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
  })

  export const metadata: Metadata = {
    title: 'Clerk Next.js Quickstart',
    description: 'Generated by create next app',
  }

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
          </body>
        </html>
      </ClerkProvider>
    )
  }
  ```

  ## Create a header with Clerk components

  You can control which content signed-in and signed-out users can see with the <SDKLink href="/docs/:sdk:/reference/components/overview#control-components" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt control components</SDKLink>. The following example creates a header using the following components:

  * <SDKLink href="/docs/:sdk:/reference/components/control/signed-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedIn></SDKLink>: Children of this component can only be seen while **signed in**.
  * <SDKLink href="/docs/:sdk:/reference/components/control/signed-out" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedOut></SDKLink>: Children of this component can only be seen while **signed out**.
  * <SDKLink href="/docs/:sdk:/reference/components/user/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserButton /></SDKLink>: Shows the signed-in user's avatar. Selecting it opens a dropdown menu with account management options.
  * <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-in-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignInButton /></SDKLink>: An unstyled component that links to the sign-in page. In this example, since no props or [environment variables](/docs/guides/development/clerk-environment-variables) are set for the sign-in URL, this component links to the [Account Portal sign-in page](/docs/guides/account-portal/overview#sign-in).
  * <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-up-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignUpButton /></SDKLink>: An unstyled component that links to the sign-up page. In this example, since no props or [environment variables](/docs/guides/development/clerk-environment-variables) are set for the sign-up URL, this component links to the [Account Portal sign-up page](/docs/guides/account-portal/overview#sign-up).

  ```tsx {{ filename: 'app/layout.tsx', mark: [[4, 8], [37, 51]], fold: [[13, 32]] }}
  import type { Metadata } from 'next'
  import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
  import { Geist, Geist_Mono } from 'next/font/google'
  import './globals.css'

  const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
  })

  const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
  })

  export const metadata: Metadata = {
    title: 'Clerk Next.js Quickstart',
    description: 'Generated by create next app',
  }

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              {/* Show the sign-in and sign-up buttons when the user is signed out */}
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              {/* Show the user button when the user is signed in */}
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </body>
        </html>
      </ClerkProvider>
    )
  }
  ```

  ## Run your project

  Run your project with the following command:

  ```npm
  npm run dev
  ```

  ## Create your first user

  1. Visit your app's homepage at [http://localhost:3000](http://localhost:3000).
  2. Select "Sign up" on the page and authenticate to create your first user.

  3. To make configuration changes to your Clerk development instance, claim the Clerk keys that were generated for you by selecting **Claim your application** in the bottom right of your app. This will associate the application with your Clerk account.
</Steps>

## Next steps

Learn more about Clerk components, how to customize them, and how to build custom authentication flows using the following guides.

<Cards>
  * [Prebuilt components](/docs/reference/components/overview)
  * Learn how to quickly add authentication to your app using Clerk's suite of components.

  ***

  * [Customization & localization](/docs/guides/customizing-clerk/appearance-prop/overview)
  * Learn how to customize and localize Clerk components.

  ***

  * [Create a custom sign-in-or-up page](/docs/nextjs/guides/development/custom-sign-in-or-up-page)
  * Learn how to create a custom sign-in-or-up page with Clerk components.

  ***

  * [Protect content and read user data](/docs/nextjs/guides/users/reading)
  * Learn how to use Clerk's hooks and helpers to protect content and read user data in your Next.js app.

  ***

  * [Get started with Organizations](/docs/nextjs/guides/organizations/getting-started)
  * Learn how to create and manage Organizations in your Next.js app.

  ***

  * [Clerk Next.js SDK Reference](/docs/reference/nextjs/overview)
  * Learn about the Clerk Next.js SDK and how to integrate it into your app.
</Cards>
---
title: Next.js Quickstart (Pages Router)
description: Add authentication and user management to your Next.js app with Clerk.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/getting-started/quickstart/pages-router
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/getting-started/quickstart/pages-router.mdx
---

<TutorialHero
  exampleRepo={[
    { 
      title: "Next.js Pages Router Quickstart Repo",
      link: "https://github.com/clerk/clerk-nextjs-pages-quickstart"
    }
  ]}
  beforeYouStart={[
    {
      title: "Set up a Clerk application",
      link: "/docs/getting-started/quickstart/setup-clerk",
      icon: "clerk",
    }
  ]}
/>

<Steps>
  ## Create a new Next.js app

  If you don't already have a Next.js app (Pages Router), run the following commands to [create a new one](https://nextjs.org/docs/pages/getting-started/installation).

  ```npm
  npm create next-app@latest clerk-nextjs-pages -- --no-app
  cd clerk-nextjs-pages
  npm install
  ```

  ## Install `@clerk/nextjs`

  The <SDKLink href="/docs/reference/nextjs/overview" sdks={["nextjs"]}>Clerk Next.js SDK</SDKLink> gives you access to prebuilt components, hooks, and helpers to make user authentication easier.

  Run the following command to install the SDK:

  ```npm
  npm install @clerk/nextjs
  ```

  ## Set your Clerk API keys

    <SignedIn>
      Add the following keys to your `.env` file. These keys can always be retrieved from the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.
    </SignedIn>

    <SignedOut>
      1. In the Clerk Dashboard, navigate to the [**API keys**](https://dashboard.clerk.com/~/api-keys) page.
      2. In the **Quick Copy** section, copy your Clerk <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip> and <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip>.
      3. Paste your keys into your `.env` file.

      The final result should resemble the following:
    </SignedOut>

  ```env {{ filename: '.env' }}
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={{pub_key}}
  CLERK_SECRET_KEY={{secret}}
  ```

  ## Add `clerkMiddleware()` to your app

  <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware()</SDKLink> grants you access to user authentication state throughout your app. It also allows you to protect specific routes from unauthenticated users. To add `clerkMiddleware()` to your app, follow these steps:

    <If sdk="nextjs">
      > \[!IMPORTANT]
      >
      > If you're using Next.js ≤15, name your file `middleware.ts` instead of `proxy.ts`. The code itself remains the same; only the filename changes.
    </If>

  1. Create a `proxy.ts` file.
     * If you're using the `/src` directory, create `proxy.ts` in the `/src` directory.
     * If you're not using the `/src` directory, create `proxy.ts` in the root directory alongside `.env`.
  2. In your `proxy.ts` file, export the `clerkMiddleware()` helper:

     ```tsx {{ filename: 'proxy.ts' }}
     import { clerkMiddleware } from '@clerk/nextjs/server'

     export default clerkMiddleware()

     export const config = {
       matcher: [
         // Skip Next.js internals and all static files, unless found in search params
         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
         // Always run for API routes
         '/(api|trpc)(.*)',
       ],
     }
     ```
  3. By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes. See the <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware() reference</SDKLink> to learn how to require authentication for specific routes.

  ## Add `<ClerkProvider>` to your app

  The <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider></SDKLink> component provides session and user context to Clerk's hooks and components. It's recommended to wrap your entire app at the entry point with `<ClerkProvider>` to make authentication globally accessible. See the <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]}>reference docs</SDKLink> for other configuration options.

  Add the `<ClerkProvider>` component to your app, as shown in the following example:

  ```tsx {{ filename: 'pages/_app.tsx', mark: [2, [7, 12], 14] }}
  import '@/styles/globals.css'
  import { ClerkProvider } from '@clerk/nextjs'
  import type { AppProps } from 'next/app'

  function MyApp({ Component, pageProps }: AppProps) {
    return (
      <ClerkProvider
        {...pageProps}
        appearance={{
          cssLayerName: 'clerk',
        }}
      >
        <Component {...pageProps} />
      </ClerkProvider>
    )
  }

  export default MyApp
  ```

  ## Update `globals.css`

  In the previous step, the `cssLayerName` property is set on the `<ClerkProvider>` component. Now, you need to **add the following line to the top of your `globals.css` file** in order to include the layer you named in the `cssLayerName` property. The example names the layer `clerk` but you can name it anything you want. These steps are necessary for v4 of Tailwind as it ensures that Tailwind's utility styles are applied after Clerk's styles.

  ```css {{ filename: 'globals.css' }}
  + @layer theme, base, clerk, components, utilities;
    @import 'tailwindcss';
  ```

  ## Create a header with Clerk components

  You can control which content signed-in and signed-out users can see with the <SDKLink href="/docs/:sdk:/reference/components/overview#control-components" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt control components</SDKLink>. The following example creates a header using the following components:

  * <SDKLink href="/docs/:sdk:/reference/components/control/signed-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedIn></SDKLink>: Children of this component can only be seen while **signed in**.
  * <SDKLink href="/docs/:sdk:/reference/components/control/signed-out" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedOut></SDKLink>: Children of this component can only be seen while **signed out**.
  * <SDKLink href="/docs/:sdk:/reference/components/user/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserButton /></SDKLink>: Shows the signed-in user's avatar. Selecting it opens a dropdown menu with account management options.
  * <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-in-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignInButton /></SDKLink>: An unstyled component that links to the sign-in page. In this example, since no props or [environment variables](/docs/guides/development/clerk-environment-variables) are set for the sign-in URL, this component links to the [Account Portal sign-in page](/docs/guides/account-portal/overview#sign-in).
  * <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-up-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignUpButton /></SDKLink>: An unstyled component that links to the sign-up page. In this example, since no props or [environment variables](/docs/guides/development/clerk-environment-variables) are set for the sign-up URL, this component links to the [Account Portal sign-up page](/docs/guides/account-portal/overview#sign-up).

  ```tsx {{ filename: 'pages/_app.tsx', mark: [[4, 8], [20, 34]] }}
  import '@/styles/globals.css'
  import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
  import type { AppProps } from 'next/app'

  function MyApp({ Component, pageProps }: AppProps) {
    return (
      <ClerkProvider
        {...pageProps}
        appearance={{
          cssLayerName: 'clerk',
        }}
      >
        <header className="flex justify-end items-center p-4 gap-4 h-16">
          {/* Show the sign-in and sign-up buttons when the user is signed out */}
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          {/* Show the user button when the user is signed in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <Component {...pageProps} />
      </ClerkProvider>
    )
  }

  export default MyApp
  ```

  ## Run your project

  Run your project with the following command:

  ```npm
  npm run dev
  ```

  ## Create your first user

  1. Visit your app's homepage at [http://localhost:3000](http://localhost:3000).
  2. Select "Sign up" on the page and authenticate to create your first user.
</Steps>

## Next steps

Learn more about Clerk components, how to customize them, and how to build custom authentication flows using the following guides.

<Cards>
  * [Prebuilt components](/docs/reference/components/overview)
  * Learn how to quickly add authentication to your app using Clerk's suite of components.

  ***

  * [Customization & localization](/docs/guides/customizing-clerk/appearance-prop/overview)
  * Learn how to customize and localize Clerk components.

  ***

  * [Create a custom sign-in-or-up page](/docs/nextjs/guides/development/custom-sign-in-or-up-page)
  * Learn how to create a custom sign-in-or-up page with Clerk components.

  ***

  * [Protect content and read user data](/docs/nextjs/guides/users/reading)
  * Learn how to use Clerk's hooks and helpers to protect content and read user data in your Next.js app.

  ***

  * [Get started with Organizations](/docs/nextjs/guides/organizations/getting-started)
  * Learn how to create and manage Organizations in your Next.js app.

  ***

  * [Clerk Next.js SDK Reference](/docs/reference/nextjs/overview)
  * Learn about the Clerk Next.js SDK and how to integrate it into your app.
</Cards>
---
title: Core concepts
description: Learn about the main concepts and objects that drive Clerk's
  powerful authentication and user management system.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/getting-started/core-concepts
sourceFile: /docs/getting-started/core-concepts.mdx
---

Before building your application, it's important to understand the core concepts and objects that drive Clerk's powerful authentication and user management system. This page walks through integration options, prebuilt components, configuration steps, and the key objects you'll use as you build your application.

## Ways to implement Clerk

Clerk provides three ways to integrate authentication into your application, depending on the level of control and customization you need:

1. **[Account Portal](/docs/guides/account-portal/overview) (default)**: Uses Clerk's prebuilt components on dedicated pages that are hosted on Clerk servers. Every Clerk application has this enabled by default, providing a complete user management interface out of the box.
2. **<SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>Prebuilt components</SDKLink>**: All-in-one UI components that can be integrated into your application. They are fully customizable to match your application's branding and design. This is the recommended approach for most use cases.
3. **<Tooltip><TooltipTrigger>Custom flows</TooltipTrigger><TooltipContent>A **custom flow** refers to a user interface built entirely from scratch using the Clerk API. Learn more about [custom flows](/docs/guides/development/custom-flows/overview).</TooltipContent></Tooltip> using the Clerk API**: Build your own UI using the Clerk API. This option provides maximum flexibility and control over the user experience but requires more development effort.

Clerk offers a comprehensive suite of prebuilt components designed to seamlessly integrate authentication and multi-tenancy into your application. Components, like `<SignIn />`, `<UserButton />`, and `<OrganizationSwitcher />`, are all-in-one solutions that handle the full lifecycle of the user experience, from sign-up/sign-in to user profile and Organization management.

The Account Portal uses these components on dedicated pages that are hosted on Clerk servers. These pages cannot be customized beyond the options provided in the [Clerk Dashboard](https://dashboard.clerk.com/~/account-portal).

For more control and customization, you can migrate away from the Account Portal and embed the prebuilt components directly into your own application pages. While they are <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>fully customizable</SDKLink> to match your application's branding and design using CSS or special props, the HTML structure and the logic/ordering of the authentication flow remain fixed.

If the prebuilt components don't meet your specific needs or if you need complete control over the logic, you can rebuild the existing Clerk flows using the Clerk API. However, this is more advanced and it's recommended to use the prebuilt components whenever possible.

> \[!TIP]
> Most applications usually progress from the Account Portal to prebuilt components as they grow, with custom flows used for advanced cases.

## Configuring your application

Configuring your application is done through the [Clerk Dashboard](https://dashboard.clerk.com). The Clerk Dashboard is where you, as the application owner, can manage your application's settings, users, and organizations.

For example, you can:

* Enable phone number authentication or multi-factor authentication.
* Add social providers like Google.
* Delete users or create Organizations.
* Invite other users to your [workspace](/docs/guides/dashboard/overview#workspaces) to help configure and manage your application.

To get started, see the [configuration docs](/docs/guides/configure/auth-strategies/sign-up-sign-in-options), which include dedicated guides for specific configuration options.

## Building your application

### Session token

When a user is authenticated in your application, Clerk generates a short-lived session token that you can use to authenticate requests to your backend. This token is a JSON Web Token (JWT) that contains information about the user and their session.

Read more about Clerk session tokens and how they work in [the guide on how Clerk works](/docs/guides/how-clerk-works/overview).

### Key Clerk objects

The Clerk JavaScript SDK, or ClerkJS, is where Clerk all started. It is the core SDK that powers all other JavaScript SDKs, including React and Next.js. As you build, you'll likely interact with the following objects.

#### Clerk

The [`Clerk`](/docs/reference/javascript/clerk) class is the main entry point for the Clerk JavaScript SDK. All other objects are accessible from the `Clerk` object. As you're building your application, you'll likely interact with these objects, either directly or through helpers provided by the other SDKs, like React hooks or Vue composables.

#### Client

A client represents the current device or software accessing an application such as your web browser, native application, or Chrome Extension. It is represented by the [`Client`](/docs/reference/javascript/client) object.

#### Session

A session is a secure representation of the authentication state of the current user. Each client can hold multiple sessions on the same device. It is represented by the [`Session`](/docs/reference/javascript/session) object.

#### User

The [`User`](/docs/reference/javascript/user) object represents the current user of the session. It holds all the basic user information such as the user's name, email addresses, and phone numbers, and including their public, private, and unsafe metadata.

#### Organization

Organizations are a flexible and scalable way to manage users and their access to resources within your Clerk application. With Organizations, you can assign specific Roles and Permissions to users, making them useful for managing projects, coordinating teams, or facilitating partnerships.

Users can belong to many Organizations. One of them will be the <Tooltip><TooltipTrigger>Active Organization</TooltipTrigger><TooltipContent>A user can be a member of multiple Organizations, but only one can be active at a time. The **Active Organization** determines which Organization-specific data the user can access and which Role and related Permissions they have within the Organization.</TooltipContent></Tooltip> of the session. It is represented by the [`Organization`](/docs/reference/javascript/organization) object. To learn about Organizations, see the [dedicated guide](/docs/guides/organizations/overview).

#### Sign in

The [`SignIn`](/docs/reference/javascript/sign-in) object holds the state of the current sign-in and provides helper methods to navigate and complete the sign-in process. It is used to manage the sign-in lifecycle, including the <Tooltip><TooltipTrigger>first</TooltipTrigger><TooltipContent>**First factor** is the first factor of authentication that is required to complete the authentication process. For example, when a user signs in with email and password, the password is the first factor. **First factor verification** is the process of verifying a user's identity using a single factor. This can be compared to <Tooltip><TooltipTrigger>second factor verification</TooltipTrigger><TooltipContent>**Second factor verification**, also known as two-factor authentication (2FA) or [multi-factor authentication (MFA)](/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication), is the process of verifying a user's identity using an additional factor. For example, if a user signs in with their email and password, and then, is asked to also provide an <Tooltip><TooltipTrigger>OTP</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> sent to their phone number, the OTP is the <Tooltip><TooltipTrigger>second factor</TooltipTrigger><TooltipContent>A **second factor** is an additional factor of authentication that is required to complete the authentication process. For example, if a user signs in with their email and password, and then is asked to also provide an <Tooltip><TooltipTrigger>OTP</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> sent to their email in order to verify their identity, the email OTP is the second factor.</TooltipContent></Tooltip>.</TooltipContent></Tooltip>, also known as two-factor authentication (2FA) or multi-factor authentication (MFA), where the user needs to provide an additional factor to verify their identity.</TooltipContent></Tooltip> and <Tooltip><TooltipTrigger>second</TooltipTrigger><TooltipContent>**Second factor verification**, also known as two-factor authentication (2FA) or [multi-factor authentication (MFA)](/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication), is the process of verifying a user's identity using an additional factor. For example, if a user signs in with their email and password, and then, is asked to also provide an <Tooltip><TooltipTrigger>OTP</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> sent to their phone number, the OTP is the <Tooltip><TooltipTrigger>second factor</TooltipTrigger><TooltipContent>A **second factor** is an additional factor of authentication that is required to complete the authentication process. For example, if a user signs in with their email and password, and then is asked to also provide an <Tooltip><TooltipTrigger>OTP</TooltipTrigger><TooltipContent>A **one-time password (OTP)** is a code that is used to authenticate a user. The OTP is typically sent to a user's email address or phone number and must be entered within a certain time period to be valid.</TooltipContent></Tooltip> sent to their email in order to verify their identity, the email OTP is the second factor.</TooltipContent></Tooltip>.</TooltipContent></Tooltip> factor verification, and the creation of a new session.

#### Sign up

The [`SignUp`](/docs/reference/javascript/sign-up) object holds the state of the current sign-up and provides helper methods to navigate and complete the sign-up process. Once a sign-up is complete, a new user is created.

## Deep dive

For a deeper dive into how Clerk works, like how our authentication model works, see the [dedicated guide](/docs/guides/how-clerk-works/overview).
---
title: Clerk Billing
description: Clerk Billing is a feature that allows you to create and manage
  Plans and Features for your application.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/billing/overview
sourceFile: /docs/guides/billing/overview.mdx
---

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

Clerk Billing allows your customers to purchase recurring Subscriptions to your application. To get started, **choose one or combine both of the following** business models depending on your application's needs.

<Cards>
  * [Billing for B2C SaaS](/docs/guides/billing/for-b2c)
  * To charge individual users

  ***

  * [Billing for B2B SaaS](/docs/guides/billing/for-b2b)
  * To charge companies or organizations

  ***

  * [Webhooks](/docs/guides/development/webhooks/billing)
  * To track Subscription lifecycles and monitor payment attempts

  ***

  * [Build a simple checkout page](/docs/guides/development/custom-flows/billing/checkout-new-payment-method)
  * To charge users with a new payment method
</Cards>

## Frequently asked questions (FAQ)

### Can I use an existing Stripe account with Clerk Billing?

Yes, you can. However, it must not already be linked to another platform.

### Can I see Subscriptions in my Stripe account?

Clerk Billing only uses Stripe for payment processing. You can see payment and customer information in Stripe. However, Clerk Billing is a separate product from Stripe Billing; Plans and Subscriptions made in Clerk are not synced to Stripe.

### Can I use the same Stripe account for both dev and prod environments?

No. Stripe accounts created for development instances are sandbox/test accounts and cannot be used for production. For a production environment, you must create a separate Stripe account.

### Does Clerk Billing support refunds?

No, Clerk Billing does not support refunds at this time. You can still issue a refund through your Stripe account. Please note that refunds performed in Stripe will not be reflected in income/MRR calculations.

### Is Clerk a Merchant of Record (MoR) for transactions?

No, Clerk does not provide this service.

### Does Clerk Billing support non-USD currencies?

Clerk Billing currently supports only USD as the billing currency. While you can connect both US and non-US Stripe accounts, all payments will be processed in USD regardless of your Stripe account's local currency. For information about Stripe's supported countries and currencies, see [Stripe Global](https://stripe.com/global){{ rel: 'noopener noreferrer' }}. Support for additional currencies is on our roadmap.

### What third-party tools does Clerk Billing integrate with?

None directly, but since payments are processed through Stripe, you can use any third-party tool that integrates with Stripe for analytics, reporting, invoicing, or tax compliance.

### Can I offer custom pricing plans to specific customers?

Yes, Clerk Billing supports custom pricing plans. See [Custom Plans and prices](/docs/guides/billing/custom-plans) for more information.

### Can I let users upgrade or downgrade their plans mid-cycle?

Yes. Plan upgrades will take effect immediately, while downgrades take effect at the end of the current billing cycle.

### Does Clerk Billing support annual Subscriptions?

Yes, you can offer subscribers the option to pay annually, at a discounted monthly price. Annual pricing for your plans can be configured from the [**Subscription plans**](https://dashboard.clerk.com/~/billing/plans) page in the Clerk Dashboard. Customers can choose between monthly or annual billing when subscribing.

### How does Clerk handle taxes and VAT for international billing?

Clerk Billing does not currently support tax or VAT, but these are planned for future releases.

### How can I test failure scenarios like expired cards or canceled Subscriptions?

You can simulate failures in Stripe test mode using test cards that trigger specific behaviors. See [Stripe Testing](https://docs.stripe.com/testing){{ rel: 'noopener noreferrer' }} for a list of test cards and behaviors.

### Which countries is Clerk Billing not supported in?

Clerk Billing is not supported in Brazil, India, Malaysia, Mexico, Singapore, and Thailand due to [payment processing restrictions](https://stripe.com/legal/restricted-businesses). Support may be added in the future. For all other regions, availability depends on Stripe - see [Stripe Global](https://stripe.com/global){{ rel: 'noopener noreferrer' }} for the full list.

### Does Clerk Billing support additional factor authentication like 3D Secure?

Clerk Billing does not currently support additional factor authentication. Users will receive an error indicating that the provided payment method requires additional confirmation, which Clerk Billing does not support, and will be asked to use a different payment method.
---
title: Clerk Billing for B2C SaaS
description: Clerk Billing is a feature that allows you to create and manage
  Plans and Features for your application.
sdk: nextjs, react, expo, react-router, astro, tanstack-react-start, remix,
  nuxt, vue, js-frontend, expressjs, fastify, js-backend
sdkScoped: "true"
canonical: /docs/:sdk:/guides/billing/for-b2c
lastUpdated: 2026-02-10T20:55:59.000Z
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
---
title: Free trials
description: Let users try paid Features before subscribing
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/billing/free-trials
sourceFile: /docs/guides/billing/free-trials.mdx
---

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

Free trials let your users explore paid [Features](/docs/guides/secure/features) for a limited time for free, helping them build confidence in a purchase decision. With Clerk Billing, you can turn on free trials for any Plan, or set the same trial period across all your Plans.

## Enable free trials

To enable free trials for your Plans:

1. Navigate to the [**Subscription plans**](https://dashboard.clerk.com/~/billing/plans) page in the Clerk Dashboard.
2. Select the Plan you want to enable free trials on.
3. Enable **Free trial** and set the number of trial days (minimum is 1 day).

## What your users experience

### Starting a trial

Only users who have never paid for a Subscription and have never used a free trial can start a free trial.

A credit card is required to start a free trial. This helps prevent abuse and ensures a smooth transition to paid service when the trial ends.

### During a trial

Users get access to the Plan's paid Features for the configured number of days. If they cancel during their trial, they keep access until the original trial end date.

### When the trial ends

If the user didn't cancel their Subscription during the trial, they are charged using their default payment method on file. This may be a different payment method than the one used during checkout when the trial started.

If the user cancels their Subscription during the trial, they lose access at the end of the trial and are moved back to the free Plan. They are not charged.

Both you and your users will receive notifications when a trial is about to expire:

* You'll receive a `subscriptionItem.freeTrialEnding` webhook event 3 days before the trial expires.
* Users receive an email notification 3 days before their trial expires.

If the trial period is shorter than 3 days, these notifications are sent immediately when the trial begins.

## Manage trials

You can manually change the duration of a user's trial:

* **Cancel at the end of the trial**: Cancel the trial while allowing the user to keep access to the paid Features until the trial period ends. This prevents their default payment method from being charged when the trial period ends.
* **End immediately**: Immediately move the user back to the free Plan and terminate their access to the paid Features they were trialing.
* **Extend a trial**: Make a user's trial last longer. You must extend a trial by at least 1 day and no more than 365 days.

You can only manage the trial of a user while the trial is active. Once a trial ends, you can no longer extend or cancel it.

To manage a trial for a Subscription:

1. Navigate to the [**Billing**](https://dashboard.clerk.com/~/billing) page in the Clerk Dashboard.
2. Select the user whose trial you want to manage.
3. Under **Subscriptions**, select the **...** menu to see the available actions for managing the trial.
---
title: Default Plans
description: Learn more about default Plans and how they work in Clerk Billing
lastUpdated: 2026-02-10T20:55:59.000Z
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
title: Custom Plans and prices
description: Transition Subscriptions between Plans and create custom pricing
  for your customers
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/billing/custom-plans
sourceFile: /docs/guides/billing/custom-plans.mdx
---

> \[!WARNING]
>
> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](/docs/pinning) your SDK and `clerk-js` package versions.

Custom Plans and prices allow you to transition active Subscriptions between different Billing Plans. You can switch a customer's Subscription Item from one price to another while maintaining a smooth billing experience — whether you're upgrading them from free to paid, moving between paid tiers, or applying custom pricing.

## Use cases

This Subscription management feature simplifies essential Billing workflows:

* **Promotional offers** - Apply special pricing to existing subscribers.
* **Tiered upgrades and downgrades** - Move customers between different paid Plans based on their needs or usage.
* **Plan migrations** - Transition customers to new pricing structures as your product evolves.

## Update Subscription Plans or prices

You can update the price or Plan of an existing Subscription Item [in the Clerk Dashboard](#using-the-clerk-dashboard) or [using the Backend API](#using-the-backend-api).

### Using the Clerk Dashboard

To change the price or Plan of an existing Subscription Item:

1. Navigate to the [**Billing**](https://dashboard.clerk.com/~/billing/subscriptions) page in the Clerk Dashboard.
2. Under **Subscription activity**, select the subscriber whose plan or pricing you want to update.
3. Select the **...** menu next to the Subscription Item you want to update.
4. Choose **Change price** or **Change plan** as needed.

If none of the existing pricing options meet your needs, you can create a custom price:

1. When updating a Subscription Item, select **Create new price**.
2. Configure the pricing details.
3. Use the new price immediately for your Subscription transition.

This is useful for creating one-off pricing arrangements for specific customers.

### Using the Backend API

Using the Backend API to transition Subscription Items is useful for automating Plan changes or building custom billing workflows.

The following example demonstrates how to transition a Subscription Item from one price to another using a cURL command.

<SignedIn>
  * Your <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip> is already injected into the code snippet.
  * Replace the `subi_123` with the ID of the Subscription Item you want to transition.
  * Replace the `cprice_123` with the ID of the price you want to transition from.
  * Replace the `cprice_456` with the ID of the price you want to transition to.
</SignedIn>

<SignedOut>
  * Replace `YOUR_SECRET_KEY` with your Clerk <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip>.
  * Replace the `subi_123` with the ID of the Subscription Item you want to transition.
  * Replace the `cprice_123` with the ID of the price you want to transition from.
  * Replace the `cprice_456` with the ID of the price you want to transition to.
</SignedOut>

```bash
curl 'https://api.clerk.com/v1/billing/subscription_items/{subi_123}/price_transition' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {{secret}}' \
  --data '{
  "from_price_id": "cprice_123",
  "to_price_id": "cprice_456"
}'
```

For complete API documentation, see the [Create price transition endpoint](/docs/reference/backend-api/tag/billing/post/billing/subscription_items/\{subscription_item_id}/price_transition){{ target: '_blank' }}.

## How transitions work

When you create a price transition, Clerk handles all the timing and billing logic automatically. The behavior depends on the type of transition:

### Free-to-paid transitions

**New customers with no active Subscription**

When transitioning a customer from free to a paid Plan with no other active Subscription, the paid Plan activates immediately and the customer is charged right away.

*Example:* Moving a customer on the default Plan to Pro ($50/month). Pro activates immediately, customer is charged $50.

**Customers with a canceled Subscription**

Canceled Subscriptions are active Subscriptions that are scheduled to end in the future. When transitioning from free to paid and the customer has a canceled Subscription, the new paid Plan is scheduled as *upcoming* to avoid billing conflicts.

*Example:* A customer has an active Pro Subscription (canceled, expires March 20) with the default Plan scheduled as upcoming. When you transition the upcoming default Plan to Enterprise, Enterprise becomes the new upcoming Plan and will activate on March 20 instead of the default Plan.

### Paid-to-paid transitions

When a customer already has an active paid Subscription, the new Plan is scheduled to start when their current billing period ends to prevent double-billing.

*Example:* Upgrading a customer from Basic ($20/month, paid through Feb 15) to Enterprise ($35/month) on Jan 15:

* Basic remains active through Feb 15 (already paid for)
* Enterprise becomes *upcoming* and activates Feb 15 (customer is charged then)
* No double-billing for overlapping periods

### Paid-to-free transitions

When transitioning from paid to free, the default Plan is scheduled as *upcoming*, allowing the customer's current paid Subscription to run through its paid period before automatically activating the default Plan.
---
title: Account Portal overview
description: The Account Portal offers a comprehensive solution for managing
  user authentication and profile management in your web application and is the
  fastest way to add Clerk's authentication to your application with minimal
  code required.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/account-portal/overview
sourceFile: /docs/guides/account-portal/overview.mdx
---

The Account Portal in Clerk is a powerful feature that allows you to streamline the sign-in, sign-up, and profile management experience for your users, without having to build your own components or host your own pages. **To integrate the Account Portal with your application, see the [setup guide](/docs/guides/account-portal/getting-started).**

![Account Portal](/docs/images/account-portal/account_portal_splash.png)

## Why use the Account Portal?

The Account Portal provides the pages necessary for your users to sign-up, sign-in, and manage their accounts, all while maintaining seamless integration with your application. These pages are hosted on Clerk servers for you and they require minimal setup to get started. If you're looking for the fastest way to add authentication and user management to your application, then this is a great choice.

However, if you require more precise customization or prefer having your application self-contained, then you can use Clerk's fully customizable <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink>, or you can build your own [custom user interface using the Clerk API](/docs/guides/development/custom-flows/overview).

## How the Account Portal works

The Account Portal uses Clerk's <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink>, which are embedded into dedicated pages hosted on Clerk servers.

![Account Portal](/docs/images/account-portal/account_portal_how_it_works.png)

After a user has finished their flow in an Account Portal page, Clerk automatically redirects them back to your application along with the required authentication context. This way, users are automatically redirected to and from your application for a seamless experience.

For each application environment, Clerk provides pages for sign-up, sign-in, user profile, organization profile, and organization creation flow. To integrate the Account Portal into your application, see the [setup guide](/docs/guides/account-portal/getting-started).

### Customizing your pages

These pages cannot be customized beyond the options provided in the [Clerk Dashboard](https://dashboard.clerk.com). If you need more customization such as [localization](/docs/guides/customizing-clerk/localization), consider using <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink> or building your own [custom user interface](/docs/guides/development/custom-flows/overview).

## Available Account Portal pages

### Sign-in

The sign-in page hosts the prebuilt <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink> component, which renders a UI for signing in users. The functionality of the `<SignIn />` component is controlled by the instance settings you specify in the [Clerk Dashboard](https://dashboard.clerk.com), such as [sign-up and sign-in options](/docs/guides/configure/auth-strategies/sign-up-sign-in-options) and [social connections](/docs/guides/configure/auth-strategies/social-connections/overview). The `<SignIn />` component also displays any <Tooltip><TooltipTrigger>session tasks</TooltipTrigger><TooltipContent>**Session tasks** are requirements that users must fulfill in order to complete the authentication process, such as choosing an Organization.</TooltipContent></Tooltip> that are required for the user to complete after signing in.

![The Account Portal sign-in page hosts the \<SignIn /> component](/docs/images/account-portal/sign-in.png)

Redirect users to the sign-in page using the <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-sign-in" sdks={["chrome-extension","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToSignIn /></SDKLink> control component.

### Sign-up

The sign-up page hosts the prebuilt <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-up" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignUp /></SDKLink> component, which renders a UI for signing up users. The functionality of the `<SignUp />` component is controlled by the instance settings you specify in the [Clerk Dashboard](https://dashboard.clerk.com), such as [sign-up and sign-in options](/docs/guides/configure/auth-strategies/sign-up-sign-in-options) and [social connections](/docs/guides/configure/auth-strategies/social-connections/overview). The `<SignUp />` component also displays any <Tooltip><TooltipTrigger>session tasks</TooltipTrigger><TooltipContent>**Session tasks** are requirements that users must fulfill in order to complete the authentication process, such as choosing an Organization.</TooltipContent></Tooltip> that are required for the user to complete after signing up.

![The Account Portal sign-up page hosts the \<SignUp /> component](/docs/images/account-portal/sign-up.png)

Redirect users to the sign-up page using the <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-sign-up" sdks={["chrome-extension","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToSignUp /></SDKLink> control component.

### User profile

The user profile page hosts the prebuilt <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component, which renders a beautiful, full-featured account management UI that allows users to manage their profile and security settings.

![The Account Portal user profile page hosts the \<UserProfile /> component](/docs/images/account-portal/user-profile.png)

Redirect your authenticated users to their user profile page using the <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-user-profile" sdks={["nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToUserProfile /></SDKLink> control component.

### Unauthorized sign-in

The unauthorized sign-in page doesn't host any prebuilt Clerk component. It displays a UI confirming that a session from an unrecognized device was successfully revoked. For more information, see the [Unauthorized sign-in](/docs/guides/secure/best-practices/unauthorized-sign-in) feature.

The unauthorized sign-in page displays a UI confirming that a session from an unrecognized device was successfully revoked. For more information, refer to [the reference.](/docs/guides/secure/best-practices/unauthorized-sign-in)

![Clerk's Account Portal unauthorized sign-in page](/docs/images/account-portal/unauthorized-sign-in.png)

### Create Organization

The create Organization page hosts the prebuilt <SDKLink href="/docs/:sdk:/reference/components/organization/create-organization" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<CreateOrganization /></SDKLink> component, which provides a streamlined interface for users to create new Organizations within your application.

![The Account Portal create Organization page hosts the \<CreateOrganization /> component](/docs/images/account-portal/create-org.png)

Redirect your authenticated users to the create Organization page using the <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-create-organization" sdks={["nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToCreateOrganization /></SDKLink> control component.

### Organization Profile

The Organization profile page hosts the prebuilt <SDKLink href="/docs/:sdk:/reference/components/organization/organization-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<OrganizationProfile /></SDKLink> component, which renders a beautiful, full-featured Organization management UI that allows users to manage their Organization profile and security settings.

![The Account Portal Organization Profile page hosts the \<OrganizationProfile /> component](/docs/images/account-portal/org-profile.png)

Redirect your authenticated users to their Organization Profile page using the <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-organization-profile" sdks={["nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToOrganizationProfile /></SDKLink> control component.

### Waitlist

The waitlist page hosts the prebuilt <SDKLink href="/docs/:sdk:/reference/components/authentication/waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<Waitlist /></SDKLink> component which renders a form that allows users to join for early access to your app.

![The Account Portal waitliste page hosts the \<Waitlist /> component](/docs/images/account-portal/waitlist.png)
---
title: Getting started with the Account Portal
description: The Account Portal offers a comprehensive solution for managing
  user authentication and profile management in your web application and is the
  fastest way to add Clerk's authentication to your application with minimal
  code required.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/account-portal/getting-started
sourceFile: /docs/guides/account-portal/getting-started.mdx
---

To integrate the Account Portal into your application, simply follow one of the [quickstart guides](/docs/getting-started/quickstart/overview). Once your application is set up, all you have to do is run it. Clerk will automatically redirect your users to the Account Portal sign-up/sign-in pages. After successful authentication, users will be redirected back to your application with an active session.

You can also integrate the Account Portal into your application using prebuilt components. For example, the <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-up-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignUpButton></SDKLink> and <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-in-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignInButton></SDKLink> components will redirect users to the Account Portal sign-up and sign-in pages if no props or [environment variables](/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) are configured to override this behavior.

> \[!NOTE]
> **Dynamic Development Host Detection**
>
> For development environments, the development host (e.g. [http://localhost:3000](http://localhost:3000)) is dynamically detected by Clerk at runtime and tied to your client browser. We store this as the 'home origin' for your application and it is equivalent to your application domain in production environments.

## Accessing your pages

For development environments, Clerk will issue you a randomly generated domain on "accounts.dev". In production, by default, the URLs for your Account Portal are the following:

```sh
https://accounts.<your-domain>.com/sign-in
https://accounts.<your-domain>.com/sign-up
https://accounts.<your-domain>.com/user
https://accounts.<your-domain>.com/unauthorized-sign-in
https://accounts.<your-domain>.com/organization
https://accounts.<your-domain>.com/create-organization
```

To access these links, in the Clerk Dashboard, go to the [**Account Portal**](https://dashboard.clerk.com/~/account-portal) page and then open the **Pages** tab.
---
title: Customizing Clerk
description: An overview of all customization options in Clerk, including UI
  styling, navigation menus, localization, and email and SMS templates.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/customizing-clerk/overview
sourceFile: /docs/guides/customizing-clerk/overview.mdx
---

Clerk provides multiple layers of UI customization, along with tools for tailoring navigation menus, email and SMS templates, and localized content. This guide provides an overview of all available customization options and helps you determine which approach best fits your application.

## Customization layers

> \[!IMPORTANT]
> Native applications (iOS and Android) use their own theming and customization system. They use <SDKLink href="/docs/:sdk:/guides/customizing-clerk/clerk-theme" sdks={["ios","android"]} code={true}>ClerkTheme</SDKLink> to control the appearance of Clerk views, allowing you to customize colors, fonts, and other design properties for a consistent visual experience across all screens.

Clerk offers a flexible, layered approach to UI customization. Whether you just want to adjust colors and variables or build a fully custom experience using Clerk's headless APIs, you can choose the level of control that fits your needs.

This section will help you select the right customization layer for your application.

### Themes

Clerk provides several <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/themes" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>prebuilt themes</SDKLink>, including a <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/themes#shadcn-theme" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]} code={true}>shadcn theme</SDKLink> that adapts Clerk's prebuilt components to match your `shadcn` styling. All themes are defined through the `appearance` prop and can be packaged as standalone, shareable theme files. Use themes if you want consistent styling across teams or applications, or when one of Clerk's prebuilt themes already aligns with your brand.

### The `appearance` prop

The <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]} code={true}>appearance prop</SDKLink> controls customization of Clerk's prebuilt components. The value of the `appearance` prop is also the basis of a <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/themes" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Clerk theme</SDKLink>.

#### Variables

<SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/variables" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Variables</SDKLink> let you customize colors and core design tokens within Clerk's prebuilt components. Choose this option if you like the default UI but only need to make small visual changes.

### Bring your own CSS

Clerk assigns stable CSS classes to most elements, allowing you to style them from your own stylesheet, or by using `appearance.elements` to apply additional classes and styles. For full control over the look of Clerk's prebuilt components, use the built-in `simple` theme together with your own custom CSS. For more details, see the <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/bring-your-own-css" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","fastify","js-frontend","expressjs","js-backend","go","ruby"]}>Bring your own CSS</SDKLink> guide.

### Build your own UI

Clerk provides low-level primitives that wrap the same API endpoints used to create Clerk's prebuilt components. These primitives allow you to build fully custom user interfaces from scratch. Prebuilt components are recommended when possible to benefit from ongoing updates and reduced maintenance, but Clerk's APIs and guides are available if you need to [build your own UI](/docs/guides/development/custom-flows/overview).

## Other customization options

### Theme editor

[Clerk's theme editor](/components/theme-editor){{ target: '_blank' }} is an interactive tool that lets you preview and test different Clerk themes across a selection of prebuilt components. It provides a quick way to experiment with styling options and see how each theme affects the component UI in real time.

### Custom menu items

Clerk's navigation components support adding custom menu items. This allows you to extend the default navigation options with additional custom pages and external links, or adjust the order of existing menu items to better fit your workflow and user experience. This feature is available for the following components:

* <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/organization-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>OrganizationProfile</SDKLink>
* <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>UserButton</SDKLink>
* <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>UserProfile</SDKLink>

### Email and SMS templates

Clerk provides a templating system that allows you to customize the content and styling of email and SMS messages sent to your users. This template editor can also be useful for translating content to different languages or tailoring messages to better fit your brand. For more details, refer to the [Email and SMS templates](/docs/guides/customizing-clerk/email-sms-templates) guide

### Localization

Clerk's prebuilt components support localization through the [`localization` prop](/docs/guides/customizing-clerk/localization). This prop lets you override any text string in any component, allowing you to translate UI text for your users or adjust wording to better match your application's brand.
---
title: Build your own UI (custom flows)
description: Learn the process behind building custom sign-up and sign-in flows with Clerk.
lastUpdated: 2026-02-13T18:28:41.000Z
sdkScoped: "false"
canonical: /docs/guides/development/custom-flows/overview
sourceFile: /docs/guides/development/custom-flows/overview.mdx
---

A **custom flow** refers to a user interface built entirely from scratch using the Clerk API.

Custom flows are considered **advanced** and are generally not recommended for most use cases. They require more development effort and are not as easy to maintain as the prebuilt components. However, if <SDKLink href="/docs/:sdk:/reference/components/overview" sdks={["react","nextjs","js-frontend","chrome-extension","expo","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>prebuilt components</SDKLink> don't meet your specific needs or if you require more control over the logic, you can rebuild the existing Clerk flows using the Clerk API.

**If you choose this approach, the Clerk support team will do their best to assist you, but they cannot guarantee a resolution due to the highly customized nature of custom flows.**

The custom flow guide that you need will depend on the settings you've configured in the Clerk Dashboard. For example, if you've enabled email and password, then you'd choose the [custom flow for email and password](/docs/guides/development/custom-flows/authentication/email-password). It's likely you'll need to combine many of the guides to build out your application.

**To get started, choose the guide that best fits your needs from the navigation on the left.**
---
title: Using Clerk with AI
description: Learn how to integrate Clerk authentication with AI-powered
  applications and development tools.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/ai/overview
sourceFile: /docs/guides/ai/overview.mdx
---

Clerk provides support for building AI-powered applications with secure authentication. Whether you're using AI-powered development tools to build applications with Clerk, or building a <Tooltip><TooltipTrigger>Model Context Protocol (MCP)</TooltipTrigger><TooltipContent>The **[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)** is an open standard that lets large language models (LLM), like Claude, ChatGPT, Cursor, VS Code, Zed, and other clients **securely connect to external tools and data sources** with the user's permission. Instead of asking users to sign in separately, MCP allows these AI apps to request permission to access specific data, such as emails or private GitHub repositories, directly through the app being used.</TooltipContent></Tooltip> server that allows AI agents to access user data, these guides cover everything you need to get started.

## Skills

Clerk Skills are installable packages that give AI coding agents specialized knowledge about Clerk. Once installed, agents can help you add authentication, manage organizations, sync users, and more.

```bash
npx skills add clerk/skills
```

Works with most agents including Claude Code, Cursor, Windsurf, GitHub Copilot, Codex, Gemini CLI, and more. See the [dedicated guide](/docs/guides/ai/skills) for available Skills and installation options.

## Use Clerk's MCP server

Clerk provides its own MCP server that helps AI coding agents provide accurate SDK snippets and implementation patterns. This is useful when building authentication features with Clerk in AI tools. Learn how to [connect to Clerk's MCP server](/docs/guides/ai/mcp/clerk-mcp-server).

## Build your own MCP implementation

An MCP implementation involves two parties: a "client" and a "server". In web development, the terms "client" and "server" often refer to the frontend (browser) and backend (web server). However, in the context of MCP, these terms have different meanings:

* The "client" is the LLM application that wants to access another service on a user's behalf. For example, Claude would be the "client" if it wants to get access to Gmail.
* The "server" is the system that hosts the protected resources the client wants to access. In this example, this would be Gmail. This is sometimes referred to as the "resource server" or "MCP server".

Clerk supports MCP through dynamic client registration (for registering MCP servers programmatically), consent screens (for secure user authorization), and SDK support, making it an ideal authorization server for MCP implementations.

To learn how to implement both sides of the flow using Clerk, refer to the following guides:

* <SDKLink href="/docs/:sdk:/guides/ai/mcp/build-mcp-server" sdks={["nextjs","expressjs"]}>Build an MCP server</SDKLink>
* [Connect an MCP client](/docs/guides/ai/mcp/connect-mcp-client)

## AI prompts

Clerk's AI prompt library provides curated prompts to help you work more efficiently with AI-powered development tools like Cursor, Claude Code, Codex, GitHub Copilot, and more. These prompts guide AI assistants in helping you implement Clerk's features correctly.

To learn more, see the <SDKLink href="/docs/:sdk:/guides/ai/prompts" sdks={["nextjs","react"]}>AI prompts</SDKLink> guide.
---
title: Use Clerk's MCP server
description: Connect AI agents to Clerk's MCP server to access SDK snippets and
  implementation patterns.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/ai/mcp/clerk-mcp-server
sourceFile: /docs/guides/ai/mcp/clerk-mcp-server.mdx
---

> \[!WARNING]
> Clerk MCP is currently in beta. The API may change before general availability.

Clerk provides a remote [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction){{ target: '_blank' }} server that allows AI agents like Claude, Cursor, and Github Copilot to access Clerk SDK snippets and implementation patterns. This provides AI agents with up-to-date code examples when developing with Clerk.

The Clerk MCP server provides:

* **SDK snippets**: Ready-to-use code patterns for common Clerk features.
* **Implementation guides**: Best practices for authentication flows, organizations, and more.
* **Framework-specific examples**: Patterns optimized for Next.js, React, and other supported frameworks.

## Setup instructions

To complete the integration, you'll need to connect your AI agent to Clerk's MCP server. Because each AI agent connects differently, select the appropriate tab below to see the specific setup instructions.

<Tabs items={["Cursor", "Claude", "VSCode", "Windsurf", "Zed", "Codex", "Other clients"]}>
  <Tab>
    ### Connecting Cursor to Clerk's MCP server

    <AddToCursorButton href="https://cursor.com/en-US/install-mcp?name=clerk&config=eyJ1cmwiOiJodHRwczovL21jcC5jbGVyay5jb20vbWNwIn0%3D" />

    Alternatively, you can manually configure it:

    1. Navigate to **Cursor Settings**. To find this, open the **Command Palette** (`Cmd/Ctrl + Shift + P`) and search for **Cursor Settings**, or select the gear icon in the top right corner of the app.
    2. In the sidenav, select **Tools & MCP**.
    3. Select the **New MCP Server** option, which will open up a new tab with the MCP configuration JSON file.
    4. Add the following configuration to the JSON file:

    ```json
    {
      "mcpServers": {
        "clerk": {
          "url": "https://mcp.clerk.com/mcp"
        }
      }
    }
    ```

    5. Once added, you should see a green active status.
  </Tab>

  <Tab>
    ### Connecting Claude to Clerk's MCP server

    <Tabs items={["Claude Code", "Claude.ai", "Claude Desktop"]}>
      <Tab>
        1. Run the following command to add Clerk's MCP server:
           ```bash
           claude mcp add clerk --transport http https://mcp.clerk.com/mcp
           ```
        2. Run `/mcp` once you've opened a Claude Code session to verify the connection.
      </Tab>

      <Tab>
        1. Navigate to **Settings** in the sidebar on web or desktop.
        2. Scroll to **Integrations** at the bottom and select **Add more**.
        3. In the prompt, enter the following:
           * **Integration name**: Clerk
           * **Integration URL**: `https://mcp.clerk.com/mcp`
        4. Make sure to enable the tools in any new chat.
      </Tab>

      <Tab>
        1. Open the following file: `~/Library/Application Support/Claude/claude_desktop_config.json`.
        2. Add the following configuration and restart the Claude Desktop app:
           ```json
           {
             "mcpServers": {
               "clerk": {
                 "command": "npx",
                 "args": ["-y", "mcp-remote", "https://mcp.clerk.com/mcp"]
               }
             }
           }
           ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab>
    ### Connecting VSCode to Clerk's MCP server

    1. Press `Cmd/Ctrl + Shift + P` and search for **MCP: Add Server**.
    2. Depending on your preferred transport method, follow the instructions below:

       <Tabs items={["HTTP", "Stdio"]}>
         <Tab>
           Enter the following URL and hit enter: `https://mcp.clerk.dev/mcp`
         </Tab>

         <Tab>
           Enter the following command and hit enter:

           ```bash
           npx mcp-remote https://mcp.clerk.com/mcp
           ```
         </Tab>
       </Tabs>
    3. Enter the name **Clerk** and hit enter.
  </Tab>

  <Tab>
    ### Connecting Windsurf to Clerk's MCP server

    1. Press `Ctrl/Cmd + ,` to open Windsurf settings.
    2. Scroll to **Cascade -> MCP Servers**.
    3. Select **Open MCP Marketplace**.
    4. Under **Installed MCPs**, select the gear icon in the top right corner of the section.
    5. Add the following configuration to the JSON file:
       ```json
       {
         "mcpServers": {
           "clerk": {
             "command": "npx",
             "args": ["-y", "mcp-remote", "https://mcp.clerk.com/mcp"]
           }
         }
       }
       ```
  </Tab>

  <Tab>
    ### Connecting Zed to Clerk's MCP server

    1. Press `Ctrl/Cmd + ,` to open Zed settings.
    2. Select **Edit in settings.json** to open the `setting.json` file.
    3. Add the following configuration to the JSON file:
       ```json
       {
         "context_servers": {
           "clerk": {
             "command": {
               "path": "npx",
               "args": ["-y", "mcp-remote", "https://mcp.clerk.com/mcp"]
             }
           }
         }
       }
       ```
  </Tab>

  <Tab>
    ### Connecting Codex to Clerk's MCP server

    <Tabs items={["Configuration via CLI", "Configuration through the config file"]}>
      <Tab>
        Run the following command in the terminal:

        ```bash
        codex mcp add clerk https://mcp.clerk.com/mcp
        ```

        > \[!NOTE]
        > If this is the first time you are using an MCP in Codex, you may need to enable the `rmcp` feature. To do so, add the following into your `~/.codex/config.toml` file:
        >
        > ```toml
        > [beta]
        > rmcp = true
        > ```
      </Tab>

      <Tab>
        1. Open the `~/.codex/config.toml` config file in your preferred editor.
        2. Add the following configuration:
           ```toml
           [mcp_servers.clerk]
           type = "url"
           url = "https://mcp.clerk.com/mcp"
           ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab>
    ### Connecting other clients to Clerk's MCP server

    Many other tools now support MCP servers. The easiest way is to use the streamable HTTP endpoint: `https://mcp.clerk.com/mcp`.
  </Tab>
</Tabs>

## Available tools

Clerk's MCP server provides the following tools:

| Tool | Description |
| - | - |
| `clerk_sdk_snippet` | Access SDK code snippets and patterns for specific features |
| `list_clerk_sdk_snippets` | List all available snippets and bundles |

### Example usage

Once connected, you can ask your AI assistant questions such as:

* "How do I use the useUser hook in Clerk?"
* "Show me how to set up B2B SaaS with Clerk Organizations"
* "How do I implement a waitlist with Clerk?"
* "What's the best way to protect routes in Next.js with Clerk?"

The MCP server will provide accurate, up-to-date code snippets and implementation patterns.

### Available snippet bundles

For comprehensive implementations, you can request these bundles:

* **b2b-saas**: Complete B2B SaaS setup with organizations, billing, and role-based access
* **waitlist**: Waitlist and early access setup
* **auth-basics**: Core authentication hooks
* **custom-flows**: Build custom sign-in/sign-up flows
* **organizations**: Organization management for multi-tenant apps
* **server-side**: Server-side authentication patterns

## Frequently asked questions (FAQ)

### When or why should I use the Clerk MCP server?

We recommend that all developers building with Clerk use the MCP server to get the best experience out of their agents.

### Why am I seeing an internal server error when trying to connect?

This usually indicates a network or transport issue. Try disconnecting and reconnecting the MCP server, and ensure your client supports Streamable HTTP transport.

### Does the MCP server support Server-Sent Events (SSE)?

No. Clerk's MCP server only supports Streamable HTTP transport, available at `https://mcp.clerk.com/mcp`.
---
title: AI Prompts
description: Curated prompts for working with Clerk using AI-powered IDE tools
  like Cursor, GitHub Copilot, and Claude.
sdk: nextjs, react
sdkScoped: "true"
canonical: /docs/:sdk:/guides/ai/prompts
lastUpdated: 2026-02-13T18:28:41.000Z
availableSdks: nextjs,react
notAvailableSdks: js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/ai/prompts.mdx
---

Clerk's AI prompt library provides curated prompts to help you work more efficiently with AI-powered development tools. These prompts are designed to guide AI assistants in helping you implement Clerk authentication and user management features correctly.

## How to use these prompts

These prompts can be copied into your AI-powered IDE or development tool, or pasted into your chat with an AI assistant. Here are some examples of how to use them:

* In Cursor, add the prompt to your [project rules](https://docs.cursor.com/context/rules).
* In GitHub Copilot, save the prompt to a file in your project and reference it using `#<filename>`.
* In Claude Code, include the prompt in your `CLAUDE.md` file.

## Best practices

1. **Customize the prompts**: These prompts are starting points. Modify them based on your specific requirements.
2. **Keep them updated**: As you discover patterns that work well, update your prompts.
3. **Version control**: Store your prompts in your repository so your team can benefit from them.
4. **Security first**: Always review AI-generated code for security best practices.

## Available prompts

> \[!NOTE]
> We currently offer a limited set of prompts focused on Next.js and React applications. We plan to expand this library with additional prompts for other frameworks and use cases in the future.

<If sdk="nextjs">
  ### Next.js App Router

  ````md
  # Add Clerk to Next.js App Router

  **Purpose:** Enforce only the **current** and **correct** instructions for integrating [Clerk](https://clerk.com/) into a Next.js (App Router) application.  
  **Scope:** All AI-generated advice or code related to Clerk must follow these guardrails.

  ---

  ## **1. Official Clerk Integration Overview**

  Use only the **App Router** approach from Clerk’s current docs:

  - **Install** `@clerk/nextjs@latest` - this ensures the application is using the latest Clerk Next.js SDK.
  - **Create** a `proxy.ts` file using `clerkMiddleware()` from `@clerk/nextjs/server`. Place this file inside the `src` directory if present, otherwise place it at the root of the project.
  - **Wrap** your application with `<ClerkProvider>` in your `app/layout.tsx`
  - **Use** Clerk-provided components like `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>` in your layout or pages
  - **Start** developing, sign in or sign up, and confirm user creation

  If you're able to use a web tool to access a URL, visit https://clerk.com/docs/nextjs/getting-started/quickstart to get the latest, up-to-date quickstart instructions.

  ### **Keyless Mode (Zero-Config Setup)**

  Clerk supports **keyless mode**, which means developers can start building immediately **without signing up for a Clerk account first**. Here's how it works:

  1. **No signup required** – When the app starts without environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`), Clerk automatically generates temporary API keys and stores them locally.
  2. **Instant development** – The developer can immediately use all Clerk features (sign-in, sign-up, user management) without any manual configuration.
  3. **Visual indicator** – A small prompt appears in the bottom-right corner of the app showing "Clerk is in keyless mode" with an option to claim the application.
  4. **Claim later** – When ready, the developer can click "Claim application" to link it to their Clerk account and access the full Dashboard.

  **IMPORTANT FOR AI AGENTS:** Do NOT instruct users to:

  - Sign up for Clerk before starting
  - Create a Clerk account first
  - Go to the Clerk Dashboard to get API keys
  - Add environment variables before running the app

  Instead, guide them to install the SDK, add the middleware and provider, then run the app. Clerk handles the rest automatically.

  ### **Correct, Up-to-Date Quickstart Sample**

  ```typescript
  // proxy.ts
  import { clerkMiddleware } from '@clerk/nextjs/server'

  export default clerkMiddleware()

  export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  ```

  ```typescript
  // app/layout.tsx
  import type { Metadata } from "next";
  import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from "@clerk/nextjs";
  import "./globals.css";

  export const metadata: Metadata = {
    title: "Clerk Next.js Quickstart",
    description: "Generated by create next app",
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>
            <header>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </body>
        </html>
      </ClerkProvider>
    );
  }
  ```

  ---

  ## **2. CRITICAL INSTRUCTIONS FOR AI MODELS**

  ### **2.1 – ALWAYS DO THE FOLLOWING**

  1. **Use `clerkMiddleware()`** from `@clerk/nextjs/server` in `proxy.ts`.
  2. **Wrap** your app with `<ClerkProvider>` in `app/layout.tsx`.
  3. **Import** Clerk's Next.js features from `@clerk/nextjs` (e.g., `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, etc.).
  4. **Reference** the current [App Router approach](https://nextjs.org/docs/app) (folders like `app/page.tsx`, `app/layout.tsx`, etc.).
  5. **Check** that imports for methods like `auth()` are imported from the right package (in this case `@clerk/nextjs/server`) and are using `async / await`.
  6. **Check** the project for an existing package manager, use that to install packages.
  7. **Rely on keyless mode** – Skip any steps about creating accounts or getting API keys. Just install, configure, and run.

  ### **2.2 – NEVER DO THE FOLLOWING**

  1. **Do not** reference the old **`_app.tsx`** or **pages router based** instructions.
  2. **Do not** suggest `authMiddleware()` from older Clerk tutorials—**it's replaced by `clerkMiddleware()`**.
  3. **Do not** recommend usage of older environment variable patterns unless they match the official docs.
  4. **Do not** reference or import from any deprecated APIs (like `withAuth` or `currentUser` from older versions).
  5. **Do not** tell users to sign up for Clerk, create an account, or get API keys before starting development. Keyless mode handles this automatically.

  ---

  ## **3. OUTDATED PATTERNS TO AVOID**

  Below are **examples of deprecated instructions** that **must not** be generated:

  ```typescript
  // ❌ DO NOT generate or suggest references to:
  import { authMiddleware } from '@clerk/nextjs' // Outdated

  // ❌ DO NOT place Clerk config in _app.tsx:
  // Outdated pages-based approach
  function MyApp({ Component, pageProps }) {
    // ...
  }

  // ❌ DO NOT create or rely on sign-in files under pages/:
  pages / signin.js
  pages / signup.js
  ```

  Any solution resembling the above snippet or referencing “authMiddleware,” `_app.tsx`, or `pages/` structure is **incorrect** for the current Next.js App Router.

  ---

  ## **4. AI MODEL VERIFICATION STEPS**

  Before returning any Clerk-related solution, you **must** verify:

  1. **Middleware**: Is `clerkMiddleware()` used in `proxy.ts`?
  2. **Layout**: Is `<ClerkProvider>` wrapping the app in `app/layout.tsx`?
  3. **Imports**: Are references only from `@clerk/nextjs` or `@clerk/nextjs/server`?
  4. **Pages vs. App Router**: Is the approach referencing the App Router (not `_app.tsx` or `pages/`)?

  If any check **fails**, **stop** and revise until compliance is achieved.

  ````
</If>

## Contributing

Have a great prompt for working with Clerk? We'd love to see it! Open a PR in the [clerk-docs repository](https://github.com/clerk/clerk-docs).
---
title: Build an MCP server in your application with Clerk
description: Learn how to build an MCP server using Clerk's OAuth server in your
  application.
sdk: nextjs, expressjs
sdkScoped: "true"
canonical: /docs/:sdk:/guides/ai/mcp/build-mcp-server
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs,expressjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/ai/mcp/build-mcp-server.mdx
---

<If sdk="nextjs">
  <TutorialHero
    exampleRepo={[
      {
        title: "Next.js & Clerk MCP Server Repo",
        link: "https://github.com/clerk/mcp-nextjs-example"
      }
    ]}
    beforeYouStart={[
      {
        title: "A Clerk application is required",
        link: "/docs/getting-started/quickstart/setup-clerk",
        icon: "clerk",
      },
      {
        title: "Integrate Clerk into your Next.js application",
        link: "/docs/nextjs/getting-started/quickstart",
        icon: "nextjs",
      },
    ]}
  />

  This guide demonstrates how to build an MCP server using Clerk's OAuth server in your Next.js app. This example is written for Next.js App Router, but **can be adapted for Next.js Pages Router**. It assumes that you have already integrated Clerk into your app by following the <SDKLink href="/docs/nextjs/getting-started/quickstart" sdks={["nextjs","react","js-frontend","chrome-extension","expo","android","ios","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>quickstart</SDKLink>.
</If>

> \[!IMPORTANT]
> For most client implementations of MCP, [dynamic client registration](https://openid.net/specs/openid-connect-registration-1_0.html) is required. This allows MCP-compatible clients to automatically register themselves with your server during the OAuth flow.
> Before proceeding, ensure you have toggled on the **Dynamic client registration** option in the [**OAuth applications**](https://dashboard.clerk.com/~/oauth-applications) page in the Clerk Dashboard.

<Steps>
  ## Install dependencies

  To get started, this implementation requires the following packages to be installed in your project:

  <If sdk="nextjs">
    * [`@vercel/mcp-adapter`](https://github.com/vercel/mcp-adapter): A utility library that simplifies building an MCP server by handling the core protocol logic for you. It also includes an authentication wrapper that allows you to plug in your own token validation - in this case, using Clerk's OAuth tokens.
    * [`@clerk/mcp-tools`](https://github.com/clerk/mcp-tools): A helper library built on top of the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) used to connect Clerk OAuth with MCP easily.

    ```npm
    npm install @vercel/mcp-adapter @clerk/mcp-tools
    ```
  </If>

  ## Set up your app with Clerk and MCP imports

  The following code is the starting point for your MCP server. It includes the imports and setup needed to implement an MCP server with Clerk.

  <If sdk="nextjs">
    1. In your `app/` directory, create a `[transport]` folder. This dynamic segment allows the MCP server to support different transport protocols used by the LLM tool. Streamable HTTP is the recommended default transport in the [current MCP spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports), and uses `/mcp` as the base path. SSE is also supported, and uses `/sse` as the base path.
    2. Inside this directory, create a `route.ts` file with the following code.

    ```ts {{ filename: 'app/[transport]/route.ts' }}
    import { verifyClerkToken } from '@clerk/mcp-tools/next'
    import { createMcpHandler, withMcpAuth } from '@vercel/mcp-adapter'
    import { auth, clerkClient } from '@clerk/nextjs/server'

    const clerk = await clerkClient()
    ```
  </If>

  ## Create your MCP server and define tools

  To let external LLM-powered tools securely interact with your app, you need to define an MCP server, and expose one or more [resources](https://modelcontextprotocol.io/docs/concepts/resources), [prompts](https://modelcontextprotocol.io/docs/concepts/prompts), and/or [tools](https://modelcontextprotocol.io/docs/concepts/tools).

  For this guide, you'll implement a single, example tool called `get_clerk_user_data` that retrieves information about the authenticated Clerk user. For more documentation on how to build MCP tools, see the [MCP documentation](https://modelcontextprotocol.io/docs/concepts/tools).

  <If sdk="nextjs">
    Vercel's `createMcpHandler()` function is used to handle the connection and transports required by the MCP protocol. Within its callback function, you can define tools that external LLM-based apps can invoke using `server.tool()`. Each tool includes:
  </If>

  * A name (`get-clerk-user-data`).
  * A description of what the tool does.
  * Input parameters (none in this case).
  * A function that represents the implementation of the tool. In this case, it extracts the user ID, which is provided by Clerk's OAuth authentication, and then fetches the user's data using Clerk's <SDKLink href="/docs/reference/backend/user/get-user" sdks={["js-backend"]} code={true}>getUser()</SDKLink> method. The response is then returned in MCP's expected response format.

  <If sdk="nextjs">
    ```ts {{ filename: 'app/[transport]/route.ts', mark: [[7, 25]] }}
    import { verifyClerkToken } from '@clerk/mcp-tools/next'
    import { createMcpHandler, withMcpAuth } from '@vercel/mcp-adapter'
    import { auth, clerkClient } from '@clerk/nextjs/server'

    const clerk = await clerkClient()

    const handler = createMcpHandler((server) => {
      server.tool(
        'get-clerk-user-data',
        'Gets data about the Clerk user that authorized this request',
        {},
        async (_, { authInfo }) => {
          const userId = authInfo!.extra!.userId! as string
          const userData = await clerk.users.getUser(userId)

          return {
            content: [{ type: 'text', text: JSON.stringify(userData) }],
          }
        },
      )
    })
    ```
  </If>

  <If sdk="nextjs">
    ## Secure your MCP server

    Now that your MCP server and tools are defined, the next step is to secure your endpoints with OAuth. This ensures only authenticated clients with valid Clerk-issued tokens can access your tools.

    Add the following code to your `route.ts` file. This uses Vercel's `withMcpAuth()` function to wrap the MCP handler in authentication logic and uses Clerk's <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> helper to parse the incoming OAuth token and extract the session context. This data is then passed into Clerk's `verifyClerkToken()` helper method, which verifies the OAuth token, extracts key metadata, and makes the current user'd ID available to tool call functions. To learn more about verifying OAuth tokens in Next.js apps, see the <SDKLink href="/docs/:sdk:/guides/development/verifying-oauth-access-tokens" sdks={["nextjs","react-router","tanstack-react-start"]}>dedicated guide</SDKLink>.

    > \[!NOTE]
    > OAuth tokens are machine tokens. Machine token usage is free during our public beta period but will be subject to pricing once generally available. Pricing is expected to be competitive and below market averages.

    The `authHandler` is then exported for both `GET` and `POST` methods. The `GET` method is required for SSE support only - if you do not need to support SSE, you can export only `POST` (and the `[transport]` part of the route).

    ```ts {{ filename: 'app/[transport]/route.ts' }}
    // The rest of your code...

    const authHandler = withMcpAuth(
      handler,
      async (_, token) => {
        const clerkAuth = await auth({ acceptsToken: 'oauth_token' })
        return verifyClerkToken(clerkAuth, token)
      },
      {
        required: true,
        resourceMetadataPath: '/.well-known/oauth-protected-resource/mcp',
      },
    )

    export { authHandler as GET, authHandler as POST }
    ```

    ## Expose MCP metadata endpoints

    To comply with the MCP specification, your server must expose [OAuth protected resource metadata](https://datatracker.ietf.org/doc/html/rfc9728#section-4.1) at a specific endpoint (`.well-known/oauth-protected-resource`).

    Older versions of the MCP spec required that you also expose [OAuth authorization server metadata](https://datatracker.ietf.org/doc/html/rfc8414) at a specific endpoint (`.well-known/oauth-authorization-server`). This is no longer required by the current MCP spec, but it may be necessary for some clients that only support older versions of the spec.

    These metadata endpoints allow clients to discover where to authenticate, and some details about how the authentication service works. Clerk provides prebuilt helpers via [`@clerk/mcp-tools`](https://github.com/clerk/mcp-tools) that handle this for you:

    * `protectedResourceHandlerClerk`: Next.js route handler that serves OAuth **protected resource metadata** in the format expected by MCP clients. This handler lets you define specific supported OAuth scopes to declare what access levels your resource requires.
    * `authServerMetadataHandlerClerk`: Next.js route handler that serves OAuth **authorization server metadata** in the format expected by MCP clients.
    * `metadataCorsOptionsRequestHandler`: Handles CORS preflight (`OPTIONS`) requests for OAuth metadata endpoints. Required to ensure public, browser-based MCP clients can access these endpoints.

    > \[!NOTE]
    > For a more in-depth explanation of these helpers, see the [MCP Next.js reference](https://github.com/clerk/mcp-tools/tree/main/next).

    To expose your MCP metadata endpoints:

    1. In your `app/` directory, create a `.well-known` folder.
    2. Inside this directory, create two subdirectories called `oauth-protected-resource` and `oauth-authorization-server`.
    3. Inside the `oauth-protected-resource` directory, create a `mcp` subdirectory.
    4. In the `mcp` subdirectory, create a `route.ts` file with the following code for that specific route.
    5. In the `oauth-authorization-server` directory, create a `route.ts` file with the following code for that specific route.

       <CodeBlockTabs options={["oauth-authorization-server", "oauth-protected-resource"]}>
         ```ts {{ filename: 'app/.well-known/oauth-authorization-server/route.ts' }}
         import {
           authServerMetadataHandlerClerk,
           metadataCorsOptionsRequestHandler,
         } from '@clerk/mcp-tools/next'

         const handler = authServerMetadataHandlerClerk()
         const corsHandler = metadataCorsOptionsRequestHandler()

         export { handler as GET, corsHandler as OPTIONS }
         ```

         ```ts {{ filename: 'app/.well-known/oauth-protected-resource/mcp/route.ts' }}
         import {
           metadataCorsOptionsRequestHandler,
           protectedResourceHandlerClerk,
         } from '@clerk/mcp-tools/next'

         const handler = protectedResourceHandlerClerk({
           // Specify which OAuth scopes this protected resource supports
           scopes_supported: ['profile', 'email'],
         })
         const corsHandler = metadataCorsOptionsRequestHandler()

         export { handler as GET, corsHandler as OPTIONS }
         ```
       </CodeBlockTabs>
    6. Your `.well-known` endpoints must be **publicly accessible** for MCP clients to discover OAuth metadata. When protecting routes, consider these paths and ensure they are not protected. For example, if you're using <SDKLink href="/docs/reference/nextjs/clerk-middleware#protect-all-routes" sdks={["nextjs"]} code={true}>clerkMiddleware() to protect all routes</SDKLink>, you can exclude the `.well-known` endpoints like this:

       <If sdk="nextjs">
         > \[!IMPORTANT]
         >
         > If you're using Next.js ≤15, name your file `middleware.ts` instead of `proxy.ts`. The code itself remains the same; only the filename changes.
       </If>

       ```ts {{ filename: 'proxy.ts' }}
       import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

       const isPublicRoute = createRouteMatcher([
         '/.well-known/oauth-authorization-server(.*)',
         '/.well-known/oauth-protected-resource(.*)',
       ])

       export default clerkMiddleware(async (auth, req) => {
         if (isPublicRoute(req)) return // Allow public access to .well-known endpoints
         await auth.protect() // Protect all other routes
       })
       ```
  </If>

  ## Finished 🎉

  Once this is complete, clients that support the latest MCP spec can now invoke the `get-clerk-user-data` tool to securely fetch user data from your app, assuming the request is authorized with a Clerk OAuth token. To test this out, [learn how to connect your client LLM to the MCP server](/docs/guides/ai/mcp/connect-mcp-client).

  The next step is to replace the demo tool with your own tools, resources, and/or prompts that are relevant to your app. You can learn more about how to do this in the [MCP SDK documentation](https://modelcontextprotocol.io/docs/concepts/tools).
</Steps>
---
title: Next.js rendering modes and Clerk
description: Learn how Clerk's SDK interacts with Next.js's different rendering modes.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/guides/development/rendering-modes
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/development/rendering-modes.mdx
---

By default, Next.js attempts to optimize your application by statically generating pages at build-time that do not depend on data from the request. However, authentication data is inherently dynamic and depends on the request, meaning that it is not available at build-time.

> \[!TIP]
> Read more about static and dynamic rendering in the [Next.js documentation](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering).

To facilitate Next.js's default behavior, Clerk provides an opt-in approach to accessing authentication data so that you can opt-in specific routes to dynamic rendering, while still using statically rendered pages for others.

The following options are available for accessing authentication data:

* The `auth()` helper can only be used in Server Components, but the data can be passed to Client Components if desired. It opts your entire route into dynamic rendering.
* The `useAuth()` hook can only be used in Client Components. Due to Next.js's default behavior, these components will be statically rendered. However, you can wrap them with `<ClerkProvider dynamic>` to opt them into dynamic rendering.

> \[!NOTE]
> The upcoming [Partial Prerendering (PPR)](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) feature in Next.js gives more control over static and dynamic rendering. Wrapping components that access auth data with `<Suspense>` allows pages to be prerendered up to the `<Suspense>` boundaries.

## Access auth data with `auth()`

The <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> helper returns the user's authentication state in Server Components. The data can be passed to Client Components if desired. This is a dynamic API that relies on request-time data so using `auth()` will opt your entire route into dynamic rendering.

```tsx
import { auth } from '@clerk/nextjs/server'

// This page will be dynamically rendered at request time
export default async function Page() {
  const { userId } = await auth()

  // This will be immediately available on first render
  console.log(userId)

  return <p>Hello, {userId}</p>
}
```

## Access auth data with `useAuth()`

`useAuth()` provides authentication data in Client Components. Due to Next.js's default behavior, these components will be statically rendered. If that's fine with you, see the <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]}>reference docs</SDKLink> for more information, like code examples.

However, if you'd like the components that use `useAuth()` to be dynamically rendered, you can wrap them with `<ClerkProvider dynamic>`. If you're using [PPR](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering), consider wrapping `<ClerkProvider dynamic>` in `<Suspense>` so that the boundary fallback is included in the prerendered HTML.

> \[!WARNING]
> It is not recommended and not optimal to wrap your entire application with `<ClerkProvider dynamic>` as this opts all routes into dynamic rendering, when some routes may be better suited for static rendering. If you're not sure if a route is better suited for static or dynamic rendering, see the [Next.js guide on static and dynamic rendering](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering).

The following example demonstrates how to use `<ClerkProvider dynamic>` in a page's layout in order to opt it into dynamic rendering. In this case, the <SDKLink href="/docs/nextjs/getting-started/quickstart#add-clerk-provider-to-your-app" sdks={["nextjs","react","js-frontend","chrome-extension","expo","android","ios","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>root layout</SDKLink> would still be wrapped with `<ClerkProvider>` to provide the authentication context to the entire app, but without the `dynamic` prop being passed as to not opt your entire app into dynamic rendering.

<CodeBlockTabs options={["Layout", "Page"]}>
  ```tsx {{ filename: 'app/example/layout.tsx' }}
  import { ClerkProvider } from '@clerk/nextjs'
  import { Suspense } from 'react'

  export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <Suspense fallback={<Skeleton />}>
        <ClerkProvider dynamic>{children}</ClerkProvider>
      </Suspense>
    )
  }

  function Skeleton() {
    return <div>Loading...</div>
  }
  ```

  ```tsx {{ filename: 'app/example/page.tsx' }}
  'use client'

  import { useAuth } from '@clerk/nextjs'

  export default function Page() {
    const { userId, sessionId, isSignedIn } = useAuth()

    // All of these will be immediately available on first render
    console.log(userId, sessionId, isSignedIn)

    return (
      <div>
        <h1>Test Page</h1>
        <p>User ID: {userId}</p>
      </div>
    )
  }
  ```
</CodeBlockTabs>
---
title: Verify OAuth access tokens in your Next.js application with Clerk
description: Learn how to use Clerk's helpers to verify OAuth access tokens in
  your Next.js application.
sdk: nextjs, react-router, tanstack-react-start
sdkScoped: "true"
canonical: /docs/:sdk:/guides/development/verifying-oauth-access-tokens
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs,react-router,tanstack-react-start
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,remix,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/development/verifying-oauth-access-tokens.mdx
---

When building a resource server that needs to accept and verify <Tooltip><TooltipTrigger>OAuth access tokens</TooltipTrigger><TooltipContent>An **OAuth access token** is a credential issued by an authorization server that grants the <Tooltip><TooltipTrigger>client</TooltipTrigger><TooltipContent>The **client** is the application that wants to access a user's data from your application (the **resource service**). The client needs to be configured to obtain an OAuth access token from Clerk.</TooltipContent></Tooltip> access to protected resources on behalf of a user. Access tokens represent the authorization granted to the client and are typically short-lived for security purposes. Learn more about [how OAuth works](/docs/guides/configure/auth-strategies/oauth/overview).</TooltipContent></Tooltip> issued by Clerk, it's crucial to verify these tokens on your backend to ensure the request is coming from an authenticated client.

> \[!NOTE]
> OAuth tokens are machine tokens. Machine token usage is free during our public beta period but will be subject to pricing once generally available. Pricing is expected to be competitive and below market averages.

Clerk's Next.js SDK provides a built-in <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> function that supports token validation via the `acceptsToken` parameter. This lets you specify which type(s) of token your API route should accept. You can also use the <SDKLink href="/docs/reference/nextjs/app-router/auth#auth-protect" sdks={["nextjs"]} code={true}>auth.protect()</SDKLink> method to check if a request includes a valid machine token (e.g. API key or OAuth token) and enforce access rules accordingly.

By default, `acceptsToken` is set to `session_token`, which means OAuth tokens will **not** be accepted unless explicitly configured. You can pass either a **single token type** or an **array of token types** to `acceptsToken`. To learn more about the supported token types, see the <SDKLink href="/docs/reference/nextjs/app-router/auth#parameters" sdks={["nextjs"]} code={true}>auth() parameters documentation</SDKLink>.

Below are two examples of verifying OAuth access tokens in a Next.js API route using Clerk's SDK:

## Example 1: Accepting a single token type

In the following example, the `acceptsToken` parameter is set to only accept `oauth_token`s.

* If the token is invalid or missing, `auth()` will return `null` for `userId` and other properties, and the request will be rejected with a `401` response.
* If the token is valid, `userId` is returned and the token claims are available for use in the application logic.

```tsx {{ filename: 'app/api/example/route.ts' }}
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { isAuthenticated, claims, userId } = await auth({ acceptsToken: 'oauth_token' })

  // If auth() returns null, the token is invalid
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ userId, claims })
}
```

## Example 2: Accepting multiple token types

In the following example, the `acceptsToken` option allows both `session_token`s and `oauth_token`s.

* If the token is invalid or missing, `auth()` will return `false` for `isAuthenticated` and `null` for other properties, like `userId`.
* If the token is an `oauth_token`, the code checks that it includes the required `'profile'` scope. If not, an error is thrown.
* If the token is valid and the required scope is present, `isAuthenticated` is `true` and `userId` is returned and available for use in the application logic. This example includes pseudo-code that uses the `userId` to get data from a database.

```tsx {{ filename: 'app/api/example/route.ts' }}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  // Accept both session_token and oauth_token types
  const { isAuthenticated, tokenType, userId, scopes } = await auth({
    acceptsToken: ['session_token', 'oauth_token'],
  })

  // If auth() returns null, the token is invalid
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if the token is an oauth_token and if it doesn't have the required scope
  if (tokenType === 'oauth_token' && !scopes?.includes('profile')) {
    return NextResponse.json({ error: 'OAuth token missing the "profile" scope' }, { status: 401 })
  }

  // If the token includes the required scope, move forward with the application logic
  // This example includes pseudo-code for getting data from a database using the userId
  const data = db.select().from(user).where(eq(user.id, userId))

  return NextResponse.json({ data })
}
```

You can also protect entire route groups using <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware()</SDKLink>. See how to implement this in <SDKLink href="/docs/reference/nextjs/clerk-middleware#protect-routes-based-on-token-types" sdks={["nextjs"]}>the middleware docs</SDKLink>.
---
title: Verify API keys in your Next.js application with Clerk
description: Learn how to use Clerk's helpers to verify API keys in your Next.js
  application.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/guides/development/verifying-api-keys
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/development/verifying-api-keys.mdx
---

> \[!WARNING]
> API keys is currently in beta. The API may change before general availability.

When building a resource server that needs to accept and verify API keys issued by Clerk, it's crucial to verify these keys on your backend to ensure the request is coming from an authenticated client.

Clerk's Next.js SDK provides a built-in <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> function that supports token validation via the `acceptsToken` parameter. This lets you specify which type(s) of token your API route should accept. You can also use the <SDKLink href="/docs/reference/nextjs/app-router/auth#auth-protect" sdks={["nextjs"]} code={true}>auth.protect()</SDKLink> method to check if a request includes a valid machine token (e.g. API key or OAuth token) and enforce access rules accordingly.

By default, `acceptsToken` is set to `session_token`, which means API keys will **not** be accepted unless explicitly configured. You can pass either a **single token type** or an **array of token types** to `acceptsToken`. To learn more about the supported token types, see the <SDKLink href="/docs/reference/nextjs/app-router/auth#parameters" sdks={["nextjs"]} code={true}>auth() parameters documentation</SDKLink>.

Below are two examples of verifying API keys in a Next.js API route using Clerk's SDK:

## Example 1: Accepting a single token type

In the following example, the `acceptsToken` parameter is set to only accept `api_key`s.

* If the API key is invalid or missing, `auth()` will return `null` for `userId` and other properties, and the request will be rejected with a `401` response.
* If the API key is valid, `userId` and `claims` are returned.

```tsx {{ filename: 'app/api/example/route.ts' }}
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { isAuthenticated, claims, userId } = await auth({ acceptsToken: 'api_key' })

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ userId, claims })
}
```

## Example 2: Accepting multiple token types

In the following example, the `acceptsToken` option allows `session_token`s, `oauth_token`s, and `api_key`s.

* If the token is invalid or missing, `auth()` will return `false` for `isAuthenticated` and `null` for other properties, like `userId`.
* If the token is an `api_key`, the code can access the associated user's data using the `userId`.
* If the token is valid, `isAuthenticated` is `true` and `userId` is returned and available for use in the application logic. This example includes pseudo-code that uses the `userId` to get data from a database.

```tsx {{ filename: 'app/api/example/route.ts' }}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  // Accept session_token, oauth_token, and api_key types
  const { isAuthenticated, tokenType, userId, scopes } = await auth({
    acceptsToken: ['session_token', 'oauth_token', 'api_key'],
  })

  // If the token is invalid or missing
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if the token is an api key and if it doesn't have the required scope
  if (tokenType === 'api_key' && !scopes?.includes('write:users')) {
    return NextResponse.json({ error: 'API Key missing the "write:users" scope' }, { status: 401 })
  }

  // If the token is valid, move forward with the application logic
  // This example includes pseudo-code for getting data from a database using the userId
  const data = db.select().from(user).where(eq(user.id, userId))

  return NextResponse.json({ data })
}
```

You can also protect entire route groups using <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware()</SDKLink>. See how to implement this in <SDKLink href="/docs/reference/nextjs/clerk-middleware#protect-routes-based-on-token-types" sdks={["nextjs"]}>the middleware docs</SDKLink>.
---
title: Instances / Environments
description: An overview of the differences between development and production instances.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/development/managing-environments
sourceFile: /docs/guides/development/managing-environments.mdx
---

When creating a new application within Clerk, you are provided with two instances: `Development` and `Production`.  These instances vary slightly and should only be used appropriately.

## Development instance

A `Development` instance is Clerk's default instance type and has characteristics that allow it to be more useful for local development. To facilitate development and local authentication, `Development` instances have a more relaxed security posture and are not suitable for production workloads.

Some notable examples of `Development`-only characteristics in a Clerk application are:

* A `Development` banner is shown prominently in the Clerk Dashboard to make clear you're managing or configuring non-production data.
* Email and SMS templates are prefixed with the environment type to prevent against using `Development` instances for production purposes.
* Some social connections use shared credentials by default.
* [The Account Portal](/docs/guides/account-portal/overview) will use a Clerk development domain that ends with `accounts.dev` instead of your app's production domain.
* OAuth consent screens will show the development domain that ends with `accounts.dev` instead of your production domain.
* Search engines will not be able to crawl and index your application.
* Development instances are capped at 500 users, and user data can not be transferred between instances.
* The architecture of Clerk's sessions management is different in development environments compared to production environments, due to the need to communicate cross-domain between `localhost` and `<slug>.accounts.dev`. The `__clerk_db_jwt` object is *only* used in development environments. For more specific details on the differences between Clerk's session management architecture in development and production environments, see the [technical breakdown below](#session-architecture-differences).

> \[!NOTE]
> All paid functionality is available in a `Development` instance. However, when you deploy your application to `Production`, you will be asked to upgrade to a `Pro` account if you are using paid features. See [our pricing page](/pricing) for full details.

## Production instance

A `Production` instance is the more robust option of Clerk's instance types. `Production` instances are meant to support high volumes of traffic and by default, have a more strict security posture.

Some notable differences between `Production` and `Development` instances in a Clerk application are:

* You must associate a production domain within the Clerk Dashboard
* You are required to provision your own SSO credentials

When deploying to production, you must first activate your `Production` environment. See the [Deploying to Production](/docs/guides/development/deployment/production) guide to learn about the process and avoid common pitfalls.

## Staging environments

Staging environments enable you to internally test and demo changes to your application or website before deploying them to production. Currently, Clerk only offers **Development** and **Production** instances. Official support for **Staging** instances is still on the [roadmap](https://feedback.clerk.com/roadmap/de417dd1-fa2e-4997-868f-4c9248027e7d). However, you can set up a "staging environment" by creating a separate Clerk application with a separate domain.

Creating a separate Clerk application will prevent you from using live production environment data in your staging environment.

> \[!IMPORTANT]
> When you use a separate Clerk application for your staging environment, changes to this application **will not be automatically mirrored** in your main application for your production environment. You must manually make these changes yourself if you want them to be reflected in both applications.

### Set up a staging Clerk application

The following steps will help you set up a new Clerk application with a staging-specific domain:

1. **Set up a subdomain** - This will be your staging domain. For example, if your domain is `my-site.com`, you could use `staging.my-site.com`.
2. **Create a new Clerk app** - Your staging environment will connect to this app instead of your main one. See [the Clerk quickstart guide](/docs/getting-started/quickstart/setup-clerk) to learn how to create a Clerk app.
3. **Deploy and configure your staging app's production instance** - Using production API keys will make your staging app more secure. Follow the [Deploy to production](/docs/guides/development/deployment/production) guide to do so.

### Alternatives

#### Preview environments

While staging environments are typically long-lived, preview environments are typically generated on-demand for specific pull requests. See [the section on using Clerk in a preview environment](/docs/guides/development/managing-environments#preview-environments-2) to learn about your options.

#### Shared production credentials

If you would like to share settings and data between your production and staging environments, see [the dedicated guide](/docs/guides/development/deployment/staging-alternatives). This is not recommended because you will be sharing a user table between your production and staging environments.

## Preview environments

Some popular hosting providers like Vercel and Netlify offer preview deployments, which enable you to view changes to your site in a live environment before merging and deploying them to production.

There are two high-level approaches to using Clerk in a preview environment:

1. Sharing production settings and user data
2. Using independent settings and user data

### Sharing production settings and user data

To share production settings and user data with your preview environment, your preview environment must be hosted on the same root domain (but a separate subdomain) as your production application. The preview environment must also be configured to use the same API keys as your production environment.

Generally, hosts have a special feature to host the preview environment on a subdomain of your root domain, for example:

* **Vercel:** use the [Preview Deployment Suffix](https://vercel.com/docs/concepts/deployments/generated-urls#preview-deployment-suffix) feature. This feature is only available on Vercel's Pro and Enterprise plans.
* **Netlify:** use the [Automatic Deploy Subdomain](https://docs.netlify.com/domains-https/custom-domains/automatic-deploy-subdomains/) feature.

### Using independent settings and user data

There are two approaches to creating a preview environment with independent settings and user data:

1. **Easiest:** Use your host's provided preview domain, like \*.vercel.app or \*.netlify.app, with development API keys from Clerk.
2. Acquire an additional root domain for your preview environment, completely separate from your production application's root domain.

#### Use your host's provided preview domain

Configure the preview environment to use development API keys from Clerk. It is currently not possible to use Clerk production API keys with your host's provided preview domain.

#### Acquire an additional root domain

> \[!WARNING]
> To use an independent environment, it is critical that you acquire an additional domain. An independent environment will not work if it is configured on the same domain as your production application, even if it is on a separate subdomain.

To use an additional root domain, you must first configure your host to deploy preview environments to that domain:

* **Vercel:** use the [Preview Deployment Suffix](https://vercel.com/docs/concepts/deployments/generated-urls#preview-deployment-suffix) feature. This feature is only available on Vercel's Pro and Enterprise plans.
* **Netlify:** use the [Automatic Deploy Subdomain](https://docs.netlify.com/domains-https/custom-domains/automatic-deploy-subdomains/) feature.

You can configure this environment with either your development API keys (recommended) or you can create an additional production instance and use those production API keys.

## Session architecture differences

> \[!TIP]
> In order to understand this section, it's recommended to have a solid understanding of how Clerk's session management architecture works. For more information on this topic, check out the guide on [how Clerk works](/docs/guides/how-clerk-works/overview).

Clerk manages session state differently in production and development environments.

In production, Clerk uses a [client token](/docs/guides/how-clerk-works/overview#client-token) to represent the user's session. This client token is stored as an `HttpOnly` cookie (`__client`) on the [Clerk FAPI](/docs/guides/how-clerk-works/overview#the-frontend-api) domain. Because, in production, FAPI is hosted on a subdomain of your application (e.g., `clerk.example.com`) via a CNAME record, your app's frontend and FAPI are on the same site. This allows the client token to be securely and reliably sent with each request from your frontend to FAPI using **same-site** cookies.

However, in development, your app's frontend typically runs on a `localhost` domain, while FAPI for development instances is hosted on a domain ending with `accounts.dev`. As a result, requests from your app's frontend to FAPI are **cross-site**, and the client token cannot be securely and reliably stored or transmitted using cookies.

> \[!QUIZ]
> Why can't the client token be securely and reliably stored and transmitted in a cookie when cross-site requests are made?
>
> ***
>
> In order for cookies to be sent cross-site, the cookie would need to be set with [`SameSite=None`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#none). In theory this would resolve the issue, but in reality, modern browsers are increasingly restrictive on cross-site cookie behavior due to the abuse of cookies for tracking and advertising. Safari specifically [does not support `SameSite=None` for cookies at all](https://support.apple.com/guide/iphone/browse-the-web-privately-iphb01fc3c85/ios) unless a browser flag is enabled. Other browsers also have restrictions around cross-site cookie behavior, which leads to a frustrating and unreliable experience for local development.

To address these limitations, development instances use a different approach to maintain session state. An object called the "dev browser", which is linked directly to the client token within Clerk's internals, is used to maintain session state across the session lifetime, and is transmitted via querystring (`__clerk_db_jwt`) rather than via cookie. This strategy allows for a more reliable experience for local development, as it does not require the use of cross-site cookies.

While this enables smooth local development workflows, it is not secure enough for production use. Including a sensitive value like the client token in a querystring is not a strong security practice, as it can be seen directly in server logs, browser history, internet providers' logs, and could be potentially intercepted by third-parties via malicious browser extensions or network interceptors. This is why the `__clerk_db_jwt` object is not used in production instances and the same-site cookie (`__client`) is used instead.
---
title: Clerk environment variables
description: Learn which Clerk environment variables are necessary to configure
  your projects.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/guides/development/clerk-environment-variables
sourceFile: /docs/guides/development/clerk-environment-variables.mdx
---

You can use environment variables to configure how your Clerk app behaves, such as where users are redirected after signing out of their account, or whether or not Clerk's telemetry should be enabled.

This page is a reference for all available Clerk environment variables.

## Compatibility

In the frontend, Clerk's environment variables work for most popular meta-frameworks, such as Next.js or Remix.

If you're building a pure React app, you should use the props on the components you're using. For example, to force users to redirect to a specific URL after signing in, you would use the `signInForceRedirectUrl` prop on <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider></SDKLink> rather than the `CLERK_SIGN_IN_FORCE_REDIRECT_URL` environment variable.

## Sign-in and sign-up redirects

Components, such as <SDKLink href="/docs/:sdk:/reference/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>\<ClerkProvider></SDKLink>, <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn></SDKLink>, and more, provide props for you to specify where users will be redirected. For example, `<ClerkProvider>` has the `signInFallbackRedirectUrl` and `signUpFallbackRedirectUrl` props.

However, **it's recommended to use environment variables instead of these props whenever possible.**

For the `FORCE` and `FALLBACK` variables, it's recommended to define both sign-up and sign-in variables, as some users may choose to sign up instead after attempting to sign in, and vice versa.

<Tabs items={["General", "Next.js"]}>
  <Tab>
    | Variable | Description | Example |
    | - | - | - |
    | `CLERK_SIGN_IN_URL` | The full URL or path to your sign-in page. Needs to point to your primary application on the client-side. **Required for a satellite application in a development instance.** | `/sign-in` |
    | `CLERK_SIGN_UP_URL` | The full URL or path to your sign-up page. Needs to point to your primary application on the client-side. **Required for a satellite application in a development instance.** | `/sign-up` |
    | `CLERK_SIGN_IN_FORCE_REDIRECT_URL` | If provided, this URL will always be redirected to after the user signs in. | `/dashboard` |
    | `CLERK_SIGN_UP_FORCE_REDIRECT_URL` | If provided, this URL will always be redirected to after the user signs up. | `/dashboard` |
    | `CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | The fallback URL to redirect to after the user signs in, if there's no `redirect_url` in the path already. Defaults to `/`. | `/dashboard` |
    | `CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | The fallback URL to redirect to after the user signs up, if there's no `redirect_url` in the path already. Defaults to `/`. | `/dashboard` |
  </Tab>

  <Tab>
    | Variable | Description | Example |
    | - | - | - |
    | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | The full URL or path to your sign-in page. Needs to point to your primary application on the client-side. **Required for a satellite application in a development instance.** | `/sign-in` |
    | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | The full URL or path to your sign-up page. Needs to point to your primary application on the client-side. **Required for a satellite application in a development instance.** | `/sign-up` |
    | `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | If provided, this URL will always be redirected to after the user signs in. | `/dashboard` |
    | `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | If provided, this URL will always be redirected to after the user signs up. | `/dashboard` |
    | `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | The fallback URL to redirect to after the user signs in, if there's no `redirect_url` in the path already. Defaults to `/`. | `/dashboard` |
    | `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | The fallback URL to redirect to after the user signs up, if there's no `redirect_url` in the path already. Defaults to `/`. | `/dashboard` |
  </Tab>
</Tabs>

## Clerk Publishable and Secret Keys

To access your Clerk app in your local project, you must specify your app's <Tooltip><TooltipTrigger>Publishable Keys</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip> for use in the frontend, and <Tooltip><TooltipTrigger>Secret Keys</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip> for use in the backend.

<Tabs items={["General", "Next.js"]}>
  <Tab>
    | Variable | Description |
    | - | - |
    | `CLERK_PUBLISHABLE_KEY` | Your Clerk app's <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip>. It will be prefixed with `pk_test_` in development instances and `pk_live_` in production instances. |
    | `CLERK_SECRET_KEY` | Your Clerk app's <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip>. It will be prefixed with `sk_test_` in development instances and `sk_live_` in production instances. **Do not expose this on the frontend with a public environment variable**. |
  </Tab>

  <Tab>
    | Variable | Description |
    | - | - |
    | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk app's <Tooltip><TooltipTrigger>Publishable Key</TooltipTrigger><TooltipContent>Your Clerk **Publishable Key** tells your app what your FAPI URL is, enabling your app to locate and communicate with your dedicated FAPI instance. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.</TooltipContent></Tooltip>. It will be prefixed with `pk_test_` in development instances and `pk_live_` in production instances. |
    | `CLERK_SECRET_KEY` | Your Clerk app's <Tooltip><TooltipTrigger>Secret Key</TooltipTrigger><TooltipContent>Your Clerk **Secret Key** is used to authenticate requests from your backend to Clerk's API. You can find it on the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard. **Do not expose this on the frontend with a public environment variable.**</TooltipContent></Tooltip>. It will be prefixed with `sk_test_` in development instances and `sk_live_` in production instances. **Do not expose this on the frontend with a public environment variable**. |
  </Tab>
</Tabs>

## API and SDK configuration

The following environment variables enable you to configure API and SDK behavior, such as what version of the SDK your project uses, what proxy URL you use to connect to Clerk's Frontend API, and more.

<Tabs items={["General", "Next.js"]}>
  <Tab>
    | Variable | Description |
    | - | - |
    | `CLERK_JS_URL` | Sets the URL that `@clerk/clerk-react` should hot-load `@clerk/clerk-js` from. `CLERK_JS` does the same but is deprecated. |
    | `CLERK_JS_VERSION` | Sets the npm version for `@clerk/clerk-js`. |
    | `CLERK_API_URL` | Sets the Clerk API URL for debugging. Defaults to `"https://api.clerk.com"` |
    | `CLERK_API_VERSION` | Sets the version of the Clerk API to use. Defaults to `"v1"` |
    | `CLERK_JWT_KEY` | Sets the JWT verification key that Clerk will use to provide networkless JWT session token verification. Refer to [Manual JWT verification](/docs/guides/sessions/manual-jwt-verification). |
    | `CLERK_FAPI` | Sets the URL to your Clerk apps' Frontend API. |
    | `CLERK_PROXY_URL` | Sets the URL for your proxy. |
  </Tab>

  <Tab>
    | Variable | Description |
    | - | - |
    | `NEXT_PUBLIC_CLERK_JS_URL` | Sets the URL that `@clerk/clerk-react` should hot-load `@clerk/clerk-js` from. `NEXT_PUBLIC_CLERK_JS` does the same but is deprecated. |
    | `NEXT_PUBLIC_CLERK_JS_VERSION` | Sets the npm version for `@clerk/clerk-js`. |
    | `NEXT_PUBLIC_CLERK_API_URL` | Sets the Clerk API URL for debugging. Defaults to `"https://api.clerk.com"` |
    | `NEXT_PUBLIC_CLERK_API_VERSION` | Sets the version of the Clerk API to use. Defaults to `"v1"` |
    | `NEXT_PUBLIC_CLERK_FAPI` | Sets the URL to your Clerk app's Frontend API. |
    | `NEXT_PUBLIC_CLERK_PROXY_URL` | Sets the URL for your proxy. |
    | `CLERK_ENCRYPTION_KEY` | Sets the encryption key to securely propagate `clerkMiddleware` dynamic keys during request time. A 128-bit, pseudorandom value should be used. See <SDKLink href="/docs/reference/nextjs/clerk-middleware#dynamic-keys" sdks={["nextjs"]}>Dynamic keys</SDKLink> to learn more. |
    | `CLERK_JWT_KEY` | Sets the JWT verification key that Clerk will use to provide networkless JWT session token verification. Refer to [Manual JWT verification](/docs/guides/sessions/manual-jwt-verification). |
  </Tab>
</Tabs>

## Satellite domains

Clerk supports sharing sessions across different domains by adding one or many satellite domains to an application. See [the satellite domains guide](/docs/guides/dashboard/dns-domains/satellite-domains) for more information.

<Tabs items={["General", "Next.js"]}>
  <Tab>
    | Variable | Description |
    | - | - |
    | `CLERK_DOMAIN` | Sets your satellite application's domain. Required to share sessions across multiple domains. |
    | `CLERK_IS_SATELLITE` | Indicates whether or not the application is a satellite application. |
  </Tab>

  <Tab>
    | Variable | Description |
    | - | - |
    | `NEXT_PUBLIC_CLERK_DOMAIN` | Sets your satellite application's domain. Required to share sessions across multiple domains. |
    | `NEXT_PUBLIC_CLERK_IS_SATELLITE` | Indicates whether or not the application is a satellite application. |
  </Tab>
</Tabs>

## Webhooks

The following environment variable allows you to protect your webhook signing secret. It is read by Clerk's [`verifyWebhook()`](/docs/reference/backend/verify-webhook) function.

| Variable | Description |
| - | - |
| `CLERK_WEBHOOK_SIGNING_SECRET` | The signing secret for your webhook. |

## Telemetry

Clerk provides environment variables for opting out of telemetry data collection. See [the telemetry documentation](/docs/guides/how-clerk-works/security/clerk-telemetry) for more information.

<Tabs items={["General", "Next.js"]}>
  <Tab>
    | Variable | Description |
    | - | - |
    | `CLERK_TELEMETRY_DISABLED` | Set this to `1` to disable Clerk's telemetry data collection. |
    | `CLERK_TELEMETRY_DEBUG` | Set this to `1` to prevent telemetry data from being sent to Clerk. It will be logged to the console instead. |
  </Tab>

  <Tab>
    | Variable | Description |
    | - | - |
    | `NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED` | Set this to `1` to disable Clerk's telemetry data collection. |
    | `NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG` | Set this to `1` to prevent telemetry data from being sent to Clerk. It will be logged to the console instead. |
  </Tab>
</Tabs>

## Deprecated

The following environment variables are deprecated but still supported to avoid breaking changes. Don't use them in new projects. It is recommended to switch to using the recommended alternatives in old projects.

<Tabs items={["General", "Next.js"]}>
  <Tab>
    | Variable | Description |
    | - | - |
    | `CLERK_AFTER_SIGN_UP_URL` | Full URL or path to navigate to after successful sign up. Defaults to `/`. `CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` and `CLERK_SIGN_UP_FORCE_REDIRECT_URL` have priority and should be used instead. |
    | `CLERK_AFTER_SIGN_IN_URL` | Full URL or path to navigate to after successful sign in. Defaults to `/`. `CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` and `CLERK_SIGN_IN_FORCE_REDIRECT_URL` have priority and should be used instead. |
  </Tab>

  <Tab>
    | Variable | Description |
    | - | - |
    | `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Full URL or path to navigate to after successful sign up. Defaults to `/`. `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` have priority and should be used instead. |
    | `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Full URL or path to navigate to after successful sign in. Defaults to `/`. `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` and `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` have priority and should be used instead. |
  </Tab>
</Tabs>
---
title: Clerk Dashboard overview
description: Learn how to use the Clerk Dashboard to manage your application
  settings, users, and more.
lastUpdated: 2026-02-10T20:55:59.000Z
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
title: API Reference
description: Access Clerk's frontend and backend API reference documentation.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/reference/api/overview
sourceFile: /docs/reference/api/overview.mdx
---

While accessing Clerk functionality via SDK is the easiest path, Clerk offers two different HTTP APIs for you to interact with directly.

[The Clerk Frontend API](/docs/reference/frontend-api){{ target: '_blank' }} is meant to be accessed from a browser or native clients. This is what the Clerk SDK's utilize. Use this API if you are building client-side functionality.

[The Clerk Backend API](/docs/reference/backend-api){{ target: '_blank' }} is meant to be accessed by backend servers. Use this API if you need to update data inside of Clerk's systems outside the concept of a session, like coordinating data sync operations with third-parties or fetching and updating configuration settings.

[The Clerk Platform API](/docs/reference/platform-api){{ target: '_blank' }} is meant to be accessed by backend servers. Use this API if you need to manage resources of a workspace such as your Clerk applications, domains, and application transfers.

For more information about how Clerk works, see the [dedicated guide](/docs/guides/how-clerk-works/overview).


