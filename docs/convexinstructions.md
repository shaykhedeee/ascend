# HTTP Actions

HTTP actions allow you to build an HTTP API right in Convex!

convex/http.ts

TS

```
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(`Hello from ${request.url}`);
  }),
});
export default http;
```

HTTP actions take in a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) following the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). HTTP actions can manipulate the request and response directly, and interact with data in Convex indirectly by running [queries](/functions/query-functions.md), [mutations](/functions/mutation-functions.md), and [actions](/functions/actions.md). HTTP actions might be used for receiving webhooks from external applications or defining a public HTTP API.

HTTP actions are exposed at `https://<your deployment name>.convex.site` (e.g. `https://happy-animal-123.convex.site`).

**Example:** [HTTP Actions](https://github.com/get-convex/convex-demos/tree/main/http)

## Defining HTTP actions[​](#defining-http-actions "Direct link to Defining HTTP actions")

HTTP action handlers are defined using the [`httpAction`](/generated-api/server.md#httpaction) constructor, similar to the `action` constructor for normal actions:

convex/myHttpActions.ts

TS

```
import { httpAction } from "./_generated/server";

export const doSomething = httpAction(async () => {
  // implementation will be here
  return new Response();
});
```

The first argument to the `handler` is an [`ActionCtx`](/api/interfaces/server.GenericActionCtx.md) object, which provides [`auth`](/api/interfaces/server.Auth.md), [`storage`](/api/interfaces/server.StorageActionWriter.md), and [`scheduler`](/api/interfaces/server.Scheduler.md), as well as `runQuery`, `runMutation`, `runAction`.

The second argument contains the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) data. HTTP actions do not support argument validation, as the parsing of arguments from the incoming Request is left entirely to you.

Here's an example:

convex/messages.ts

TS

```
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const postMessage = httpAction(async (ctx, request) => {
  const { author, body } = await request.json();

  await ctx.runMutation(internal.messages.sendOne, {
    body: `Sent via HTTP action: ${body}`,
    author,
  });

  return new Response(null, {
    status: 200,
  });
});
```

To expose the HTTP Action, export an instance of [`HttpRouter`](/api/classes/server.HttpRouter.md) from the `convex/http.ts` file. To create the instance call the `httpRouter` function. On the `HttpRouter` you can expose routes using the `route` method:

convex/http.ts

TS

```
import { httpRouter } from "convex/server";
import { postMessage, getByAuthor, getByAuthorPathSuffix } from "./messages";

const http = httpRouter();

http.route({
  path: "/postMessage",
  method: "POST",
  handler: postMessage,
});

// Define additional routes
http.route({
  path: "/getMessagesByAuthor",
  method: "GET",
  handler: getByAuthor,
});

// Define a route using a path prefix
http.route({
  // Will match /getAuthorMessages/User+123 and /getAuthorMessages/User+234 etc.
  pathPrefix: "/getAuthorMessages/",
  method: "GET",
  handler: getByAuthorPathSuffix,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
```

You can now call this action via HTTP and interact with data stored in the Convex Database. HTTP actions are exposed on `https://<your deployment name>.convex.site`.

```
export DEPLOYMENT_NAME=... # example: "happy-animal-123"
curl -d '{ "author": "User 123", "body": "Hello world" }' \
    -H 'content-type: application/json' "https://$DEPLOYMENT_NAME.convex.site/postMessage"
```

Like other Convex functions, you can view your HTTP actions in the [Functions view](/dashboard/deployments/functions.md) of [your dashboard](https://dashboard.convex.dev/) and view logs produced by them in the [Logs view](/dashboard/deployments/logs.md).

## Limits[​](#limits "Direct link to Limits")

HTTP actions run in the same environment as queries and mutations so also do not have access to Node.js-specific JavaScript APIs. HTTP actions can call [actions](/functions/actions.md), which can run in Node.js.

Like [actions](/functions/actions.md#error-handling), HTTP actions may have side-effects and will not be automatically retried by Convex when errors occur. It is a responsibility of the caller to handle errors and retry the request if appropriate.

Request and response size is limited to 20MB.

HTTP actions support request and response body types of `.text()`, `.json()`, `.blob()`, and `.arrayBuffer()`.

Note that you don't need to define an HTTP action to call your queries, mutations and actions over HTTP if you control the caller, since you can use use the JavaScript [`ConvexHttpClient`](/api/classes/browser.ConvexHttpClient.md) or the [Python client](/client/python.md) to call these functions directly.

## Debugging[​](#debugging "Direct link to Debugging")

### Step 1: Check that your HTTP actions were deployed.[​](#step-1-check-that-your-http-actions-were-deployed "Direct link to Step 1: Check that your HTTP actions were deployed.")

Check the [functions page](https://dashboard.convex.dev/deployment/functions) in the dashboard and make sure there's an entry called `http`.

If not, double check that you've defined your HTTP actions with the `httpRouter` in a file called `http.js` or `http.ts` (the name of the file must match exactly), and that `npx convex dev` has no errors.

### Step 2: Check that you can access your endpoint using curl[​](#step-2-check-that-you-can-access-your-endpoint-using-curl "Direct link to Step 2: Check that you can access your endpoint using curl")

Get your URL from the dashboard under [Settings](https://dashboard.convex.dev/deployment/settings) > URL and Deploy Key.

Make sure this is the URL that ends in **`.convex.site`**, and not `.convex.cloud`. E.g. `https://happy-animal-123.convex.site`

Run a `curl` command to hit one of your defined endpoints, potentially defining a new endpoint specifically for testing

```
curl -X GET https://<deployment name>.convex.site/myEndpoint
```

Check the [logs page](https://dashboard.convex.dev/deployment/logs) in the dashboard to confirm that there's an entry for your HTTP action.

### Step 3: Check the request being made by your browser[​](#step-3-check-the-request-being-made-by-your-browser "Direct link to Step 3: Check the request being made by your browser")

If you've determined that your HTTP actions have been deployed and are accessible via curl, but there are still issues requesting them from your app, check the exact requests being made by your browser.

Open the *Network* tab in your browser's developer tools, and trigger your HTTP requests.

Check that this URL matches what you tested earlier with curl -- it ends in `.convex.site` and has the right deployment name.

You should be able to see these requests in the dashboard [logs page](https://dashboard.convex.dev/deployment/logs).

If you see "CORS error" or messages in the browser console like `Access to fetch at '...' from origin '...' has been blocked by CORS policy`, you likely need to configure CORS headers and potentially add a handler for the pre-flight `OPTIONS` request. See [this section](/functions/http-actions.md#cors) below.

## Common patterns[​](#common-patterns "Direct link to Common patterns")

### File Storage[​](#file-storage "Direct link to File Storage")

HTTP actions can be used to handle uploading and fetching stored files, see:

* [Uploading files via an HTTP action](/file-storage/upload-files.md#uploading-files-via-an-http-action)
* [Serving files from HTTP actions](/file-storage/serve-files.md#serving-files-from-http-actions)

### CORS[​](#cors "Direct link to CORS")

To make requests to HTTP actions from a website you need to add [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers to your HTTP actions.

There are existing resources for exactly which CORS headers are required based on the use case. [This site](https://httptoolkit.com/will-it-cors/) provides an interactive walkthrough for what CORS headers to add. Here's an example of adding CORS headers to a Convex HTTP action:

convex/http.ts

TS

```
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/sendImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    const author = new URL(request.url).searchParams.get("author");
    if (author === null) {
      return new Response("Author is required", {
        status: 400,
      });
    }

    await ctx.runMutation(api.messages.sendImage, { storageId, author });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        // e.g. https://mywebsite.com, configured on your Convex dashboard
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        Vary: "origin",
      }),
    });
  }),
});
```

Here's an example of handling a pre-flight `OPTIONS` request:

convex/http.ts

TS

```
// Pre-flight request for /sendImage
http.route({
  path: "/sendImage",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});
```

### Authentication[​](#authentication "Direct link to Authentication")

You can leverage Convex's built-in [authentication](/auth.md) integration and access a user identity from [`ctx.auth.getUserIdentity()`](/api/interfaces/server.Auth.md#getuseridentity). To do this call your endpoint with an `Authorization` header including a JWT token:

myPage.ts

TS

```
const jwtToken = "...";

fetch("https://<deployment name>.convex.site/myAction", {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
});
```
# Next.js Quickstart

Convex + Next.js

Convex is an all-in-one backend and database that integrates quickly and easily with Next.js.

Once you've gotten started, see how to set up [hosting](/production/hosting/.md), [server rendering](/client/nextjs/app-router/server-rendering.md), and [auth](https://docs.convex.dev/client/nextjs/).

To get setup quickly with Convex and Next.js run

**`npm create convex@latest`**

**``**

or follow the guide below.

***

Learn how to query data from Convex in a Next.js app using the App Router and

TypeScript

Alternatively see the [Pages Router](/client/nextjs/pages-router/quickstart.md) version of this quickstart.

1. Create a Next.js app

   Create a Next.js app using the `npx create-next-app` command.

   Choose the default option for every prompt (hit Enter).

   ```
   npx create-next-app@latest my-app
   ```

2. Install the Convex client and server library

   To get started, install the `convex` package.

   Navigate to your app and install `convex`.

   ```
   cd my-app && npm install convex
   ```

3. Set up a Convex dev deployment

   Next, run `npx convex dev`. This will prompt you to log in with GitHub, create a project, and save your production and deployment URLs.

   It will also create a `convex/` folder for you to write your backend API functions in. The `dev` command will then continue running to sync your functions with your dev deployment in the cloud.

   ```
   npx convex dev
   ```

4. Create sample data for your database

   In a new terminal window, create a `sampleData.jsonl` file with some sample data.

   sampleData.jsonl

   ```
   {"text": "Buy groceries", "isCompleted": true}
   {"text": "Go for a swim", "isCompleted": true}
   {"text": "Integrate Convex", "isCompleted": false}
   ```

5. Add the sample data to your database

   Use the [`import`](/database/import-export/import.md) command to add a `tasks` table with the sample data into your Convex database.

   ```
   npx convex import --table tasks sampleData.jsonl
   ```

6. Expose a database query

   In the `convex/` folder, add a new file `tasks.ts` with a query function that loads the data.

   Exporting a query function from this file declares an API function named after the file and the export name: `api.tasks.get`.

   convex/tasks.ts

   TS

   ```
   import { query } from "./_generated/server";

   export const get = query({
     args: {},
     handler: async (ctx) => {
       return await ctx.db.query("tasks").collect();
     },
   });
   ```

7. Create a client component for the Convex provider

   For `<ConvexProvider>` to work on the client, `ConvexReactClient` must be passed to it.

   In the `app/` folder, add a new file `ConvexClientProvider.tsx` with the following code. This creates a client component that wraps `<ConvexProvider>` and passes it the `<ConvexReactClient>`.

   app/ConvexClientProvider.tsx

   TS

   ```
   "use client";

   import { ConvexProvider, ConvexReactClient } from "convex/react";
   import { ReactNode } from "react";

   const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

   export function ConvexClientProvider({ children }: { children: ReactNode }) {
     return <ConvexProvider client={convex}>{children}</ConvexProvider>;
   }
   ```

8. Wire up the ConvexClientProvider

   In `app/layout.tsx`, wrap the children of the `body` element with the `<ConvexClientProvider>`.

   app/layout.tsx

   TS

   ```
   import type { Metadata } from "next";
   import { Geist, Geist_Mono } from "next/font/google";
   import "./globals.css";
   import { ConvexClientProvider } from "./ConvexClientProvider";

   const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
   });

   const geistMono = Geist_Mono({
     variable: "--font-geist-mono",
     subsets: ["latin"],
   });

   export const metadata: Metadata = {
     title: "Create Next App",
     description: "Generated by create next app",
   };

   export default function RootLayout({
     children,
   }: Readonly<{
     children: React.ReactNode;
   }>) {
     return (
       <html lang="en">
         <body
           className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
           <ConvexClientProvider>{children}</ConvexClientProvider>
         </body>
       </html>
     );
   }
   ```

9. Display the data in your app

   In `app/page.tsx`, use the `useQuery()` hook to fetch from your `api.tasks.get` API function.

   app/page.tsx

   TS

   ```
   "use client";

   import Image from "next/image";
   import { useQuery } from "convex/react";
   import { api } from "../convex/_generated/api";

   export default function Home() {
     const tasks = useQuery(api.tasks.get);
     return (
       <main className="flex min-h-screen flex-col items-center justify-between p-24">
         {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
       </main>
     );
   }
   ```

10. Start the app

    Run your Next.js development server, open <http://localhost:3000> in a browser, and see the list of tasks.

    ```
    npm run dev
    ```

See the complete [Next.js documentation](/client/nextjs/app-router/.md).
# Convex Overview

Convex is the open source, reactive database where queries are TypeScript code running right in the database. Just like React components react to state changes, Convex queries react to database changes.

Convex provides a database, a place to write your server functions, and client libraries. It makes it easy to build and scale dynamic live-updating apps.

The following diagram shows the standard three-tier app architecture that Convex enables. We'll start at the bottom and work our way up to the top of this diagram.

![Convex in your app](/assets/images/basic-diagram-8ad312f058c3cf7e15c3396e46eedb48.png)

## Database[​](#database "Direct link to Database")

The [database](/database.md) is at the core of Convex. The Convex database is automatically provisioned when you create your project. There is no connection setup or cluster management.

info

In Convex, your database queries are just [TypeScript code](/database/reading-data/.md) written in your [server functions](/functions.md). There is no SQL to write. There are no ORMs needed.

The Convex database is reactive. Whenever any data on which a query depends changes, the query is rerun, and client subscriptions are updated.

Convex is a "document-relational" database. "Document" means you put JSON-like nested objects into your database. "Relational" means you have tables with relations, like `tasks` assigned to a `user` using IDs to reference documents in other tables.

The Convex cloud offering runs on top of Amazon RDS using MySQL as its persistence layer. The Open Source version uses SQLite, Postgres and MySQL. The database is ACID-compliant and uses [serializable isolation and optimistic concurrency control](/database/advanced/occ.md). All that to say, Convex provides the strictest possible transactional guarantees, and you never see inconsistent data.

## Server functions[​](#server-functions "Direct link to Server functions")

When you create a new Convex project, you automatically get a `convex/` folder where you write your [server functions](/functions.md). This is where all your backend application logic and database query code live.

Example TypeScript server functions that read (query) and write (mutation) to the database.

convex/tasks.ts

```
// A Convex query function
export const getAllOpenTasks = query({
  args: {},
  handler: async (ctx, args) => {
    // Query the database to get all items that are not completed
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_completed", (q) => q.eq("completed", false))
      .collect();
    return tasks;
  },
});

// A Convex mutation function
export const setTaskCompleted = mutation({
  args: { taskId: v.id("tasks"), completed: v.boolean() },
  handler: async (ctx, { taskId, completed }) => {
    // Update the database using TypeScript
    await ctx.db.patch("tasks", taskId, { completed });
  },
});
```

You read and write to your database through query or mutation functions. [Query functions](/functions/query-functions.md) are pure functions that can only read from the database. [Mutation functions](/functions/mutation-functions.md) are transactions that can read or write from the database. These two database functions are [not allowed to take any non-deterministic](/functions/runtimes.md#restrictions-on-queries-and-mutations) actions like network requests to ensure transactional guarantees.

info

The entire Convex mutation function is a transaction. There are no `begin` or `end` transaction statements to write. Convex automatically retries the function on conflicts, and you don't have to manage anything.

Convex also provides standard general-purpose serverless functions called actions. [Action functions](/functions/actions.md) can make network requests. They have to call query or mutation functions to read and write to the database. You use actions to call LLMs or send emails.

You can also durably schedule Convex functions via the [scheduler](/scheduling/scheduled-functions.md) or [cron jobs](/scheduling/cron-jobs.md). Scheduling lets you build workflows like emailing a new user a day later if they haven't performed an onboarding task.

You call your Convex functions via [client libraries](/client/react.md) or directly via [HTTP](/http-api/.md#functions-api).

## Client libraries[​](#client-libraries "Direct link to Client libraries")

Convex client libraries keep your frontend synced with the results of your server functions.

```
// In your React component
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function TaskList() {
  const data = useQuery(api.tasks.getAllOpenTasks);
  return data ?? "Loading...";
}
```

Like the `useState` hook that updates your React component when local state changes, the Convex `useQuery` hook automatically updates your component whenever the result of your query changes. There's no manual subscription management or state synchronization needed.

When calling query functions, the client library subscribes to the results of the function. Convex tracks the dependencies of your query functions, including what data was read from the database. Whenever relevant data in the database changes, the Convex automatically reruns the query and sends the result to the client.

The client library also queues up mutations in memory to send to the server. As mutations execute and cause query results to update, the client library keeps your app state consistent. It updates all subscriptions to the same logical moment in time in the database.

Convex provides client libraries for nearly all popular web and native app frameworks. Client libraries connect to your Convex deployment via WebSockets. You can then call your public Convex functions [through the library](/client/react.md#fetching-data). You can also use Convex with [HTTP directly](/http-api/.md#functions-api), you just won't get the automatic subscriptions.

## Putting it all together[​](#putting-it-all-together "Direct link to Putting it all together")

Let's return to the `getAllOpenTasks` Convex query function from earlier that gets all tasks that are not marked as `completed`:

convex/tasks.ts

```
export const getAllOpenTasks = query({
  args: {},
  handler: async (ctx, args) => {
    // Query the database to get all items that are not completed
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_completed", (q) => q.eq("completed", false))
      .collect();
    return tasks;
  },
});
```

Let's follow along what happens when you subscribe to this query:

![Convex data flow](/assets/images/convex-query-subscription-945e7990515e438ab4385f9b4803bbd4.png)

The web app uses the `useQuery` hook to subscribe to this query, and the following happens to get an initial value:

* The Convex client sends a message to the Convex server to subscribe to the query
* The Convex server runs the function, which reads data from the database
* The Convex server sends a message to the client with the function's result

In this case the initial result looks like this (1):

```
[
  { _id: "e4g", title: "Grocery shopping", complete: false },
  { _id: "u9v", title: "Plant new flowers", complete: false },
];
```

Then you use a mutation to mark an item as completed (2). Convex then reruns the query (3) to get an updated result. And pushes the result to the web app via the WebSocket connection (4):

```
[
  { _id: "e4g", title: "Grocery shopping", complete: false },
];
```

## Beyond reactivity[​](#beyond-reactivity "Direct link to Beyond reactivity")

Beyond reactivity, Convex's architecture is crucial for a deeper reason. Convex does not let your app have inconsistent state at any layer of the stack.

To illustrate this, let's imagine you're building a shopping cart for an e-commerce store.

![Convex in your app](/assets/images/convex-swaghaus-dcc9919685db6a7f34378afc500f68cd.png)

On the product listing page, you have two numbers, one showing the number of items remaining in stock and another showing the number of items in your shopping cart. Each number is a result of a different query function.

Every time you press the "Add to Cart" button, a mutation is called to remove one item from the stock and add it to the shopping cart.

The mutation to change the cart runs in a transaction, so your database is always in a consistent state. The reactive database knows that the queries showing the number of items in stock and the number of items in the shopping cart both need to be updated. The queries are invalidated and rerun. The results are pushed to the web app via the WebSocket connection.

The client library makes sure that both queries update at the same time in the web app since they reflect a singular moment in time in your database. You never have a moment where those numbers don't add up. Your app always shows consistent data.

You can see this example in action in the [Swaghaus sample app](https://swaghaus.biz/).

## For human and AI generated code[​](#for-human-and-ai-generated-code "Direct link to For human and AI generated code")

Convex is designed around a small set of composable abstractions with strong guarantees that result in code that is not only faster to write, it’s easier to read and maintain, whether written by a team member or an LLM. Key features make sure you get bug-free AI generated code:

1. **Queries are Just TypeScript** Your database queries are pure TypeScript functions with end-to-end type safety and IDE support. This means AI can generate database code using the large training set of TypeScript code without switching to SQL.
2. **Less Code for the Same Work** Since so much infrastructure and boiler plate is automatically managed by Convex there is less code to write, and thus less code to get wrong.
3. **Automatic Reactivity** The reactive system automatically tracks data dependencies and updates your UI. AI doesn't need to manually manage subscriptions, WebSocket connections, or complex state synchronization—Convex handles all of this automatically.
4. **Transactional Guarantees** Queries are read-only and mutations run in transactions. These constraints make it nearly impossible for AI to write code that could corrupt your data or leave your app in an inconsistent state.

Together, these features mean AI can focus on your business logic while Convex's guarantees prevent common failure modes.

## Learn more[​](#learn-more "Direct link to Learn more")

[YouTube video player](https://www.youtube.com/embed/3d29eKJ2Vws)

If you are intrigued about the details of how Convex pulls this all off, you can read Convex co-founder Sujay's excellent [How Convex Works](https://stack.convex.dev/how-convex-works) blog post.

Now that you have a good sense of how Convex fits in your app. Let's walk through the overall workflow of setting up and launching a Convex app.
# Best Practices

This is a list of best practices and common anti-patterns around using Convex. We recommend going through this list before broadly releasing your app to production. You may choose to try using all of these best practices from the start, or you may wait until you've gotten major parts of your app working before going through and adopting the best practices here.

## Await all Promises[​](#await-all-promises "Direct link to Await all Promises")

### Why?[​](#why "Direct link to Why?")

Convex functions use async / await. If you don't await all your promises (e.g. `await ctx.scheduler.runAfter`, `await ctx.db.patch`), you may run into unexpected behavior (e.g. failing to schedule a function) or miss handling errors.

### How?[​](#how "Direct link to How?")

We recommend the [no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/) rule of typescript-eslint.

## Avoid `.filter` on database queries[​](#avoid-filter-on-database-queries "Direct link to avoid-filter-on-database-queries")

### Why?[​](#why-1 "Direct link to Why?")

Filtering in code instead of using the `.filter` syntax has the same performance, and is generally easier code to write. Conditions in `.withIndex` or `.withSearchIndex` are more efficient than `.filter` or filtering in code, so almost all uses of `.filter` should either be replaced with a `.withIndex` or `.withSearchIndex` condition, or written as TypeScript code.

Read through the [indexes documentation](/database/reading-data/indexes/indexes-and-query-perf.md) for an overview of how to define indexes and how they work.

### Examples[​](#examples "Direct link to Examples")

convex/messages.ts

TS

```
// ❌
const tomsMessages = ctx.db
  .query("messages")
  .filter((q) => q.eq(q.field("author"), "Tom"))
  .collect();

// ✅
// Option 1: Use an index
const tomsMessages = await ctx.db
  .query("messages")
  .withIndex("by_author", (q) => q.eq("author", "Tom"))
  .collect();

// Option 2: Filter in code
const allMessages = await ctx.db.query("messages").collect();
const tomsMessages = allMessages.filter((m) => m.author === "Tom");
```

### How?[​](#how-1 "Direct link to How?")

Search for `.filter` in your Convex codebase — a regex like `\.filter\(\(?q` will probably find all the ones on database queries.

Decide whether they should be replaced with a `.withIndex` condition — per [this section](/understanding/best-practices/.md#only-use-collect-with-a-small-number-of-results), if you are filtering over a large (1000+) or potentially unbounded number of documents, you should use an index. If not using a `.withIndex` / `.withSearchIndex` condition, consider replacing them with a filter in code for more readability and flexibility.

See [this article](https://stack.convex.dev/complex-filters-in-convex) for more strategies for filtering.

### Exceptions[​](#exceptions "Direct link to Exceptions")

Using `.filter` on a paginated query (`.paginate`) has advantages over filtering in code. The paginated query will return the number of documents requested, including the `.filter` condition, so filtering in code afterwards can result in a smaller page or even an empty page. Using `.withIndex` on a paginated query will still be more efficient than a `.filter`.

## Only use `.collect` with a small number of results[​](#only-use-collect-with-a-small-number-of-results "Direct link to only-use-collect-with-a-small-number-of-results")

### Why?[​](#why-2 "Direct link to Why?")

All results returned from `.collect` count towards database bandwidth (even ones filtered out by `.filter`). It also means that if any document in the result changes, the query will re-run or the mutation will hit a conflict.

If there's a chance the number of results is large (say 1000+ documents), you should use an index to filter the results further before calling `.collect`, or find some other way to avoid loading all the documents such as using pagination, denormalizing data, or changing the product feature.

### Example[​](#example "Direct link to Example")

**Using an index:**

convex/movies.ts

TS

```
// ❌ -- potentially unbounded
const allMovies = await ctx.db.query("movies").collect();
const moviesByDirector = allMovies.filter(
  (m) => m.director === "Steven Spielberg",
);

// ✅ -- small number of results, so `collect` is fine
const moviesByDirector = await ctx.db
  .query("movies")
  .withIndex("by_director", (q) => q.eq("director", "Steven Spielberg"))
  .collect();
```

**Using pagination:**

convex/movies.ts

TS

```
// ❌ -- potentially unbounded
const watchedMovies = await ctx.db
  .query("watchedMovies")
  .withIndex("by_user", (q) => q.eq("user", "Tom"))
  .collect();

// ✅ -- using pagination, showing recently watched movies first
const watchedMovies = await ctx.db
  .query("watchedMovies")
  .withIndex("by_user", (q) => q.eq("user", "Tom"))
  .order("desc")
  .paginate(paginationOptions);
```

**Using a limit or denormalizing:**

convex/movies.ts

TS

```
// ❌ -- potentially unbounded
const watchedMovies = await ctx.db
  .query("watchedMovies")
  .withIndex("by_user", (q) => q.eq("user", "Tom"))
  .collect();
const numberOfWatchedMovies = watchedMovies.length;

// ✅ -- Show "99+" instead of needing to load all documents
const watchedMovies = await ctx.db
  .query("watchedMovies")
  .withIndex("by_user", (q) => q.eq("user", "Tom"))
  .take(100);
const numberOfWatchedMovies =
  watchedMovies.length === 100 ? "99+" : watchedMovies.length.toString();

// ✅ -- Denormalize the number of watched movies in a separate table
const watchedMoviesCount = await ctx.db
  .query("watchedMoviesCount")
  .withIndex("by_user", (q) => q.eq("user", "Tom"))
  .unique();
```

### How?[​](#how-2 "Direct link to How?")

Search for `.collect` in your Convex codebase (a regex like `\.collect\(` will probably find these). And think through whether the number of results is small. This function health page in the dashboard can also help surface these.

You can also check automatically that `.collect()` is avoided by enabling the [`@convex-dev/no-query-collect` ESLint rule](/eslint.md#no-query-collect).

The [aggregate component](https://www.npmjs.com/package/@convex-dev/aggregate) or [database triggers](https://stack.convex.dev/triggers) can be helpful patterns for denormalizing data.

### Exceptions[​](#exceptions-1 "Direct link to Exceptions")

If you're doing something that requires loading a large number of documents (e.g. performing a migration, making a summary), you may want to use an action to load them in batches via separate queries / mutations.

## Check for redundant indexes[​](#check-for-redundant-indexes "Direct link to Check for redundant indexes")

### Why?[​](#why-3 "Direct link to Why?")

Indexes like `by_foo` and `by_foo_and_bar` are usually redundant (you only need `by_foo_and_bar`). Reducing the number of indexes saves on database storage and reduces the overhead of writing to the table.

convex/teams.ts

TS

```
// ❌
const allTeamMembers = await ctx.db
  .query("teamMembers")
  .withIndex("by_team", (q) => q.eq("team", teamId))
  .collect();
const currentUserId = /* get current user id from `ctx.auth` */
const currentTeamMember = await ctx.db
  .query("teamMembers")
  .withIndex("by_team_and_user", (q) =>
    q.eq("team", teamId).eq("user", currentUserId),
  )
  .unique();

// ✅
// Just don't include a condition on `user` when querying for results on `team`
const allTeamMembers = await ctx.db
  .query("teamMembers")
  .withIndex("by_team_and_user", (q) => q.eq("team", teamId))
  .collect();
const currentUserId = /* get current user id from `ctx.auth` */
const currentTeamMember = await ctx.db
  .query("teamMembers")
  .withIndex("by_team_and_user", (q) =>
    q.eq("team", teamId).eq("user", currentUserId),
  )
  .unique();
```

### How?[​](#how-3 "Direct link to How?")

Look through your indexes, either in your `schema.ts` file or in the dashboard, and look for any indexes where one is a prefix of another.

### Exceptions[​](#exceptions-2 "Direct link to Exceptions")

`.index("by_foo", ["foo"])` is really an index on the properties `foo` and `_creationTime`, while `.index("by_foo_and_bar", ["foo", "bar"])` is an index on the properties `foo`, `bar`, and `_creationTime`. If you have queries that need to be sorted by `foo` and then `_creationTime`, then you need both indexes.

For example, `.index("by_channel", ["channel"])` on a table of messages can be used to query for the most recent messages in a channel, but `.index("by_channel_and_author", ["channel", "author"])` could not be used for this since it would first sort the messages by `author`.

## Use argument validators for all public functions[​](#use-argument-validators-for-all-public-functions "Direct link to Use argument validators for all public functions")

### Why?[​](#why-4 "Direct link to Why?")

Public functions can be called by anyone, including potentially malicious attackers trying to break your app. [Argument validators](/functions/validation.md) (as well as return value validators) help ensure you're getting the traffic you expect.

### Example[​](#example-1 "Direct link to Example")

convex/movies.ts

TS

```
// ❌ -- `id` and `update` are not validated, so a client could pass
//       any Convex value (the type at runtime could mismatch the
//       TypeScript type). In particular, `update` could contain
//       fields other than `title` and `director`.
export const updateMovie = mutation({
  handler: async (
    ctx,
    {
      id,
      update,
    }: {
      id: Id<"movies">;
      update: Pick<Doc<"movies">, "title" | "director">;
    },
  ) => {
    await ctx.db.patch("movies", id, update);
  },
});

// ✅ -- This can only be called with an ID from the movies table,
//       and an `update` object with only the `title`/`director` fields
export const updateMovie = mutation({
  args: {
    id: v.id("movies"),
    update: v.object({
      title: v.string(),
      director: v.string(),
    }),
  },
  handler: async (ctx, { id, update }) => {
    await ctx.db.patch("movies", id, update);
  },
});
```

### How?[​](#how-4 "Direct link to How?")

Search for `query`, `mutation`, and `action` in your Convex codebase, and ensure that all of them have argument validators (and optionally return value validators).

You can also check automatically that your functions have argument validators with the [`@convex-dev/require-argument-validators` ESLint rule](/eslint.md#require-argument-validators).

If you use HTTP actions, you may want to use an argument validation library like [Zod](https://zod.dev) to validate that the HTTP request is the shape you expect.

## Use some form of access control for all public functions[​](#use-some-form-of-access-control-for-all-public-functions "Direct link to Use some form of access control for all public functions")

### Why?[​](#why-5 "Direct link to Why?")

Public functions can be called by anyone, including potentially malicious attackers trying to break your app. If portions of your app should only be accessible when the user is signed in, make sure all these Convex functions check that `ctx.auth.getUserIdentity()` is set.

You may also have specific checks, like only loading messages that were sent to or from the current user, which you'll want to apply in every relevant public function.

Favoring more granular functions like `setTeamOwner` over `updateTeam` allows more granular checks for which users can do what.

Access control checks should either use `ctx.auth.getUserIdentity()` or a function argument that is unguessable (e.g. a UUID, or a Convex ID, provided that this ID is never exposed to any client but the one user). In particular, don't use a function argument which could be spoofed (e.g. email) for access control checks.

### Example[​](#example-2 "Direct link to Example")

convex/teams.ts

TS

```
// ❌ -- no checks! anyone can update any team if they get the ID
export const updateTeam = mutation({
  args: {
    id: v.id("teams"),
    update: v.object({
      name: v.optional(v.string()),
      owner: v.optional(v.id("users")),
    }),
  },
  handler: async (ctx, { id, update }) => {
    await ctx.db.patch("teams", id, update);
  },
});

// ❌ -- checks access, but uses `email` which could be spoofed
export const updateTeam = mutation({
  args: {
    id: v.id("teams"),
    update: v.object({
      name: v.optional(v.string()),
      owner: v.optional(v.id("users")),
    }),
    email: v.string(),
  },
  handler: async (ctx, { id, update, email }) => {
    const teamMembers = /* load team members */
    if (!teamMembers.some((m) => m.email === email)) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch("teams", id, update);
  },
});

// ✅ -- checks access, and uses `ctx.auth`, which cannot be spoofed
export const updateTeam = mutation({
  args: {
    id: v.id("teams"),
    update: v.object({
      name: v.optional(v.string()),
      owner: v.optional(v.id("users")),
    }),
  },
  handler: async (ctx, { id, update }) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) {
      throw new Error("Unauthorized");
    }
    const isTeamMember = /* check if user is a member of the team */
    if (!isTeamMember) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch("teams", id, update);
  },
});

// ✅ -- separate functions which have different access control
export const setTeamOwner = mutation({
  args: {
    id: v.id("teams"),
    owner: v.id("users"),
  },
  handler: async (ctx, { id, owner }) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) {
      throw new Error("Unauthorized");
    }
    const isTeamOwner = /* check if user is the owner of the team */
    if (!isTeamOwner) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch("teams", id, { owner: owner });
  },
});

export const setTeamName = mutation({
  args: {
    id: v.id("teams"),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) {
      throw new Error("Unauthorized");
    }
    const isTeamMember = /* check if user is a member of the team */
    if (!isTeamMember) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch("teams", id, { name: name });
  },
});
```

### How?[​](#how-5 "Direct link to How?")

Search for `query`, `mutation`, `action`, and `httpAction` in your Convex codebase, and ensure that all of them have some form of access control. [Custom functions](https://github.com/get-convex/convex-helpers/blob/main/packages/convex-helpers/README.md#custom-functions) like [`authenticatedQuery`](https://stack.convex.dev/custom-functions#modifying-the-ctx-argument-to-a-server-function-for-user-auth) can be helpful.

Some apps use Row Level Security (RLS) to check access to each document automatically whenever it's loaded, as described in [this article](https://stack.convex.dev/row-level-security). Alternatively, you can check access in each Convex function instead of checking access for each document.

Helper functions for common checks and common operations can also be useful -- e.g. `isTeamMember`, `isTeamAdmin`, `loadTeam` (which throws if the current user does not have access to the team).

## Only schedule and `ctx.run*` internal functions[​](#only-schedule-and-ctxrun-internal-functions "Direct link to only-schedule-and-ctxrun-internal-functions")

### Why?[​](#why-6 "Direct link to Why?")

Public functions can be called by anyone, including potentially malicious attackers trying to break your app, and should be carefully audited to ensure they can't be used maliciously. Functions that are only called within Convex can be marked as internal, and relax these checks since Convex will ensure that internal functions can only be called within Convex.

### How?[​](#how-6 "Direct link to How?")

Search for `ctx.runQuery`, `ctx.runMutation`, and `ctx.runAction` in your Convex codebase. Also search for `ctx.scheduler` and check the `crons.ts` file. Ensure all of these use `internal.foo.bar` functions instead of `api.foo.bar` functions.

If you have code you want to share between a public Convex function and an internal Convex function, create a helper function that can be called from both. The public function will likely have additional access control checks.

Alternatively, make sure that `api` from `_generated/api.ts` is never used in your Convex functions directory.

### Examples[​](#examples-1 "Direct link to Examples")

convex/teams.ts

TS

```
// ❌ -- using `api`
export const sendMessage = mutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (ctx, { body, author }) => {
    // add message to the database
  },
});

// crons.ts
crons.daily(
  "send daily reminder",
  { hourUTC: 17, minuteUTC: 30 },
  api.messages.sendMessage,
  { author: "System", body: "Share your daily update!" },
);

// ✅ Using `internal`
import { MutationCtx } from './_generated/server';
async function sendMessageHelper(
  ctx: MutationCtx,
  args: { body: string; author: string },
) {
  // add message to the database
}

export const sendMessage = mutation({
  args: {
    body: v.string(),
  },
  handler: async (ctx, { body }) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) {
      throw new Error("Unauthorized");
    }
    await sendMessageHelper(ctx, { body, author: user.name ?? "Anonymous" });
  },
});

export const sendInternalMessage = internalMutation({
  args: {
    body: v.string(),
    // don't need to worry about `author` being spoofed since this is an internal function
    author: v.string(),
  },
  handler: async (ctx, { body, author }) => {
    await sendMessageHelper(ctx, { body, author });
  },
});

// crons.ts
crons.daily(
  "send daily reminder",
  { hourUTC: 17, minuteUTC: 30 },
  internal.messages.sendInternalMessage,
  { author: "System", body: "Share your daily update!" },
);
```

## Use helper functions to write shared code[​](#use-helper-functions-to-write-shared-code "Direct link to Use helper functions to write shared code")

### Why?[​](#why-7 "Direct link to Why?")

Most logic should be written as plain TypeScript functions, with the `query`, `mutation`, and `action` wrapper functions being a thin wrapper around one or more helper function.

Concretely, most of your code should live in a directory like `convex/model`, and your public API, which is defined with `query`, `mutation`, and `action`, should have very short functions that mostly just call into `convex/model`.

Organizing your code this way makes several of the refactors mentioned in this list easier to do.

See the [TypeScript page](/understanding/best-practices/typescript.md) for useful types.

### Example[​](#example-3 "Direct link to Example")

**❌** This example overuses `ctx.runQuery` and `ctx.runMutation`, which is discussed more in the [Avoid sequential `ctx.runMutation` / `ctx.runQuery` from actions](/understanding/best-practices/.md#avoid-sequential-ctxrunmutation--ctxrunquery-calls-from-actions) section.

convex/users.ts

TS

```
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new Error("Unauthorized");
    }
    const user = /* query ctx.db to load the user */
    const userSettings = /* load other documents related to the user */
    return { user, settings: userSettings };
  },
});
```

convex/conversations.ts

TS

```
export const listMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const user = await ctx.runQuery(api.users.getCurrentUser);
    const conversation = await ctx.db.get("conversations", conversationId);
    if (conversation === null || !conversation.members.includes(user._id)) {
      throw new Error("Unauthorized");
    }
    const messages = /* query ctx.db to load the messages */
    return messages;
  },
});

export const summarizeConversation = action({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const messages = await ctx.runQuery(api.conversations.listMessages, {
      conversationId,
    });
    const summary = /* call some external service to summarize the conversation */
    await ctx.runMutation(api.conversations.addSummary, {
      conversationId,
      summary,
    });
  },
});
```

**✅** Most of the code here is now in the `convex/model` directory. The API for this application is in `convex/conversations.ts`, which contains very little code itself.

convex/model/users.ts

TS

```
import { QueryCtx } from '../_generated/server';

export async function getCurrentUser(ctx: QueryCtx) {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (userIdentity === null) {
    throw new Error("Unauthorized");
  }
  const user = /* query ctx.db to load the user */
  const userSettings = /* load other documents related to the user */
  return { user, settings: userSettings };
}
```

convex/model/conversations.ts

TS

```
import { QueryCtx, MutationCtx } from '../_generated/server';
import * as Users from './users';

export async function ensureHasAccess(
  ctx: QueryCtx,
  { conversationId }: { conversationId: Id<"conversations"> },
) {
  const user = await Users.getCurrentUser(ctx);
  const conversation = await ctx.db.get("conversations", conversationId);
  if (conversation === null || !conversation.members.includes(user._id)) {
    throw new Error("Unauthorized");
  }
  return conversation;
}

export async function listMessages(
  ctx: QueryCtx,
  { conversationId }: { conversationId: Id<"conversations"> },
) {
  await ensureHasAccess(ctx, { conversationId });
  const messages = /* query ctx.db to load the messages */
  return messages;
}

export async function addSummary(
  ctx: MutationCtx,
  {
    conversationId,
    summary,
  }: { conversationId: Id<"conversations">; summary: string },
) {
  await ensureHasAccess(ctx, { conversationId });
  await ctx.db.patch("conversations", conversationId, { summary });
}

export async function generateSummary(
  messages: Doc<"messages">[],
  conversationId: Id<"conversations">,
) {
  const summary = /* call some external service to summarize the conversation */
  return summary;
}
```

convex/conversations.ts

TS

```
import * as Conversations from './model/conversations';

export const addSummary = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    summary: v.string(),
  },
  handler: async (ctx, { conversationId, summary }) => {
    await Conversations.addSummary(ctx, { conversationId, summary });
  },
});

export const listMessages = internalQuery({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    return Conversations.listMessages(ctx, { conversationId });
  },
});

export const summarizeConversation = action({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const messages = await ctx.runQuery(internal.conversations.listMessages, {
      conversationId,
    });
    const summary = await Conversations.generateSummary(
      messages,
      conversationId,
    );
    await ctx.runMutation(internal.conversations.addSummary, {
      conversationId,
      summary,
    });
  },
});
```

## Use `runAction` only when using a different runtime[​](#use-runaction-only-when-using-a-different-runtime "Direct link to use-runaction-only-when-using-a-different-runtime")

### Why?[​](#why-8 "Direct link to Why?")

Calling `runAction` has more overhead than calling a plain TypeScript function. It counts as an extra function call with its own memory and CPU usage, while the parent action is doing nothing except waiting for the result. Therefore, `runAction` should almost always be replaced with calling a plain TypeScript function. However, if you want to call code that requires Node.js from a function in the Convex runtime (e.g. using a library that requires Node.js), then you can use `runAction` to call the Node.js code.

### Example[​](#example-4 "Direct link to Example")

convex/scrape.ts

TS

```
// ❌ -- using `runAction`
export const scrapeWebsite = action({
  args: {
    siteMapUrl: v.string(),
  },
  handler: async (ctx, { siteMapUrl }) => {
    const siteMap = await fetch(siteMapUrl);
    const pages = /* parse the site map */
    await Promise.all(
      pages.map((page) =>
        ctx.runAction(internal.scrape.scrapeSinglePage, { url: page }),
      ),
    );
  },
});
```

convex/model/scrape.ts

TS

```
import { ActionCtx } from '../_generated/server';

// ✅ -- using a plain TypeScript function
export async function scrapeSinglePage(
  ctx: ActionCtx,
  { url }: { url: string },
) {
  const page = await fetch(url);
  const text = /* parse the page */
  await ctx.runMutation(internal.scrape.addPage, { url, text });
}
```

convex/scrape.ts

TS

```
import * as Scrape from './model/scrape';

export const scrapeWebsite = action({
  args: {
    siteMapUrl: v.string(),
  },
  handler: async (ctx, { siteMapUrl }) => {
    const siteMap = await fetch(siteMapUrl);
    const pages = /* parse the site map */
    await Promise.all(
      pages.map((page) => Scrape.scrapeSinglePage(ctx, { url: page })),
    );
  },
});
```

### How?[​](#how-7 "Direct link to How?")

Search for `runAction` in your Convex codebase, and see if the function it calls uses the same runtime as the parent function. If so, replace the `runAction` with a plain TypeScript function. You may want to structure your functions so the Node.js functions are in a separate directory so it's easier to spot these.

## Avoid sequential `ctx.runMutation` / `ctx.runQuery` calls from actions[​](#avoid-sequential-ctxrunmutation--ctxrunquery-calls-from-actions "Direct link to avoid-sequential-ctxrunmutation--ctxrunquery-calls-from-actions")

### Why?[​](#why-9 "Direct link to Why?")

Each `ctx.runMutation` or `ctx.runQuery` runs in its own transaction, which means if they're called separately, they may not be consistent with each other. If instead we call a single `ctx.runQuery` or `ctx.runMutation`, we're guaranteed that the results we get are consistent.

### How?[​](#how-8 "Direct link to How?")

Audit your calls to `ctx.runQuery` and `ctx.runMutation` in actions. If you see multiple in a row with no other code between them, replace them with a single `ctx.runQuery` or `ctx.runMutation` that handles both things. Refactoring your code to use helper functions will make this easier.

### Example: Queries[​](#example-queries "Direct link to Example: Queries")

convex/teams.ts

TS

```
// ❌ -- this assertion could fail if the team changed between running the two queries
const team = await ctx.runQuery(internal.teams.getTeam, { teamId });
const teamOwner = await ctx.runQuery(internal.teams.getTeamOwner, { teamId });
assert(team.owner === teamOwner._id);
```

convex/teams.ts

TS

```
import * as Teams from './model/teams';
import * as Users from './model/users';

export const sendBillingReminder = action({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, { teamId }) => {
    // ✅ -- this will always pass
    const teamAndOwner = await ctx.runQuery(internal.teams.getTeamAndOwner, {
      teamId,
    });
    assert(teamAndOwner.team.owner === teamAndOwner.owner._id);
    // send a billing reminder email to the owner
  },
});

export const getTeamAndOwner = internalQuery({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, { teamId }) => {
    const team = await Teams.load(ctx, { teamId });
    const owner = await Users.load(ctx, { userId: team.owner });
    return { team, owner };
  },
});
```

### Example: Loops[​](#example-loops "Direct link to Example: Loops")

convex/teams.ts

TS

```
import * as Users from './model/users';

export const importTeams = action({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, { teamId }) => {
    // Fetch team members from an external API
    const teamMembers = await fetchTeamMemberData(teamId);

    // ❌ This will run a separate mutation for inserting each user,
    // which means you lose transaction guarantees like atomicity.
    for (const member of teamMembers) {
      await ctx.runMutation(internal.teams.insertUser, member);
    }
  },
});
export const insertUser = internalMutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, { name, email }) => {
    await Users.insert(ctx, { name, email });
  },
});
```

convex/teams.ts

TS

```
import * as Users from './model/users';

export const importTeams = action({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, { teamId }) => {
    // Fetch team members from an external API
    const teamMembers = await fetchTeamMemberData(teamId);

    // ✅ This action runs a single mutation that inserts all users in the same transaction.
    await ctx.runMutation(internal.teams.insertUsers, teamMembers);
  },
});
export const insertUsers = internalMutation({
  args: { users: v.array(v.object({ name: v.string(), email: v.string() })) },
  handler: async (ctx, { users }) => {
    for (const { name, email } of users) {
      await Users.insert(ctx, { name, email });
    }
  },
});
```

### Exceptions[​](#exceptions-3 "Direct link to Exceptions")

If you're intentionally trying to process more data than fits in a single transaction, like running a migration or aggregating data, then it makes sense to have multiple sequential `ctx.runMutation` / `ctx.runQuery` calls.

Multiple `ctx.runQuery` / `ctx.runMutation` calls are often necessary because the action does a side effect in between them. For example, reading some data, feeding it to an external service, and then writing the result back to the database.

## Use `ctx.runQuery` and `ctx.runMutation` sparingly in queries and mutations[​](#use-ctxrunquery-and-ctxrunmutation-sparingly-in-queries-and-mutations "Direct link to use-ctxrunquery-and-ctxrunmutation-sparingly-in-queries-and-mutations")

### Why?[​](#why-10 "Direct link to Why?")

While these queries and mutations run in the same transaction, and will give consistent results, they have extra overhead compared to plain TypeScript functions. Wanting a TypeScript helper function is much more common than needing `ctx.runQuery` or `ctx.runMutation`.

### How?[​](#how-9 "Direct link to How?")

Audit your calls to `ctx.runQuery` and `ctx.runMutation` in queries and mutations. Unless one of the exceptions below applies, replace them with a plain TypeScript function.

### Exceptions[​](#exceptions-4 "Direct link to Exceptions")

* If you're using components, these require `ctx.runQuery` or `ctx.runMutation`.
* If you want partial rollback on an error, you will want `ctx.runMutation` instead of a plain TypeScript function.

convex/messages.ts

TS

```
export const trySendMessage = mutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (ctx, { body, author }) => {
    try {
      await ctx.runMutation(internal.messages.sendMessage, { body, author });
    } catch (e) {
      // Record the failure, but rollback any writes from `sendMessage`
      await ctx.db.insert("failures", {
        kind: "MessageFailed",
        body,
        author,
        error: `Error: ${e}`,
      });
    }
  },
});
```

## Always include the table name when calling `ctx.db` functions[​](#always-include-the-table-name-when-calling-ctxdb-functions "Direct link to always-include-the-table-name-when-calling-ctxdb-functions")

### Why?[​](#why-11 "Direct link to Why?")

Since version 1.31.0 of the `convex` NPM package, the `ctx.db` functions accept a table name as the first argument. While this first argument is currently optional, passing the table name adds an additional safeguard which will be required for custom ID generation in the future.

### Example[​](#example-5 "Direct link to Example")

convex/movies.ts

TS

```
// ❌
await ctx.db.get(movieId);
await ctx.db.patch(movieId, { title: "Whiplash" });
await ctx.db.replace(movieId, {
  title: "Whiplash",
  director: "Damien Chazelle",
  votes: 0,
});
await ctx.db.delete(movieId);

// ✅            vvvvvvvv
await ctx.db.get("movies", movieId);
await ctx.db.patch("movies", movieId, { title: "Whiplash" });
await ctx.db.replace("movies", movieId, {
  title: "Whiplash",
  director: "Damien Chazelle",
  votes: 0,
});
await ctx.db.delete("movies", movieId);
```

### How?[​](#how-10 "Direct link to How?")

Search for calls of `db.get`, `db.patch`, `db.replace` and `db.delete` in your Convex codebase, and ensure that all of them pass a table name as the first argument.

You can also check automatically that a table name argument is passed with the [`@convex-dev/explicit-table-ids` ESLint rule](/eslint.md#explicit-table-ids).

You can migrate existing code automatically by using the autofix in the ESLint rule, or with the `@convex-dev/codemod` standalone tool.

[Learn more on news.convex.dev →](https://news.convex.dev/db-table-name/)

## Don’t use `Date.now()` in queries[​](#date-in-queries "Direct link to date-in-queries")

### Why?[​](#why-12 "Direct link to Why?")

When you subscribe to a query, Convex [will automatically run it again](/realtime.md) if the data that it accesses in the database change. The query is not re-run when `Date.now()` changes, because it wouldn’t be desirable to re-run a query every millisecond. So, if your query depends on the current time, it might return stale results.

Also, using `Date.now()` in a query can cause the Convex query cache to be invalidated more frequently than necessary. In general, Convex will automatically re-use Convex query results if the query is called with the same arguments. However, when using `Date.now()` in a query, the query cache will be invalidated frequently in order to avoid showing results that are too old. This will unnecessarily increase the work that the database has to do.

### Example[​](#example-6 "Direct link to Example")

convex/posts.ts

TS

```
// ❌
const releasedPosts = await ctx.db
  .query("posts")
  .withIndex("by_released_at", (q) => q.lte("releasedAt", Date.now()))
  .take(100);

// ✅
const releasedPosts = await ctx.db
  .query("posts")
  // `isReleased` is set to `true` by a scheduled function after `releasedAt` is reached
  .withIndex("by_is_released", (q) => q.eq("isReleased", true))
  .take(100);
```

### How?[​](#how-11 "Direct link to How?")

Search for usages of `Date.now()` in your Convex queries, or in functions that are called from a Convex query.

If you want to compare the current time with a timestamp stored in a database document, consider adding a coarser field to the document that you update from a [scheduled function](/scheduling/scheduled-functions.md) (see the example above). This way, the query cache is only invalidated explicitly when data changes.

Alternatively, you can pass in the target time in as an explicit argument from the client. For best caching results, the client should avoid changing this argument frequently, for instance by rounding the time down to the most recent minute, so all client requests within that minute use the same arguments.
# The Zen of Convex

[YouTube video player](https://www.youtube.com/embed/dyEWQ9s2ji4?si=ce-M8pt6EWDZ8tfd)

Convex is an opinionated framework, with every element designed to pull developers into [the pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/).

The Zen of Convex is a set of guidelines & best practices developers have discovered that keep their projects falling into this wonderful pit.

## Performance<!-- -->

### Double down on the [sync engine](/tutorial/.md#how-convex-works)

There's a reason why a deterministic, reactive database is the beating heart of Convex: the more you center your apps around its properties, the better your projects will fare over time. Your projects will be easier to understand and refactor. Your app's performance will stay screaming fast. You won't have any consistency or state management problems.

Use a query for nearly every app read

Queries are the reactive, automatically cacheable, consistent and resilient way to propagate data to your application and its jobs. With very few exceptions, every read operation in your app should happen via a query function.

Keep sync engine functions light & fast

In general, your mutations and queries should be working with less than a few hundred records and should aim to finish in less than 100ms. It's nearly impossible to maintain a snappy, responsive app if your synchronous transactions involve a lot more work than this.

Use actions sparingly and incrementally

Actions are wonderful for batch jobs and/or integrating with outside services. They're very powerful, but they're slower, more expensive, and Convex provides a lot fewer guarantees about their behavior. So never use an action if a query or mutation will get the job done.

### <!-- -->Don't over-complicate client-side state management

Convex builds in a ton of its own caching and consistency controls into the app's client library. Rather than reinvent the wheel, let your client-side code take advantage of these built-in performance boosts.

Let Convex handle caching & consistency

You might be tempted to quickly build your own local cache or state aggregation layer in Convex to sit between your components and your Convex functions. With Convex, most of the time, you won't end up needing this. More often than not, you can bind your components to Convex functions in pretty simple ways and things will Just Work and be plenty fast.

Be thoughtful about the return values of mutations

Mutation return values can be useful to trigger state changes in your app, but it's rarely a good idea to use them to set in-app state to update the UI. Let queries and the sync engine do that.

## Architecture<!-- -->

### <!-- -->Create server-side frameworks using "just code"

Convex's built-in primitives are pretty low level! They're just functions. What about authentication frameworks? What about object-relational mappings? Do you need to wait until Convex ships some in-built feature to get those? Nope. In general, you should solve composition and encapsulation problems in your server-side Convex code using the same methods you use for the rest of your TypeScript code bases. After all, this is why Convex is "just code!" [Stack](https://stack.convex.dev) always has [great](https://stack.convex.dev/functional-relationships-helpers) [examples](https://stack.convex.dev/wrappers-as-middleware-authentication) of ways to tackle [these needs](https://stack.convex.dev/row-level-security).

### <!-- -->Don't misuse actions

Actions are powerful, but it's important to be intentional in how they fit into your app's data flow.

Don't invoke actions directly from your app

In general, it's an anti-pattern to call actions from the browser. Usually, actions are running on some dependent record that should be living in a Convex table. So it's best trigger actions by invoking a mutation that both *writes* that dependent record and *schedules* the subsequent action to run in the background.

Don't think 'background jobs', think 'workflow'

When actions are involved, it's useful to write chains of effects and mutations, such as:

action code → mutation → more action code → mutation.

Then apps or other jobs can follow along with queries.

Record progress one step at a time

While actions *could* work with thousands of records and call dozens of APIs, it's normally best to do smaller batches of work and/or to perform individual transformations with outside services. Then record your progress with a mutation, of course. Using this pattern makes it easy to debug issues, resume partial jobs, and report incremental progress in your app's UI.

## Development workflow<!-- -->

### <!-- -->Keep the dashboard by your side

Working on your Convex project without using the dashboard is like driving a car with your eyes closed. The dashboard lets you view logs, give mutations/queries/actions a test run, make sure your configuration and codebase are as you expect, inspect your tables, generate schemas, etc. It's an invaluable part of your rapid development cycle.

### <!-- -->Don't go it alone

Between these [docs](https://docs.convex.dev), [Stack](https://stack.convex.dev), and [our community](https://convex.dev/community), someone has *probably* encountered the design or architectural issue you're facing. So why try to figure things out the hard way, when you can take advantage of a whole community's experience?

Leverage Convex developer search

With so many great resources from the Convex team & community, it can be hard to know where to look first. If you want a quick way to search across all of these, [we have a portal for that](https://search.convex.dev)!

Join the Convex community

Whether you're stuck on a tricky use case, you have a question or feature request for the Convex team, or you're excited to share the amazing app(s) you've built and help others learn, the Convex community is there for you! Join the party on [Discord](https://convex.dev/community).
# Dev workflow

Let's walk through everything that needs to happen from creating a new project to launching your app in production.

This doc assumes you are building an app with Convex and React and you already have a basic React app already up and running. You can follow one of our [quickstarts](/quickstarts) to set this up.

## Installing and running Convex[​](#installing-and-running-convex "Direct link to Installing and running Convex")

You install Convex adding the npm dependency to your app:

```
npm i convex
```

Then you create your Convex project and start the backend dev loop:

```
npx convex dev
```

The first time you run the `npx convex dev` command you'll be asked whether you want start developing locally without an account or create an account.

### Developing without an account[​](#developing-without-an-account "Direct link to Developing without an account")

`npx convex dev` will prompt you for the name of your project, and then start running the open-source Convex backend locally on your machine (this is also called a "deployment").

The data for your project will be saved in the `~/.convex` directory.

1. The name of your project will get saved to your `.env.local` file so future runs of `npx convex dev` will know to use this project.
2. A `convex/` folder will be created (if it doesn't exist), where you'll write your Convex backend functions.

You can run `npx convex login` in the future to create an account and link any existing projects.

### Developing with an account[​](#developing-with-an-account "Direct link to Developing with an account")

`npx convex dev` will prompt you through creating an account if one doesn't exist, and will add your credentials to `~/.convex/config.json` on your machine. You can run `npx convex logout` to log you machine out of the account in the future.

Next, `npx convex dev` will create a new project and provision a new personal development deployment for this project:

1. Deployment details will automatically be added to your `.env.local` file so future runs of `npx convex dev` will know which dev deployment to connect to.
2. A `convex/` folder will be created (if it doesn't exist), where you'll write your Convex backend functions.

![Convex directory in your app](/assets/images/convex-directory-1ede9882007bf42d249b0561f2892c54.png)

## Running the dev loop[​](#running-the-dev-loop "Direct link to Running the dev loop")

Keep the `npx convex dev` command running while you're working on your Convex app. This continuously pushes backend code you write in the `convex/` folder to your deployment. It also keeps the necessary TypeScript types up-to-date as you write your backend code.

When you're developing with a locally running deployment, `npx convex dev` is also responsible for running your deployment.

You can then add new server functions to your Convex backend:

convex/tasks.ts

```
import { query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getTaskList = query({
  args: { taskListId: v.id("taskLists") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("taskListId", (q) => q.eq("taskListId", args.taskListId))
      .order("desc")
      .take(100);
    return tasks;
  },
});
```

When you write and save this code in your editor, several things happen:

1. The `npx convex dev` command typechecks your code and updates the `convex/_generated` directory.
2. The contents of your `convex/` directory get uploaded to your dev deployment.
3. Your Convex dev deployment analyzes your code and finds all Convex functions. In this example, it determines that `tasks.getTaskList` is a new public query function.
4. If there are any changes to the [schema](/database/schemas.md), the deployment will automatically enforce them.
5. The `npx convex dev` command updates generated TypeScript code in the `convex/_generated` directory to provide end to end type safety for your functions.

tip

Check in everything in your `convex/_generated/` directory. This it ensures that your code immediately type checks and runs without having to first run `npx convex dev`. It's particularly useful when non-backend developers are writing frontend code and want to ensure their code type checks against currently deployed backend code.

Once this is done you can use your new server function in your frontend:

src/App.tsx

```
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const data = useQuery(api.tasks.getTaskList);
  return data ?? "Loading...";
}
```

If you have other configuration like [crons](/scheduling/cron-jobs.md) or [auth](/auth.md) in your `convex/` folder, Convex ensures that they are applied and enforced on your backend.

## Convex dashboard[​](#convex-dashboard "Direct link to Convex dashboard")

The [Convex dashboard](/dashboard/deployments/.md) will be a trusty helper throughout your dev, debug and deploy workflow in Convex.

`npx convex dashboard` will open a link to the dashboard for your deployment.

### Logs[​](#logs "Direct link to Logs")

Since Convex functions are TypeScript functions you can always use the standard `console.log` and `console.time` functions to debug your apps.

Logs from your functions show up [in your dashboard](/dashboard/deployments/logs.md).

![Logs Dashboard Page](/assets/images/logs-ed208103a42edfb005e9089a8edad58e.png)

### Health, Data, Functions and more[​](#health-data-functions-and-more "Direct link to Health, Data, Functions and more")

* [Health](/dashboard/deployments/health.md) - provides invaluable information on how your app is performing in production, with deep insights on how your Convex queries are doing.
* [Data](/dashboard/deployments/data.md) - gives you a complete data browser to spot check your data.
* [Functions](/dashboard/deployments/functions.md) - gives you stats and run functions to debug them.

There is a lot more to to the dashboard. Be sure to click around or [check out the docs](/dashboard.md).

## Deploying your app[​](#deploying-your-app "Direct link to Deploying your app")

So far you've been working on your app against your personal dev deployment.

All Convex projects have one production deployment running in the cloud. It has separate data and has a separate push process from personal dev deployments, which allows you and your teammates to work on new features using personal dev deployments without disrupting your app running in production.

If you have not created a Convex account yet, you will need to do so with `npx convex login`. This will automatically link any projects you've started with your new account, and enable using your production deployment.

To push your code to your production deployment for your project you run the deploy command:

```
npx convex deploy
```

info

If you're running this command for the first time, it will automatically provision the prod deployment for your project.

### Setting up your deployment pipeline[​](#setting-up-your-deployment-pipeline "Direct link to Setting up your deployment pipeline")

It's rare to run `npx convex deploy` directly. Most production applications run an automated workflow that runs tests and deploys your backend and frontend together.

You can see detailed deployment and frontend configuration instructions in the [Hosting and Deployment](/production/hosting/.md) doc. For most React meta-frameworks Convex [automatically sets the correct environment variable](/production/hosting/vercel.md#how-it-works) to connect to the production deployment.

## Up next[​](#up-next "Direct link to Up next")

You now know the basics of how Convex works and fits in your app. Go head and explore the docs further to learn more about the specific features you want to use.

Whenever you're ready be sure the read the [Best Practices](/understanding/best-practices/.md), and then the [Zen of Convex](/understanding/zen.md) once you are ready to "think in Convex."
# Queries

Queries are the bread and butter of your backend API. They fetch data from the database, check authentication or perform other business logic, and return data back to the client application.

This is an example query, taking in named arguments, reading data from the database and returning a result:

convex/myFunctions.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getTaskList = query({
  args: { taskListId: v.id("taskLists") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_task_list_id", (q) => q.eq("taskListId", args.taskListId))
      .order("desc")
      .take(100);
    return tasks;
  },
});
```

Read on to understand how to build queries yourself.

## Query names[​](#query-names "Direct link to Query names")

Queries are defined in

TypeScript

files inside your `convex/` directory.

The path and name of the file, as well as the way the function is exported from the file, determine the name the client will use to call it:

convex/myFunctions.ts

TS

```
// This function will be referred to as `api.myFunctions.myQuery`.
export const myQuery = …;

// This function will be referred to as `api.myFunctions.sum`.
export const sum = …;
```

To structure your API you can nest directories inside the `convex/` directory:

convex/foo/myQueries.ts

TS

```
// This function will be referred to as `api.foo.myQueries.listMessages`.
export const listMessages = …;
```

Default exports receive the name `default`.

convex/myFunctions.ts

TS

```
// This function will be referred to as `api.myFunctions.default`.
export default …;
```

The same rules apply to [mutations](/functions/mutation-functions.md) and [actions](/functions/actions.md), while [HTTP actions](/functions/http-actions.md) use a different routing approach.

Client libraries in languages other than JavaScript and TypeScript use strings instead of API objects:

* `api.myFunctions.myQuery` is `"myFunctions:myQuery"`
* `api.foo.myQueries.myQuery` is `"foo/myQueries:myQuery"`.
* `api.myFunction.default` is `"myFunction:default"` or `"myFunction"`.

## The `query` constructor[​](#the-query-constructor "Direct link to the-query-constructor")

To actually declare a query in Convex you use the `query` constructor function. Pass it an object with a `handler` function, which returns the query result:

convex/myFunctions.ts

TS

```
import { query } from "./_generated/server";

export const myConstantString = query({
  args: {},
  handler: () => {
    return "My never changing string";
  },
});
```

### Query arguments[​](#query-arguments "Direct link to Query arguments")

Queries accept named arguments. The argument values are accessible as fields of the second parameter of the handler function:

convex/myFunctions.ts

TS

```
import { query } from "./_generated/server";

export const sum = query({
  handler: (_, args: { a: number; b: number }) => {
    return args.a + args.b;
  },
});
```

Arguments and responses are automatically serialized and deserialized, and you can pass and return most value-like JavaScript data to and from your query.

To both declare the types of arguments and to validate them, add an `args` object using `v` validators:

convex/myFunctions.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

export const sum = query({
  args: { a: v.number(), b: v.number() },
  handler: (_, args) => {
    return args.a + args.b;
  },
});
```

See [argument validation](/functions/validation.md) for the full list of supported types and validators.

The first parameter of the handler function contains the query context.

### Query responses[​](#query-responses "Direct link to Query responses")

Queries can return values of any supported [Convex type](/functions/validation.md) which will be automatically serialized and deserialized.

Queries can also return `undefined`, which is not a valid Convex value. When a query returns `undefined` **it is translated to `null`** on the client.

### Query context[​](#query-context "Direct link to Query context")

The `query` constructor enables fetching data, and other Convex features by passing a [QueryCtx](/generated-api/server.md#queryctx) object to the handler function as the first parameter:

convex/myFunctions.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  args: { a: v.number(), b: v.number() },
  handler: (ctx, args) => {
    // Do something with `ctx`
  },
});
```

Which part of the query context is used depends on what your query needs to do:

* To fetch from the database use the `db` field. Note that we make the handler function an `async` function so we can `await` the promise returned by `db.get()`:

  convex/myFunctions.ts

  TS

  ```
  import { query } from "./_generated/server";
  import { v } from "convex/values";

  export const getTask = query({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
      return await ctx.db.get("tasks", args.id);
    },
  });
  ```

  Read more about [Reading Data](/database/reading-data/.md).

* To return URLs to stored files use the `storage` field. Read more about [File Storage](/file-storage.md).

* To check user authentication use the `auth` field. Read more about [Authentication](/auth.md).

## Splitting up query code via helpers[​](#splitting-up-query-code-via-helpers "Direct link to Splitting up query code via helpers")

When you want to split up the code in your query or reuse logic across multiple Convex functions you can define and call helper

TypeScript

functions:

convex/myFunctions.ts

TS

```
import { Id } from "./_generated/dataModel";
import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const getTaskAndAuthor = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get("tasks", args.id);
    if (task === null) {
      return null;
    }
    return { task, author: await getUserName(ctx, task.authorId ?? null) };
  },
});

async function getUserName(ctx: QueryCtx, userId: Id<"users"> | null) {
  if (userId === null) {
    return null;
  }
  return (await ctx.db.get("users", userId))?.name;
}
```

You can `export` helpers to use them across multiple files. They will not be callable from outside of your Convex functions.

See [Type annotating server side helpers](/understanding/best-practices/typescript.md#type-annotating-server-side-helpers) for more guidance on TypeScript types.

## Using NPM packages[​](#using-npm-packages "Direct link to Using NPM packages")

Queries can import NPM packages installed in `node_modules`. Not all NPM packages are supported, see [Runtimes](/functions/runtimes.md#default-convex-runtime) for more details.

```
npm install @faker-js/faker
```

convex/myFunctions.ts

TS

```
import { query } from "./_generated/server";
import { faker } from "@faker-js/faker";

export const randomName = query({
  args: {},
  handler: () => {
    faker.seed();
    return faker.person.fullName();
  },
});
```

## Calling queries from clients[​](#calling-queries-from-clients "Direct link to Calling queries from clients")

To call a query from [React](/client/react.md) use the [`useQuery`](/client/react.md#fetching-data) hook along with the generated [`api`](/generated-api/api.md) object.

src/MyApp.tsx

TS

```
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function MyApp() {
  const data = useQuery(api.myFunctions.sum, { a: 1, b: 2 });
  // do something with `data`
}
```

See the [React](/client/react.md) client documentation for all the ways queries can be called.

## Caching & reactivity & consistency[​](#caching--reactivity--consistency "Direct link to Caching & reactivity & consistency")

Queries have three awesome attributes:

1. **Caching**: Convex caches query results automatically. If many clients request the same query, with the same arguments, they will receive a cached response.
2. **Reactivity**: clients can subscribe to queries to receive new results when the underlying data changes.
3. **Consistency**: All database reads inside a single query call are performed at the same logical timestamp. Concurrent writes do not affect the query results.

To have these attributes the handler function must be *deterministic*, which means that given the same arguments (including the query context) it will return the same response.

For this reason queries cannot `fetch` from third party APIs. To call third party APIs, use [actions](/functions/actions.md).

You might wonder whether you can use non-deterministic language functionality like `Math.random()` or `Date.now()`. The short answer is that Convex takes care of implementing these in a way that you don't have to think about the deterministic constraint.

See [Runtimes](/functions/runtimes.md#default-convex-runtime) for more details on the Convex runtime.

## Limits[​](#limits "Direct link to Limits")

Queries have a limit to the amount of data they can read at once to guarantee good performance. Check out these limits in [Read/write limit errors](/functions/error-handling/.md#readwrite-limit-errors).

For information on other limits, see [Limits](/production/state/limits.md).
# Database

The Convex database provides a relational data model, stores JSON-like documents, and can be used with or without a schema. It "just works," giving you predictable query performance in an easy-to-use interface.

Query and mutation [functions](/functions.md) read and write data through a lightweight JavaScript API. There is nothing to set up and no need to write any SQL. Just use JavaScript to express your app's needs.

Start by learning about the basics of [tables](#tables), [documents](#documents) and [schemas](#schemas) below, then move on to [Reading Data](/database/reading-data/.md) and [Writing Data](/database/writing-data.md).

As your app grows more complex you'll need more from your database:

* Relational data modeling with [Document IDs](/database/document-ids.md)
* Fast querying with [Indexes](/database/reading-data/indexes/.md)
* Exposing large datasets with [Paginated Queries](/database/pagination.md)
* Type safety by [Defining a Schema](/database/schemas.md)
* Interoperability with data [Import & Export](/database/import-export/.md)

## Tables[​](#tables "Direct link to Tables")

Your Convex deployment contains tables that hold your app's data. Initially, your deployment contains no tables or documents.

Each table springs into existence as soon as you add the first document to it.

```
// `friends` table doesn't exist.
await ctx.db.insert("friends", { name: "Jamie" });
// Now it does, and it has one document.
```

You do not have to specify a schema upfront or create tables explicitly.

## Documents[​](#documents "Direct link to Documents")

Tables contain documents. Documents are very similar to JavaScript objects. They have fields and values, and you can nest arrays or objects within them.

These are all valid Convex documents:

```
{}
{"name": "Jamie"}
{"name": {"first": "Ari", "second": "Cole"}, "age": 60}
```

They can also contain references to other documents in other tables. See [Data Types](/database/types.md) to learn more about the types supported in Convex and [Document IDs](/database/document-ids.md) to learn about how to use those types to model your data.

## Schemas[​](#schemas "Direct link to Schemas")

Though optional, schemas ensure that your data looks exactly how you want. For a simple chat app, the schema will look like this:

```
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// @snippet start schema
export default defineSchema({
  messages: defineTable({
    author: v.id("users"),
    body: v.string(),
  }),
});
```

You can choose to be as flexible as you want by using types such as `v.any()` or as specific as you want by precisely describing a `v.object()`.

See [the schema documentation](/database/schemas.md) to learn more about schemas.

## [Next: Reading Data](/database/reading-data/.md)

[Query and read data from Convex database tables](/database/reading-data/.md)

Related posts from

<!-- -->

[![Stack](/img/stack-logo-dark.svg)![Stack](/img/stack-logo-light.svg)](https://stack.convex.dev/)
# Reading Data

[Query](/functions/query-functions.md) and [mutation](/functions/mutation-functions.md) functions can read data from database tables using *document ids* and *document queries*.

## Reading a single document[​](#reading-a-single-document "Direct link to Reading a single document")

Given a single document's id you can read its data with the [`db.get`](/api/interfaces/server.GenericDatabaseReader.md#get) method:

convex/tasks.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get("tasks", args.taskId);
    // do something with `task`
  },
});
```

**Note**: You should use the `v.id` validator like in the example above to make sure you are not exposing data from tables other than the ones you intended.

## Querying documents[​](#querying-documents "Direct link to Querying documents")

Document queries always begin by choosing the table to query with the [`db.query`](/api/interfaces/server.GenericDatabaseReader.md#query) method:

convex/tasks.ts

TS

```
import { query } from "./_generated/server";

export const listTasks = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    // do something with `tasks`
  },
});
```

Then you can:

1. filter
2. order
3. and `await` the results

We'll see how this works in the examples below.

## Filtering your query[​](#filtering-your-query "Direct link to Filtering your query")

The best way to filter in Convex is to use indexes. Indexes build a special internal structure in your database to speed up lookups.

There are two steps to using indexes:

1. Define the index in your `convex/schema.ts` file.
2. Query via the `withIndex()` syntax.

### 1. Define the index[​](#1-define-the-index "Direct link to 1. Define the index")

If you aren't familiar with how to create a Convex schema, read the [schema doc](/database/schemas.md).

Let’s assume you’re building a chat app and want to get all messages in a particular channel. You can define a new index called `by_channel` on the `messages` table by using the `.index()` method in your schema.

convex/schema.ts

```
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define a messages table with an index.
export default defineSchema({
  messages: defineTable({
    channel: v.id("channels"),
    body: v.string(),
    user: v.id("users"),
  }).index("by_channel", ["channel"]),
});
```

### 2. Filter a query with an index[​](#2-filter-a-query-with-an-index "Direct link to 2. Filter a query with an index")

In your query function, you can now filter your `messages` table by using the `by_channel` index.

```
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", (q) => q.eq("channel", channel))
  .collect();
```

In Convex, you must explicitly use the `withIndex()` syntax to ensure your database uses the index. This differs from a more traditional SQL database, where the database implicitly chooses to use an index based on heuristics. The Convex approach leads to fewer surprises in the long run.

You can create an index across multiple fields at once, query a specific range of data, and change the order of your query result. [Read the complete index documentation](/database/reading-data/indexes/.md) to learn more.

Convex also supports a slower filtering mechanism that effectively loops through the table to match the filter. This can be useful if you know your table will be small (low thousands of rows), you're prototyping, or you want to filter an index query further. You can read more about filters [here](/database/reading-data/filters.md).

## Ordering[​](#ordering "Direct link to Ordering")

By default Convex always returns documents ordered by [`_creationTime`](/database/types.md#system-fields).

You can use [`.order("asc" | "desc")`](/api/interfaces/server.Query.md#order) to pick whether the order is ascending or descending. If the order isn't specified, it defaults to ascending.

```
// Get all messages, oldest to newest.
const messages = await ctx.db.query("messages").order("asc").collect();
```

```
// Get all messages, newest to oldest.
const messages = await ctx.db.query("messages").order("desc").collect();
```

If you need to sort on a field other than `_creationTime` and your document query returns a small number of documents (on the order of hundreds rather than thousands of documents), consider sorting in JavaScript:

```
// Get top 10 most liked messages, assuming messages is a fairly small table:
const messages = await ctx.db.query("messages").collect();
const topTenMostLikedMessages = recentMessages
  .sort((a, b) => b.likes - a.likes)
  .slice(0, 10);
```

For document queries that return larger numbers of documents, you'll want to use an [index](/database/reading-data/indexes/.md) to improve the performance. Document queries that use indexes will be [ordered based on the columns in the index](/database/reading-data/indexes/.md#sorting-with-indexes) and can avoid slow table scans.

```
// Get the top 20 most liked messages of all time, using the "by_likes" index.
const messages = await ctx.db
  .query("messages")
  .withIndex("by_likes")
  .order("desc")
  .take(20);
```

See [Limits](/database/reading-data/indexes/.md#limits) for details.

### Ordering of different types of values[​](#ordering-of-different-types-of-values "Direct link to Ordering of different types of values")

A single field can have values of any [Convex type](/database/types.md). When there are values of different types in an indexed field, their ascending order is as follows:

No value set (`undefined`) < Null (`null`) < Int64 (`bigint`) < Float64 (`number`) < Boolean (`boolean`) < String (`string`) < Bytes (`ArrayBuffer`) < Array (`Array`) < Object (`Object`)

The same ordering is used by the filtering comparison operators `q.lt()`, `q.lte()`, `q.gt()` and `q.gte()`.

## Retrieving results[​](#retrieving-results "Direct link to Retrieving results")

Most of our previous examples have ended the document query with the [`.collect()`](/api/interfaces/server.Query.md#collect) method, which returns all the documents that match your filters. Here are the other options for retrieving results.

### Taking `n` results[​](#taking-n-results "Direct link to taking-n-results")

[`.take(n)`](/api/interfaces/server.Query.md#take) selects only the first `n` results that match your query.

```
const users = await ctx.db.query("users").take(5);
```

### Finding the first result[​](#finding-the-first-result "Direct link to Finding the first result")

[`.first()`](/api/interfaces/server.Query.md#first) selects the first document that matches your query and returns `null` if no documents were found.

```
// We expect only one user with that email address.
const userOrNull = await ctx.db
  .query("users")
  .withIndex("by_email", (q) => q.eq("email", "test@example.com"))
  .first();
```

### Using a unique result[​](#using-a-unique-result "Direct link to Using a unique result")

[`.unique()`](/api/interfaces/server.Query.md#unique) selects the single document from your query or returns `null` if no documents were found. If there are multiple results it will throw an exception.

```
// Our counter table only has one document.
const counterOrNull = await ctx.db.query("counter").unique();
```

### Loading a page of results[​](#loading-a-page-of-results "Direct link to Loading a page of results")

[`.paginate(opts)`](/api/interfaces/server.OrderedQuery.md#paginate) loads a page of results and returns a [`Cursor`](/api/modules/server.md#cursor) for loading additional results.

See [Paginated Queries](/database/pagination.md) to learn more.

## More complex queries[​](#more-complex-queries "Direct link to More complex queries")

Convex prefers to have a few, simple ways to walk through and select documents from tables. In Convex, there is no specific query language for complex logic like a join, an aggregation, or a group by.

Instead, you can write the complex logic in JavaScript! Convex guarantees that the results will be consistent.

### Join[​](#join "Direct link to Join")

Table join might look like:

convex/events.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

export const eventAttendees = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get("events", args.eventId);
    return Promise.all(
      (event?.attendeeIds ?? []).map((userId) => ctx.db.get("users", userId)),
    );
  },
});
```

### Aggregation[​](#aggregation "Direct link to Aggregation")

Here's an example of computing an average:

convex/purchases.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

export const averagePurchasePrice = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userPurchases = await ctx.db
      .query("purchases")
      .withIndex("by_buyer", (q) => q.eq("buyer", args.email))
      .collect();
    const sum = userPurchases.reduce((a, { value: b }) => a + b, 0);
    return sum / userPurchases.length;
  },
});
```

> If you need more scalable aggregate options (for example to handle frequent updates or large tables), consider using the [Sharded Counter](https://www.convex.dev/components/sharded-counter) or [Aggregate](https://www.convex.dev/components/aggregate) components. These components can help you handle high-throughput counters, sums, or computations without looping through the whole table.

### Group by[​](#group-by "Direct link to Group by")

Here's an example of grouping and counting:

convex/purchases.ts

TS

```
import { query } from "./_generated/server";
import { v } from "convex/values";

export const numPurchasesPerBuyer = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userPurchases = await ctx.db.query("purchases").collect();

    return userPurchases.reduce(
      (counts, { buyer }) => ({
        ...counts,
        [buyer]: counts[buyer] ?? 0 + 1,
      }),
      {} as Record<string, number>,
    );
  },
});
```

## Explore the syntax on the dashboard[​](#explore-the-syntax-on-the-dashboard "Direct link to Explore the syntax on the dashboard")

You can try out the syntax described above directly from the dashboard by [writing a custom test query](/dashboard/deployments/data.md#writing-custom-queries).
# Testing

Convex makes it easy to test your app via automated tests running in JS or against a real backend, and manually in dev, preview and staging environments.

## Automated tests[​](#automated-tests "Direct link to Automated tests")

### `convex-test` library[​](#convex-test-library "Direct link to convex-test-library")

[Use the `convex-test` library](/testing/convex-test.md) to test your functions in JS via the excellent Vitest testing framework.

### Testing against a real backend[​](#testing-against-a-real-backend "Direct link to Testing against a real backend")

Convex open source builds allow you to test all of your backend logic running on a real [local Convex backend](/testing/convex-backend.md).

### Set up testing in CI[​](#set-up-testing-in-ci "Direct link to Set up testing in CI")

It's a good idea to test your app continuously in a controlled environment. No matter which way automated method you use, it's easy to run them with [GitHub Actions](/testing/ci.md).

<!-- -->

<!-- -->

## Manual tests[​](#manual-tests "Direct link to Manual tests")

### Running a function in dev[​](#running-a-function-in-dev "Direct link to Running a function in dev")

Manually run a function in dev to quickly see if things are working:

* [Run functions from the command line](/cli.md#run-convex-functions)
* [Run functions from the dashboard](/dashboard/deployments/functions.md#running-functions)

### Preview deployments[​](#preview-deployments "Direct link to Preview deployments")

[Use preview deployments](/production/hosting/preview-deployments.md) to get early feedback from your team for your in-progress features.

### Staging environment[​](#staging-environment "Direct link to Staging environment")

You can set up a separate project as a staging environment to test against. See [Deploying Your App to Production](/production.md#staging-environment).
# Using GitHub Copilot with Convex

[GitHub Copilot](https://github.com/features/copilot), the AI built into VS Code, makes it easy to write and maintain apps built with Convex. Let's walk through how to setup GitHub Copilot for the best possible results with Convex.

## Add Convex Instructions[​](#add-convex-instructions "Direct link to Add Convex Instructions")

Add the following [instructions](https://code.visualstudio.com/docs/copilot/copilot-customization#_instruction-files) file to your `.github/instructions` directory in your project and it will automatically be included when working with TypeScript or JavaScript files:

* [convex.instructions.md](https://convex.link/convex_github_copilot_instructions)

![Showing Where to Put GitHub Copilot Instructions](/assets/images/showing-where-to-put-convex-instructions-1d22c1b802b42443b4808e0dd27f0746.png)

If you would rather that the instructions file is NOT automatically pulled into context then open the file in your editor and alter the `applyTo` field at the top. Read more about instructions files here: <https://code.visualstudio.com/docs/copilot/copilot-customization#_use-instructionsmd-files>

We're constantly working on improving the quality of these rules for Convex by using rigorous evals. You can help by [contributing to our evals repo](https://github.com/get-convex/convex-evals).

## Setup the Convex MCP Server[​](#setup-the-convex-mcp-server "Direct link to Setup the Convex MCP Server")

The Convex CLI comes with a [Convex Model Context Protocol](/ai/convex-mcp-server.md) (MCP) server built in. The Convex MCP server gives your AI coding agent access to the your Convex deployment to query and optimize your project.

To get started with [MCP in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) then create a file in `.vscode/mcp.json` and add the following:

```
{
  "servers": {
    "convex-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "convex@latest", "mcp", "start"]
    }
  }
}
```

Once this is done it will take a few seconds to start up the MCP server and then you should see the Convex tool listed in the codelens:

![Convex Tool in Codelens](/assets/images/convex-tool-in-codelens-0cf36ed79938643797e93dd08ef3565c.png)

and in the selection of tools that the model has access to in chat:

![Convex Tool in Chat](/assets/images/convex-tools-in-chat-eef97848e328479e7e1b06452b7934ea.png)

Now start asking it questions like:

* Evaluate and convex schema and suggest improvements
* What are this app's public endpoints?
* Run the `my_convex_function` query

If you want to use the MCP server globally for all your projects then you can add it to your user settings, please see these docs for more information: <https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server-to-your-user-settings>
# Convex MCP Server

The Convex [Model Context Protocol](https://docs.cursor.com/context/model-context-protocol) (MCP) server provides several tools that allow AI agents to interact with your Convex deployment.

## Setup[​](#setup "Direct link to Setup")

Add the following command to your MCP servers configuration:

`npx -y convex@latest mcp start`

For Cursor you can use this quick link to install:

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=convex\&config=eyJjb21tYW5kIjoibnB4IC15IGNvbnZleEBsYXRlc3QgbWNwIHN0YXJ0In0%3D)

or see editor specific instructions:

* [Cursor](/ai/using-cursor.md#setup-the-convex-mcp-server)
* [Windsurf](/ai/using-windsurf.md#setup-the-convex-mcp-server)
* [VS Code](/ai/using-github-copilot.md#setup-the-convex-mcp-server)
* Claude Code: add the MCP server and test with
  <!-- -->
  ```
  claude mcp add-json convex '{"type":"stdio","command":"npx","args":["convex","mcp","start"]}'
  claude mcp get convex
  ```

## Configuration Options[​](#configuration-options "Direct link to Configuration Options")

The MCP server supports several command-line options to customize its behavior:

### Project Directory[​](#project-directory "Direct link to Project Directory")

By default, the MCP server can run for multiple projects, and each tool call specifies its project directory. To run the server for a single project instead, use:

```
npx -y convex@latest mcp start --project-dir /path/to/project
```

### Deployment Selection[​](#deployment-selection "Direct link to Deployment Selection")

By default, the MCP server connects to your development deployment. You can specify a different deployment using these options:

* `--prod`: Run the MCP server on your project's production deployment (requires `--dangerously-enable-production-deployments`)
* `--preview-name <name>`: Run on a preview deployment with the given name
* `--deployment-name <name>`: Run on a specific deployment by name
* `--env-file <path>`: Path to a custom environment file for choosing the deployment (e.g., containing `CONVEX_DEPLOYMENT` or `CONVEX_SELF_HOSTED_URL`). Uses the same format as `.env.local` or `.env` files.

### Production Deployments[​](#production-deployments "Direct link to Production Deployments")

By default, the MCP server cannot access production deployments. This is a safety measure to prevent accidental modifications to production data. If you need to access production deployments, you must explicitly enable this:

```
npx -y convex@latest mcp start --dangerously-enable-production-deployments
```

Use with care

Enabling production access allows the MCP server to read and modify data in your production deployment. Only enable this when you specifically need to interact with production, and be careful with any operations that modify data.

### Disabling Tools[​](#disabling-tools "Direct link to Disabling Tools")

You can disable specific tools if you want to restrict what the MCP server can do:

```
npx -y convex@latest mcp start --disable-tools data,run,envSet
```

Available tools that can be disabled: `data`, `envGet`, `envList`, `envRemove`, `envSet`, `functionSpec`, `logs`, `run`, `runOneoffQuery`, `status`, `tables`

## Available Tools[​](#available-tools "Direct link to Available Tools")

### Deployment Tools[​](#deployment-tools "Direct link to Deployment Tools")

* **`status`**: Queries available deployments and returns a deployment selector that can be used with other tools. This is typically the first tool you'll use to find your Convex deployment.

### Table Tools[​](#table-tools "Direct link to Table Tools")

* **`tables`**: Lists all tables in a deployment along with their:

  * Declared schemas (if present)
  * Inferred schemas (automatically tracked by Convex)
  * Table names and metadata

* **`data`**: Allows pagination through documents in a specified table.

* **`runOneoffQuery`**: Enables writing and executing sandboxed JavaScript queries against your deployment's data. These queries are read-only and cannot modify the database.

### Function Tools[​](#function-tools "Direct link to Function Tools")

* **`functionSpec`**: Provides metadata about all deployed functions, including:

  * Function types
  * Visibility settings
  * Interface specifications

* **`run`**: Executes deployed Convex functions with provided arguments.

* **`logs`**: Fetches a chunk of recent function execution log entries, similar to `npx convex logs` but as structured objects.

### Environment Variable Tools[​](#environment-variable-tools "Direct link to Environment Variable Tools")

* **`envList`**: Lists all environment variables for a deployment
* **`envGet`**: Retrieves the value of a specific environment variable
* **`envSet`**: Sets a new environment variable or updates an existing one
* **`envRemove`**: Removes an environment variable from the deployment

[Read more about how to use the Convex MCP Server](https://stack.convex.dev/convex-mcp-server)
# AI Agents

## Building AI Agents with Convex[​](#building-ai-agents-with-convex "Direct link to Building AI Agents with Convex")

Convex provides powerful building blocks for building agentic AI applications, leveraging Components and existing Convex features.

With Convex, you can separate your long-running agentic workflows from your UI, without the user losing reactivity and interactivity. The message history with an LLM is persisted by default, live updating on every client, and easily composed with other Convex features using code rather than configuration.

## Agent Component[​](#agent-component "Direct link to Agent Component")

The Agent component is a core building block for building AI agents. It manages threads and messages, around which your Agents can cooperate in static or dynamic workflows.

[Agent Component YouTube Video](https://www.youtube.com/embed/tUKMPUlOCHY?si=ce-M8pt6EWDZ8tfd)

[Agent Component YouTube Video](https://www.youtube.com/embed/tUKMPUlOCHY?si=ce-M8pt6EWDZ8tfd)

### Core Concepts[​](#core-concepts "Direct link to Core Concepts")

* Agents organize LLM prompting with associated models, prompts, and [Tools](/agents/tools.md). They can generate and stream both text and objects.
* Agents can be used in any Convex action, letting you write your agentic code alongside your other business logic with all the abstraction benefits of using code rather than static configuration.
* [Threads](/agents/threads.md) persist [messages](/agents/messages.md) and can be shared by multiple users and agents (including [human agents](/agents/human-agents.md)).
* [Conversation context](/agents/context.md) is automatically included in each LLM call, including built-in hybrid vector/text search for messages.

### Advanced Features[​](#advanced-features "Direct link to Advanced Features")

* [Workflows](/agents/workflows.md) allow building multi-step operations that can span agents, users, durably and reliably.
* [RAG](/agents/rag.md) techniques are also supported for prompt augmentation either up front or as tool calls using the [RAG Component](https://www.convex.dev/components/rag).
* [Files](/agents/files.md) can be used in the chat history with automatic saving to [file storage](/file-storage.md).

### Debugging and Tracking[​](#debugging-and-tracking "Direct link to Debugging and Tracking")

* [Debugging](/agents/debugging.md) is supported, including the [agent playground](/agents/playground.md) where you can inspect all metadata and iterate on prompts and context settings.
* [Usage tracking](/agents/usage-tracking.md) enables usage billing for users and teams.
* [Rate limiting](/agents/rate-limiting.md) helps control the rate at which users can interact with agents and keep you from exceeding your LLM provider's limits.

## [Build your first Agent](/agents/getting-started.md)

Learn more about the motivation by reading: [AI Agents with Built-in Memory](https://stack.convex.dev/ai-agents).

Sample code:

```
import { Agent } from "@convex-dev/agents";
import { openai } from "@ai-sdk/openai";
import { components } from "./_generated/api";
import { action } from "./_generated/server";

// Define an agent
const supportAgent = new Agent(components.agent, {
  name: "Support Agent",
  chat: openai.chat("gpt-4o-mini"),
  instructions: "You are a helpful assistant.",
  tools: { accountLookup, fileTicket, sendEmail },
});

// Use the agent from within a normal action:
export const createThread = action({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    const { threadId, thread } = await supportAgent.createThread(ctx);
    const result = await thread.generateText({ prompt });
    return { threadId, text: result.text };
  },
});

// Pick up where you left off, with the same or a different agent:
export const continueThread = action({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    // This includes previous message history from the thread automatically.
    const { thread } = await anotherAgent.continueThread(ctx, { threadId });
    const result = await thread.generateText({ prompt });
    return result.text;
  },
});
```
# convex-test

The [`convex-test`](https://www.npmjs.com/package/convex-test) library provides a mock implementation of the Convex backend in JavaScript. It enables fast automated testing of the logic in your [functions](/functions.md).

## Example[​](#example "Direct link to Example")

convex/posts.test.ts

TS

```
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

describe("posts.list", () => {
  it("returns empty array when no posts exist", async () => {
    const t = convexTest(schema, modules);

    // Initially, there are no posts, so `list` returns an empty array
    const posts = await t.query(api.posts.list);
    expect(posts).toEqual([]);
  });

  it("returns all posts ordered by creation time when there are posts", async () => {
    const t = convexTest(schema, modules);

    // Create some posts
    await t.mutation(internal.posts.add, {
      title: "First Post",
      content: "This is the first post",
      author: "Alice",
    });
    await t.mutation(internal.posts.add, {
      title: "Second Post",
      content: "This is the second post",
      author: "Bob",
    });

    // `list` returns all posts ordered by creation time
    const posts = await t.query(api.posts.list);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe("Second Post");
    expect(posts[1].title).toBe("First Post");
  });
});

const modules = import.meta.glob("./**/*.ts");
```

You can see more examples in the [test suite](https://github.com/get-convex/convex-test/tree/main/convex) of the convex-test library.

## Get started[​](#get-started "Direct link to Get started")

1. Install test dependencies

   Install [Vitest](https://vitest.dev/) and the [`convex-test`](https://www.npmjs.com/package/convex-test) library.

   ```
   npm install --save-dev convex-test vitest @edge-runtime/vm
   ```

2. Setup NPM scripts

   Add these scripts to your `package.json`

   package.json

   ```
   "scripts": {
     "test": "vitest",
     "test:once": "vitest run",
     "test:debug": "vitest --inspect-brk --no-file-parallelism",
     "test:coverage": "vitest run --coverage --coverage.reporter=text",
   }
   ```

3. Configure Vitest

   Add `vitest.config.ts` file to configure the test environment to better match the Convex runtime, and to inline the test library for better dependency tracking.

   If your Convex functions are in a directory other than `convex`

   If your project has a [different name or location configured](/production/project-configuration.md#changing-the-convex-folder-name-or-location) for the `convex/` folder in `convex.json`, you need to call [`import.meta.glob`](https://vitejs.dev/guide/features#glob-import) and pass the result as the second argument to `convexTest`.

   The argument to `import.meta.glob` must be a glob pattern matching all the files containing your Convex functions. The paths are relative to the test file in which `import.meta.glob` is called. It's best to do this in one place in your custom functions folder:

   src/convex/test.setup.ts

   TS

   ```
   /// <reference types="vite/client" />
   export const modules = import.meta.glob(
     "./**/!(*.*.*)*.*s"
   );
   ```

   This example glob pattern includes all files with a single extension ending in `s` (like `js` or `ts`) in the `src/convex` folder and any of its children.

   Use the result in your tests:

   src/convex/messages.test.ts

   TS

   ```
   import { convexTest } from "convex-test";
   import { test } from "vitest";
   import schema from "./schema";
   import { modules } from "./test.setup";

   test("some behavior", async () => {
     const t = convexTest(schema, modules);
     // use `t`...
   });
   ```

   Set up multiple test environments (e.g. Convex + frontend)

   If you want to use Vitest to test both your Convex functions and your React frontend, you might want to use multiple Vitest environments depending on the test file location via [environmentMatchGlobs](https://vitest.dev/config/#environmentmatchglobs):

   vitest.config.ts

   TS

   ```
   import { defineConfig } from "vitest/config";

   export default defineConfig({
     test: {
       environmentMatchGlobs: [
         // all tests in convex/ will run in edge-runtime
         ["convex/**", "edge-runtime"],
         // all other tests use jsdom
         ["**", "jsdom"],
       ],
       server: { deps: { inline: ["convex-test"] } },
     },
   });
   ```

   vitest.config.ts

   TS

   ```
   import { defineConfig } from "vitest/config";

   export default defineConfig({
     test: {
       environment: "edge-runtime",
       server: { deps: { inline: ["convex-test"] } },
     },
   });
   ```

4. Add a test file

   In your `convex` folder add a file ending in `.test.ts`

   The example test calls the `api.messages.send` mutation twice and then asserts that the `api.messages.list` query returns the expected results.

   convex/messages.test.ts

   TS

   ```
   import { convexTest } from "convex-test";
   import { expect, test } from "vitest";
   import { api } from "./_generated/api";
   import schema from "./schema";

   test("sending messages", async () => {
     const t = convexTest(schema);
     await t.mutation(api.messages.send, { body: "Hi!", author: "Sarah" });
     await t.mutation(api.messages.send, { body: "Hey!", author: "Tom" });
     const messages = await t.query(api.messages.list);
     expect(messages).toMatchObject([
       { body: "Hi!", author: "Sarah" },
       { body: "Hey!", author: "Tom" }
     ]);
   });
   ```

5. Run tests

   Start the tests with `npm run test`. When you change the test file or your functions the tests will rerun automatically.

   ```
   npm run test
   ```

If you're not familiar with Vitest, read the [Vitest Getting Started docs](https://vitest.dev/guide) first.

## Using convex-test[​](#using-convex-test "Direct link to Using convex-test")

### Initialize `convexTest`[​](#initialize-convextest "Direct link to initialize-convextest")

The library exports a `convexTest` function which should be called at the start of each of your tests. The function returns an object which is by convention stored in the `t` variable and which provides methods for exercising your Convex functions.

If your project uses a [schema](/database/schemas.md) you should pass it to the `convexTest` function:

convex/myFunctions.test.ts

TS

```
import { convexTest } from "convex-test";
import { test } from "vitest";
import schema from "./schema";

test("some behavior", async () => {
  const t = convexTest(schema);
  // use `t`...
});
```

Passing in the schema is required for the tests to correctly implement schema validation and for correct typing of [`t.run`](#setting-up-and-inspecting-data-and-storage-with-trun).

If you don't have a schema, call `convexTest()` with no argument.

### Call functions[​](#call-functions "Direct link to Call functions")

Your test can call public and internal Convex [functions](/functions.md) in your project:

convex/myFunctions.test.ts

TS

```
import { convexTest } from "convex-test";
import { test } from "vitest";
import { api, internal } from "./_generated/api";

test("functions", async () => {
  const t = convexTest();
  const x = await t.query(api.myFunctions.myQuery, { a: 1, b: 2 });
  const y = await t.query(internal.myFunctions.internalQuery, { a: 1, b: 2 });
  const z = await t.mutation(api.myFunctions.mutateSomething, { a: 1, b: 2 });
  const w = await t.mutation(internal.myFunctions.mutateSomething, { a: 1 });
  const u = await t.action(api.myFunctions.doSomething, { a: 1, b: 2 });
  const v = await t.action(internal.myFunctions.internalAction, { a: 1, b: 2 });
});
```

### Modify data outside of functions[​](#modify-data-outside-of-functions "Direct link to Modify data outside of functions")

Sometimes you might want to directly [write](/database/writing-data.md) to the mock database or [file storage](/file-storage.md) from your test, without needing a declared function in your project. You can use the `t.run` method which takes a handler that is given a `ctx` that allows reading from and writing to the mock backend:

convex/tasks.test.ts

TS

```
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";

test("functions", async () => {
  const t = convexTest(schema, modules);
  const firstTask = await t.run(async (ctx) => {
    await ctx.db.insert("tasks", { text: "Eat breakfast" });
    return await ctx.db.query("tasks").first();
  });
  expect(firstTask).toMatchObject({ text: "Eat breakfast" });
});

const modules = import.meta.glob("./**/*.ts");
```

### HTTP actions[​](#http-actions "Direct link to HTTP actions")

Your test can call [HTTP actions](/functions/http-actions.md) registered by your router:

convex/http.test.ts

TS

```
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";

test("functions", async () => {
  const t = convexTest(schema, modules);
  const response = await t.fetch("/some/path", { method: "POST" });
  expect(response.status).toBe(200);
});

const modules = import.meta.glob("./**/*.ts");
```

Mocking the global `fetch` function doesn't affect `t.fetch`, but you can use `t.fetch` in a `fetch` mock to route to your HTTP actions.

### Scheduled functions[​](#scheduled-functions "Direct link to Scheduled functions")

One advantage of using a mock implementation running purely in JavaScript is that you can control time in the Vitest test environment. To test implementations relying on [scheduled functions](/scheduling/scheduled-functions.md) use [Vitest's fake timers](https://vitest.dev/guide/mocking.html#timers) in combination with `t.finishInProgressScheduledFunctions`:

convex/scheduling.test.ts

TS

```
import { convexTest } from "convex-test";
import { expect, test, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("mutation scheduling action", async () => {
  // Enable fake timers
  vi.useFakeTimers();

  const t = convexTest(schema, modules);

  // Call a function that schedules a mutation or action
  const scheduledFunctionId = await t.mutation(
    api.scheduler.mutationSchedulingAction,
    { delayMs: 10000 },
  );

  // Advance the mocked time
  vi.advanceTimersByTime(5000);

  // Advance the mocked time past the scheduled time of the function
  vi.advanceTimersByTime(6000);

  // Or run all currently pending timers
  vi.runAllTimers();

  // At this point the scheduled function will be `inProgress`,
  // now wait for it to finish
  await t.finishInProgressScheduledFunctions();

  // Assert that the scheduled function succeeded or failed
  const scheduledFunctionStatus = await t.run(async (ctx) => {
    return await ctx.db.system.get("_scheduled_functions", scheduledFunctionId);
  });
  expect(scheduledFunctionStatus).toMatchObject({ state: { kind: "success" } });

  // Reset to normal `setTimeout` etc. implementation
  vi.useRealTimers();
});

const modules = import.meta.glob("./**/*.ts");
```

If you have a chain of several scheduled functions, for example a mutation that schedules an action that schedules another action, you can use `t.finishAllScheduledFunctions` to wait for all scheduled functions, including recursively scheduled functions, to finish:

convex/chainedScheduling.test.ts

TS

```
import { convexTest } from "convex-test";
import { expect, test, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("mutation scheduling action scheduling action", async () => {
  // Enable fake timers
  vi.useFakeTimers();

  const t = convexTest(schema, modules);

  // Call a function that schedules a mutation or action
  await t.mutation(api.scheduler.mutationSchedulingActionSchedulingAction);

  // Wait for all scheduled functions, repeatedly
  // advancing time and waiting for currently in-progress
  // functions to finish
  await t.finishAllScheduledFunctions(vi.runAllTimers);

  // Assert the resulting state after all scheduled functions finished
  const createdTask = await t.run(async (ctx) => {
    return await ctx.db.query("tasks").first();
  });
  expect(createdTask).toMatchObject({ author: "AI" });

  // Reset to normal `setTimeout` etc. implementation
  vi.useRealTimers();
});

const modules = import.meta.glob("./**/*.ts");
```

Check out more examples in [this file](https://github.com/get-convex/convex-test/blob/main/convex/scheduler.test.ts).

### Authentication[​](#authentication "Direct link to Authentication")

To test functions which depend on the current [authenticated](/auth.md) user identity you can create a version of the `t` accessor with given [user identity attributes](/api/interfaces/server.UserIdentity.md). If you don't provide them, `issuer`, `subject` and `tokenIdentifier` will be generated automatically:

convex/tasks.test.ts

TS

```
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("authenticated functions", async () => {
  const t = convexTest(schema, modules);

  const asSarah = t.withIdentity({ name: "Sarah" });
  await asSarah.mutation(api.tasks.create, { text: "Add tests" });

  const sarahsTasks = await asSarah.query(api.tasks.list);
  expect(sarahsTasks).toMatchObject([{ text: "Add tests" }]);

  const asLee = t.withIdentity({ name: "Lee" });
  const leesTasks = await asLee.query(api.tasks.list);
  expect(leesTasks).toEqual([]);
});

const modules = import.meta.glob("./**/*.ts");
```

## Vitest tips[​](#vitest-tips "Direct link to Vitest tips")

### Asserting results[​](#asserting-results "Direct link to Asserting results")

See Vitest's [Expect](https://vitest.dev/api/expect.html) reference.

[`toMatchObject()`](https://vitest.dev/api/expect.html#tomatchobject) is particularly helpful when asserting the shape of results without needing to list every object field.

### Asserting errors[​](#asserting-errors "Direct link to Asserting errors")

To assert that a function throws, use [`.rejects.toThrowError()`](https://vitest.dev/api/expect.html#tothrowerror):

convex/messages.test.ts

TS

```
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("messages validation", async () => {
  const t = convexTest(schema, modules);
  await expect(async () => {
    await t.mutation(api.messages.send, { body: "", author: "James" });
  }).rejects.toThrowError("Empty message body is not allowed");
});

const modules = import.meta.glob("./**/*.ts");
```

### Mocking `fetch` calls[​](#mocking-fetch-calls "Direct link to mocking-fetch-calls")

You can use Vitest's [vi.stubGlobal](https://vitest.dev/guide/mocking.html#globals) method:

convex/ai.test.ts

TS

```
import { expect, test, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { convexTest } from "convex-test";

test("ai", async () => {
  const t = convexTest(schema, modules);

  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ text: async () => "I am the overlord" }) as Response),
  );

  const reply = await t.action(api.messages.sendAIMessage, { prompt: "hello" });
  expect(reply).toEqual("I am the overlord");

  vi.unstubAllGlobals();
});

const modules = import.meta.glob("./**/*.ts");
```

### Measuring test coverage[​](#measuring-test-coverage "Direct link to Measuring test coverage")

You can get a printout of the code coverage provided by your tests. Besides answering the question "how much of my code is covered by tests" it is also helpful to check that your test is actually exercising the code that you want it to exercise.

Run `npm run test:coverage`

``

. It will ask you to install a required dependency the first time you run it.

![example coverage printout](/screenshots/testing_coverage.png)

### Debugging tests[​](#debugging-tests "Direct link to Debugging tests")

You can attach a debugger to the running tests. Read the Vitest [Debugging docs](https://vitest.dev/guide/debugging.html) and then use

`npm run test:debug`

``

.

## Limitations[​](#limitations "Direct link to Limitations")

Since `convex-test` is only a mock implementation, it doesn't have many of the behaviors of the real Convex backend. Still, it should be helpful for testing the logic in your functions, and catching regressions caused by changes to your code.

Some of the ways the mock differs:

* Error messages content. You should not write product logic that relies on the content of error messages thrown by the real backend, as they are always subject to change.

* Limits. The mock doesn't enforce size and time [limits](/production/state/limits.md).

* ID format. Your code should not depend on the document or storage ID format.

* Runtime built-ins. Most of your functions are written for the [Convex default runtime](/functions/runtimes.md), while Vitest uses a mock of Vercel's Edge Runtime, which is similar but might differ from the Convex runtime. You should always test new code manually to make sure it doesn't use built-ins not available in the Convex runtime.

* Some features have only simplified semantics, namely:

  <!-- -->

  * [Text search](/search.md) returns all documents that include a word for which at least one word in the searched string is a prefix. It does not sort the results by relevance.
  * [Vector search](/search/vector-search.md) returns results sorted by cosine similarity, but doesn't use an efficient vector index in its implementation.
  * There is no support for [cron jobs](/scheduling/cron-jobs.md), you should trigger your functions manually from the test.

To test your functions running on a real Convex backend, check out [Testing Local Backend](/testing/convex-backend.md).

## CI[​](#ci "Direct link to CI")

See [Continuous Integration](/testing/ci.md) to run your tests on a shared remote machine.
Customize AI in Visual Studio Code
AI models have broad general knowledge but don't know your codebase or team practices. Think of the AI as a skilled new team member: it writes great code, but doesn't know your conventions, architecture decisions, or preferred libraries. Customization is how you share that context, so responses match your coding standards, project structure, and workflows.

This article covers the customization options in VS Code: custom instructions, prompt files, custom agents, agent skills, MCP servers, and language models.

Quick reference
Expand table
Goal	Use	When it activates
Apply coding standards everywhere	Always-on instructions	Automatically included in every request
Different rules for different file types	File-based instructions	When files match a pattern or description
Reusable task I run repeatedly	Prompt files	When you invoke a slash command
Package multi-step workflow with scripts	Agent skills	When the task matches the skill description
Specialized AI persona with tool restrictions	Custom agents	When you select it or another agent delegates to it
Connect to external APIs or databases	MCP	When the task matches a tool description
Automate tasks at agent lifecycle points	Hooks	When the agent reaches a matching lifecycle event
Tip
Prompt files vs custom agents: Prompt files are best for single, repeatable tasks invoked as slash commands (for example, scaffolding a component). Custom agents are persistent personas that control which tools are available and can orchestrate subagents for multi-step workflows.

Custom instructions
Custom instructions enable you to define common guidelines and rules that automatically influence how AI generates code and handles other development tasks. Instead of manually including context in every chat prompt, specify custom instructions in a Markdown file to ensure consistent AI responses that align with your coding practices and project requirements.

VS Code supports two type of custom instructions:

Always-on instructions: automatically applied to every chat session.
File-based instructions: applied based on file path patterns or based on the instruction description
Use custom instructions to:

Document how to work with your code, such as coding standards, preferred technologies, or project requirements
Provide project-wide context that helps the AI understand the project's goal, architecture, and file structure
Specify task-specific guidelines, such as how to write tests, documentation, or perform code reviews
Agent Skills
Agent Skills enable you to give the AI specialized capabilities and workflows through folders containing instructions, scripts, and resources. These skills are loaded on-demand based on the task at hand. Agent Skills is an open standard that works across multiple AI agents, including VS Code, GitHub Copilot CLI, and GitHub Copilot coding agent.

Use Agent Skills to:

Create reusable capabilities that work across different GitHub Copilot tools
Define specialized workflows for testing, debugging, or deployment processes
Share capabilities with the AI community using the open standard
Include scripts, examples, and other resources alongside instructions
Prompt files
Prompt files, also known as slash commands, let you simplify prompting for common tasks by encoding them as standalone Markdown files that you can invoke directly in chat. Each prompt file includes task-specific context and guidelines about how the task should be performed.

Use prompt files to:

Simplify prompting for common tasks, such as scaffolding a new component, running and fixing tests, or preparing a pull request
Override default behavior of a custom agent, such as creating a minimal implementation plan, or generating mockups for API calls
Custom agents
Custom agents enable you to let the AI assume different personas for specific roles or tasks, like a database administration, front-end development, or planning. A custom agent is described in a Markdown file that defines its behavior, capabilities, tools, and language model preferences.

Use custom agents to:

Create specialist custom agents that focus on a specific task or role, giving them only the relevant context and tools
Create modular workflows by orchestrating multiple specialized agents, where each agent handles a specific part of the process
Help optimize context usage for complex tasks by running custom agents as subagents
MCP and tools
MCP and tools provide a gateway to external services and specialized tools through Model Context Protocol (MCP). This extends the agent's capabilities beyond code and the terminal, and enable it to interact with databases, APIs, and other development tools. MCP Apps let you define rich user experiences, like dashboards or forms, to facilitate complex interactions.

Use MCP and tools to:

Connect database tools to query and analyze data without leaving your development environment
Integrate with external APIs to fetch real-time information or perform actions
Hooks
Hooks enable you to execute custom shell commands at key lifecycle points during agent sessions. Hooks provide deterministic, code-driven automation that runs regardless of how the agent is prompted.

Use hooks to:

Enforce security policies by blocking dangerous commands before they execute
Automate code quality workflows by running formatters and linters after file edits
Create audit trails of all tool invocations for compliance
Inject project context into agent sessions automatically
Language models
Language models let you choose from different AI models optimized for specific tasks. You can switch between models to get the best performance for code generation, reasoning, or specialized tasks like vision processing. Bring your own API key to access more models or have more control over model hosting.

Use different language models to:

Use a fast model for quick code suggestions and simple refactoring tasks
Switch to a more capable model for complex architectural decisions or detailed code reviews
Bring your own API key to access experimental models or use locally hosted models
Set up your project for AI
Implement AI customizations incrementally. Start with the basics and add more as needed.

Initialize your project: Type /init in chat to analyze your workspace and generate a .github/copilot-instructions.md file with coding standards and project context tailored to your codebase. Review and refine the generated instructions.

Add targeted rules: Create file-based *.instructions.md files to apply specific rules for different parts of your codebase, such as language conventions or framework patterns.

Automate repetitive tasks: Create prompt files for common workflows like component generation, code reviews, or documentation. Add MCP servers to connect external services like issue trackers or databases.

Create specialized workflows: Build custom agents for specific roles or project phases. Package reusable capabilities as agent skills to share across tools and minimize context usage.

Troubleshoot customization issues
If your customization files aren't being applied or are causing unexpected behavior, use the chat customization diagnostics view to identify problems.

Select Configure Chat (gear icon) > Diagnostics in the Chat view to see all loaded custom agents, prompt files, instruction files, and skills along with any errors. Check for issues like syntax errors, invalid configurations, or problems loading resources.
