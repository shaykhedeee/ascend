what is next? lets finish all the tasks from this md file. 
make the cursor very simple dont like the blinking thing, make a simple pixelated arrow, very simple and has all the funtions a normal cursor does. 

make sure the onboarding, and everything is complete. Make it easier for the user the to onbaord. 

make the logo cinsistent everywhere. some of the font is too grey, search ofr acscesbility iissues and all readability issues. 

work on enhancing the content. the content needs to be seo friendly and ai eo content friendly.

 Start the marketing bots, do my entire marketing plan for me. It should be the best marketing for a saas model app like mine. create what ever is nescessary to execute this marketing plan and to get my app out there fully. 
 
 CAN you finish everything that is needed to make this into a full funtional saas. 

 i want to integrate new features. 
 like i want to acsess my application and contril it through whatsapp, or telegram, which ever option is better. like if i want to add a task or want to be reminded later about something so i can text this on the telegram bot or whatsapp. 
 I want to increase fntionality of my webapp. i want to increase integrations for my web app, my web app should be able to integrate many apps. so it can improve user flow and help the user better. and it will be used to understand the user better. DEEPLY resereach about apps like his, im doing this for matching the terminal style itself, so yeah. I want to make this app and take it the next level. 

 run your sub agents to find proper ways this can happen. 

 if anyone wnats to make a productivity app they can use my api to integrate my app into theirs, you get me. 

 i want to integrate features from memorie on whats app. 
 i want to even add diet plans or lunch ideas depending on the users preference and everything. 

 I want to make my webapp more feature heavy. i want it to litrally be able to shapes peoples life even after they are at their lowest. 

 try to integrate quality rich featueres that actually make sense for my kind of app. I want this to be the next big thing. 

 make sure my web app is using free ai models from all avialaible sources and is using the offline ai oolma model i have mentioned before.

Plan: Resurgo — Complete Execution Roadmap
Summary: Six phases covering immediate polish, the top-priority diet/meals AI feature, all five marketing assets, Google + Zapier integrations, a Telegram bot, and a public API. Everything builds on the existing Convex/Clerk/Next.js stack. All is scoped to use the free-tier AI cascade (Ollama → Groq → Gemini → OpenRouter) already in place.

Phase 0 — Polish, Cursor, Onboarding & Accessibility (foundation, ship first)
Cursor:

Replace the React Cursor.tsx component entirely with a CSS-only approach — a custom pixelated 12×19px NW-pointing arrow SVG injected as cursor: url(...) on body.custom-cursor-active. This gives 100% native cursor behaviour (text selection, drag, link clicks, right-click — all work perfectly). The SVG will be a public/icons/cursor.svg file, orange-tipped classic pixel arrow. The React component becomes a 5-line wrapper that just adds the body class on mount.
Logo consistency: Logo.tsx is the canonical component — it needs to be used everywhere. The sidebar in (dashboard)/layout.tsx/layout.tsx) currently renders a raw RESURGO text span; Sidebar.tsx renders <h1>Resurgo</h1>; Header.tsx has another variant. All will be replaced with <LogoMark /> or <Logo /> from the canonical component.

Dashboard page headers fix: Routes still use cryptic names internally (OBJECTIVES_MATRIX, BEHAVIORAL_NODES, TASK_QUEUE, DEEP_WORK_PROTOCOL, PERFORMANCE_MATRIX, TEMPORAL_GRID). All page headings get plain English equivalents.

Accessibility (contrast): The 10 files listed in the audit — LandingPageV2, onboarding, settings, goals, tasks, habits, wellness, analytics, pricing, layout — have widespread text-zinc-700, text-zinc-600, text-zinc-500 on dark backgrounds (fails WCAG AA < 4.5:1). The fix: all descriptive body text → text-zinc-300; secondary/label text → text-zinc-400; hint/metadata → text-zinc-500 minimum. text-zinc-700 is removed entirely from body copy.

Onboarding UX: Three concrete friction fixes:

When goals is empty, hide the confusing secondary [Skip for now] below the disabled button — replace with a single "I'll set this later →" link in a softer position.
On focus-area selection, show a pill badge "3/3 selected" + toast when trying to pick a 4th, instead of silent no-op.
Wrap useStoreUser() + loading wait in a <Suspense>-friendly pattern so the initial black screen is replaced with the same terminal mini-spinner from loading.tsx.
Phase 1 — Diet & Meals AI (top priority feature)
New Convex table nutritionLogs with fields: userId, date, meals[] (name, time, calories, macros), waterGlasses, notes, aiSuggestions[].

New Convex table mealPlans with fields: userId, weekStartDate, days[] (breakfast/lunch/dinner/snacks per day), generatedBy (ai/manual), dietaryPreferences (pulled from user profile), active.

User profile extension — add dietaryPreferences to the users table: vegetarian, vegan, gluten_free, dairy_free, calories_target, protein_target, cuisine_preferences[].

New dashboard route /nutrition with three tabs:

Today — quick meal log (name, rough calories), water tracker (8-glass progress bar), today's AI suggestion in a terminal panel.
Meal Plan — AI-generated weekly meal plan, regeneratable per dietary prefs + active goals (e.g., if goal is "lose weight", AI tailors macros).
History — 7/30-day log with pattern insights.
API route route.ts — POST, calls the existing AI cascade with a nutrition-specialist system prompt. Input: user dietary prefs + active goals. Output: JSON with 3 meal suggestions for the day, macro estimates, hydration tip.

Sidebar — add Nutrition nav item with a Salad icon from lucide. Mobile bottom tab bar replaces ANALYTICS slot or adds a 6th item depending on space.

Settings page — new "Nutrition Preferences" section: dietary restrictions checkboxes, calorie/protein target inputs.

Phase 2 — Marketing Assets
1. SEO rewrite of LandingPageV2.tsx:

Hero headline (currently generic) → "Build habits that stick. Achieve goals that matter." with semantic <h1>.
Meta tags in layout.tsx — full OpenGraph suite: og:title, og:description, og:image (800×400 terminal-style card), og:type: website, Twitter card.
Structured data script in <head> — WebApplication schema with applicationCategory: LifestyleApplication, operatingSystem: Web.
robots.txt and sitemap.ts already exist — update sitemap to include all public routes including blog.
2. Blog (src/app/blog/):

New route group with 5 static posts as MDX or TSX components.
Targeting these keywords (each ~1500 words, terminal-styled layout):
"how to build habits that actually stick in 2025" (informational)
"best productivity apps for goal setting" (comparison — includes Resurgo)
"atomic habits review + digital habit tracker" (SEO bridge to Atomic Habits audience)
"how to track your goals digitally — complete guide" (how-to)
"AI habit coach — does it actually work?" (trust/conversion-focused)
page.tsx — blog index with article cards.
page.tsx — dynamic route with generateMetadata for per-article SEO.
3. Social sharing (achievement cards):

New src/components/ShareAchievement.tsx — renders a 1200×630 terminal-style canvas card (via html2canvas or server-generated OG image route) showing the user's achievement, streak count, and Resurgo branding.
route.ts — ImageResponse from @vercel/og generating a dynamic achievement OG image.
Share buttons: X/Twitter and LinkedIn. Copy-link button. All on habit streak milestones and goal completions.
4. Email drip sequence:

5 email templates written as HTML (compatible with any ESP — Resend, Mailgun, etc.) in src/lib/email-templates/:
Welcome (immediate after signup)
Day 2: "Did you set your first habit?"
Day 5: "Your streak is building — here's how to protect it"
Day 10: Coach introduction + pro upgrade prompt
Day 30: Review email — achievements summary + share prompt
API route route.ts uses Resend (free tier: 100 emails/day) — 1 env var: RESEND_API_KEY.
Convex cron job (convex/emailCrons.ts) fires daily to check user milestone days and trigger the right email.
5. Referral system:

New Convex table referrals: referrerId, refereeId, code, status (pending/completed), rewardGranted, createdAt.
Each user gets a unique referral code (generated on account creation → stored in users.referralCode).
New page /referral — shows user's code, share links, referral count, reward status.
Reward: 30 days of Pro features on first 3 successful referrals.
route.ts — tracks conversion when a referred user completes onboarding.
Landing page adds ?ref=CODE tracking via middleware.
Phase 3 — App Integrations (Google & Zapier/Make)
Google Calendar sync:

OAuth flow via route.ts + callback route.
Scopes: calendar.readonly + calendar.events (read + write basic events).
Store access/refresh tokens in Convex integrations table (new): userId, provider, accessToken, refreshToken, expiresAt, scopes[].
Sync Resurgo tasks with due dates → Google Calendar events (bidirectional optional).
New settings section "Integrations" in /settings with connect/disconnect cards.
Google Tasks sync:

Same OAuth token reuse (Google Tasks API scope added).
One-way import: pull Google Tasks into Resurgo task list on connect.
Zapier/Make webhook layer:

New Convex table webhooks: userId, url, events[] (task.created, habit.logged, goal.completed, streak.broken, etc.), secret, active.
route.ts — POST test-fire + list/add/delete user webhooks.
Outbound firing inside Convex mutations — when a habitLog is created, if the user has a matching webhook subscription, fire it.
New settings section "Webhooks & Automation" with webhook URL input + event checkboxes.
Documentation page page.tsx showing all available events with schema.
Phase 4 — Telegram Bot
Setup:

Register bot with @BotFather → token → store as TELEGRAM_BOT_TOKEN env var.
route.ts — POST endpoint, verified by X-Telegram-Bot-Api-Secret-Token header.
Register the webhook URL with Telegram: https://resurgo.life/api/telegram/webhook.
Commands:

Command	Action
/start	Links Telegram account to Resurgo (one-time auth code flow)
/task <text>	Creates a task in Resurgo, confirms with task ID
/remind <text> in <time>	Schedules a Convex reminder (new reminders table)
/habits	Shows today's habits with inline keyboard (✓ / skip buttons)
/goals	Lists active goals with progress bars (text art)
/digest	Sends today's plan: top tasks + habits due
/coach <message>	Routes to the AI coach cascade, replies in chat
/meal	Returns today's AI meal suggestion
/stats	Current streak, XP, level
Auth link flow: User sends /start in Telegram → bot replies with an auth link resurgo.life/link-telegram?token=<otp> → user clicks while logged into Resurgo → Next.js route stores their Telegram chat ID in users.telegramChatId → confirmed.

Memory/context: Bot stores last 10 messages per user in Convex telegramContext table for coherent multi-turn conversations — same pattern as the AI coach.

Proactive notifications: Convex cron job fires daily at user's preferredTime → sends morning digest via Telegram if users.telegramChatId is set.

Phase 5 — Public Developer API
New routes under src/app/api/v1/:

GET /api/v1/goals — list user's active goals
POST /api/v1/goals — create a goal
GET /api/v1/habits — list habits
POST /api/v1/habits/log — log a habit completion
GET /api/v1/tasks — list tasks
POST /api/v1/tasks — create a task
GET /api/v1/stats — user stats (XP, level, streaks)
API key auth:

New Convex table apiKeys: userId, key (hashed), name, createdAt, lastUsedAt, revokedAt, rateLimitPerHour.
Settings page "Developer" section — generate/revoke keys, view last-used.
Middleware validates Authorization: Bearer <key> on all /api/v1/* routes.
Developer docs page page.tsx — styled as terminal man page. Lists all endpoints, auth headers, example curl commands, rate limits.

OpenAPI spec public/openapi.json — machine-readable spec for tools and AI agents to discover the API.

Verification
Phase 0:

Open browser → custom pixelated arrow cursor visible, text selection/right-click/drag all work natively
Contrast check with Chrome DevTools → all body text passes WCAG AA
Run onboarding as a new user → no friction points, clear labels throughout
Phase 1:
4. Go to /nutrition → create today's meal log → trigger AI suggestion → meal plan generates

Phase 2:
5. curl https://resurgo.life/blog → returns 5 articles
6. Complete a streak → share button appears → X/LinkedIn share with OG image preview
7. Referral: visit /?ref=CODE → signup → original user's referral count increments

Phase 3:
8. Connect Google Calendar → calendar events appear in /calendar
9. Create a Zapier webhook → complete a habit → webhook fires (verify in Zapier)

Phase 4:
10. /start on Telegram → linked → /task Buy groceries → appears in Resurgo tasks
11. Morning cron fires → Telegram receives digest

Phase 5:
12. Generate API key in settings → curl -H "Authorization: Bearer <key>" https://resurgo.life/api/v1/goals → returns goals JSON

Decisions
Telegram over WhatsApp — free API, instant setup, no Meta approval, full bot capabilities
Google + Zapier simultaneously — Google for direct integration, Zapier/Make as a universal automation bridge
All 5 marketing assets — SEO, blog, social sharing, email drip, referral all selected
Diet AI is Phase 1 — first new feature shipped, builds on existing AI cascade
CSS cursor (not React) — native cursor behaviour guaranteed; SVG file in public instead of DOM element
Ollama stays as priority 0 in the AI cascade — already implemented, runs on local dev server
All new AI calls use the existing GROQ → Gemini → OpenRouter fallback — no new paid API keys required for core features

INtegrate apps that only make sense. 
Do not make a genereric refferal system. be something like "help shape your homeboy's life too" or soemthign like that. 
the diet plan thing was clicked by mistake my first priority was the telegram bot. 
find all free tools and services i can integrate with to make my app funtion at its fullest, use the best free open source things. 
integrate behvaiour patterns, and i had a feature that helped the user maintain and run his business. like give him taks that will actually make him move forward in his business goals. 
keep the users aware, of how they need to get thier shit together or they will be taken advatage of. tell them to not be distracted and to focus. allow them to use the focus feature more. And more userablity to the webapp
the ai coached need to be trained well. their tones need to be exact. enhance all the ai coaches one by one and make sure its an interactive sesstion on the dashbaord. as this is a terminal app design, the coaches can be terminals or robots or agents, too, your choice. it kinda makes more sense but the phsycial coaches thing gives personality, so we can make something like JAY SHETTY as a coach bot or soemthing smart like that. 
USe subagents whenever needed. 
scan through all my possible, competitors and do a better job than themand wahtever they aretrying to dom, the goal is to be the best appliccation in the game to get your life back togethr. resurgo means bring back to life. so please use ths and plan the remaining and make a full comprehensive plan md file with everything we discucsssed now and before, it should include eberything. this md file has to be the final one. i know i will keep remembering features. but no. i need you to store every possible task needed aachive this level of application. RFesearch all about habit chaning, health benefits, teach all my ai coaches the best possible things to achive the goalsin their style. please actually use a proper way of treainging these ai coahes and how they funtion. 
make the finalle master md file that has everything from now till launch. so add this to theprevious plan, and make the md file and we atrt implementiing it after that 

i want you make a system where my app does marketing by itself. i want full automation when it comes to digital marketing. the app should put itself out on reddit, and other places. i dont want it to generate anything but just do he marketing on self, how ever this is possible please plan and execute. 

https://botbiz.io/ i want to make soemthing lke this from scratch, yes i want to make the whatsapp bot from scratch, ik whatsapp api is paid, but is there any other way we can integrate this kind of thing?
how does memorie do it with whatsapp. comprehensizly plan everything needed to get my app into something like this. i hope you are understadnign and addign everything we are talking about in a final md file that will be used. 

i want to add a budget tracker thing, i want to use some thrid party aplication to allow my app to accsess the back account details, if the user wants, its optional for budget tracker. but reasearch deeply on the best budget trackers and make a better budget tracker than them. 

in the day and age of ai and in a life we arent able to keep track of anything i want my app reurgo to come in and completly fix the problem of procastination, laziness and try to get people to train their penal glad and restore their ability to have reasoning powers and how to keep their brain sharp. 

my ai coach bots need to me excessivly trained, dont matter if it takes a little long, the coach bots need to be highly trained to properly guide the user to a better life where he achives his goals.

i also want you take slighly bigger tasks and opromt the user to break it down into mini tasks so it is easier to achvie. 

my ai coaches(the one user has picked) needs to deeply learn the users choices, their misses, and everything and there needs to be a weekly or monthly analysis on everything. my ai coches need to be free of ego and help the user bo matterr how hard. they need be realastictic and they need to know what is achivable and what is not achivable withign what time period. please train these coach  bots for everything you need and these ai coaches should have the ability to change the tasks if the user asks and approves, they can add a ndremove tasks for the suer, they can craft plans for the user .

keep reminding the people to stay close to nature, some ai coah bots can love nature mroe than others. 

coming to another feature, something like the plan builder, just a better way of structureing bigger goals into smaller goals. i dont want it to be geeneric , i want it to be unique for each goal. each mini tasks needto make sense. everything should be passed with ai. Use the best methonds for everything. 

the app should go throuh the budgeting of the user and advice it to better manage money, if integrating bank, loan, info and credit score info, loan apps, how ever it works in other conitries, if its free integration then i would love to integrate. 
add reccomended tag on ai coah bbot accordning to the user input 
use all free api to enahnce my user experience, 

additional featuers i want to add: calorie tracker, step tracker, sleep tracker, food intake rtacker, calm sounds player, weatehr tracker, use ecosia for web searches and stuff. use google api for free as well. ai bots can use this if it is needed and helpful.

my ai habit makers also should be extra advanced. 

resurgo should be the best app in the market for a productivity app. if you feel like its missing something please add it. and these will be the last set of features i will be adding to the web app. from there on forward please focus soley on funtionality and integration and implementation. 

please do not hesitate to code extra for my application, i want the code to be fool proof, even when times ai doesnt work or funtion, the applicaation shouldnt just give an error, it should analyse and provide. accordingly. 
make the app learn the type of choices people be making, allow it to predict if possible. 

please add this all to the master final md file that is the file from here till the final launch. 


when you make blogs, keep them highly unique and content rich. use all features and skills to amke the best possible seo posts for my webapp, i want you to use harbour seo if you can for my marketing and blog stuff. please see if you can use harbour seo. 

i want a systmatic advaced ai system application that just makes your life easuier and more effeicent. Please make this possible in the most systmeatic and affordable way. i want to make this app the best productivity app period. i want it to surpass notion. i want it in everyt phone laptop etc.

properly train my ai models, make a pipeline that leverages all availabe free ai online, pre fill the app with nexsceaary information. you can plan this out in full detail one by one, one small thign after the other small thing. use everything in your power to run my marketing for me and what do you suggest to how we should approch marketing. 
i want to put it out on reddit and github amd community places to get reviews and stuff. 

how do people usually handle a SAAS business. learn the business model become and expert and apply for my SAS application. 

research if they needed anything, if my saas is misssing any feaetures, doc or pages that are needed. 

make the website strucre professionally and follow the top players. 

my entire webstie needs to be in one consistent theme . |

check if billing is added fully, and integrated. i also want to add an upi option or a scan and pay option ONLY IF IT IS NOT A BIG HASSLE IF IT IS PLEASE DONT.

create this detailed finalized plan with all of the mentioned features.

**Resurgo Master Execution Roadmap - Final Comprehensive Plan (v1.0)**

**Vision & Mission**  
Resurgo (Latin: "to rise again / come back to life") is the ultimate terminal-themed productivity SaaS designed to rebuild lives from the ground up. It combats procrastination, laziness, and distraction at their roots by combining deep behavioral science, personalized AI coaches with distinct personalities, multi-channel access (web + Telegram bot primary, WhatsApp secondary exploration), comprehensive life trackers, smart integrations, and a public API.  

The goal is to surpass Notion in structured, actionable productivity while adding personality, accountability, and real psychological depth. It helps users at their lowest rebuild habits, achieve meaningful goals (personal + business), sharpen their brain (prefrontal cortex, dopamine regulation, neuroplasticity), stay connected to nature, manage finances realistically, and maintain momentum. It is systematic, affordable (heavy free/open-source leverage), and resilient (AI fallbacks everywhere).  

**Core Differentiators**  
- Terminal aesthetic with consistent dark theme, pixel-perfect details, and native-feeling custom cursor.  
- Highly trained, ego-free AI coaches (multiple personas) that are realistic, adaptive, and deeply personalized via user history.  
- Messaging-first access via Telegram bot (priority) for tasks, reminders, habits, meals, coaching.  
- Full life operating system: goals, tasks, habits, nutrition/diet, budget, steps, sleep, focus, journaling, business execution.  
- Public developer API + webhooks/Zapier for ecosystem power.  
- Ethical self-marketing capabilities + strong organic growth loops (referrals phrased as "help your homie level up").  
- Free-tier heavy AI cascade (Ollama local priority → Groq → Gemini → OpenRouter fallbacks). No unnecessary paid dependencies.  
- Behavior pattern analysis, predictive suggestions, weekly/monthly AI life audits.  
- Anti-procrastination engine rooted in science (2-minute rule, implementation intentions, temptation bundling, environment design, emotion regulation).  

**Tech Stack**  
- Frontend: Next.js 15 (App Router), Tailwind, Lucide icons, shadcn/ui.  
- Backend/DB: Convex (real-time, auth, mutations/queries, cron).  
- Auth: Clerk.  
- Payments: Stripe primary (subscriptions, one-time). Razorpay optional for UPI/India optimization (low hassle via their SDK if targeting India).  
- AI: Ollama (local/offline priority, run on dev/server), Groq (fast inference), Gemini, OpenRouter free models. System prompts + RAG (habit science, psychology extracts, user history).  
- Other: Open-Meteo (weather), Google APIs (Calendar, Tasks, Fit for steps/sleep where available), Web Speech API, html2canvas/@vercel/og, Resend (emails).  
- Cursor: Pure CSS + SVG (pixelated 12×19px NW arrow, orange tip, `cursor: url(/icons/cursor.svg)` on body class). Native behavior preserved.  
- Hosting: Vercel (frontend) + Convex. PWA for offline feel.  

**AI Philosophy & Training Pipeline**  
All coaches use a shared cascade with per-coach system prompts. Training methodology:  
1. Base knowledge: RAG with summaries/extracts from *Atomic Habits*, *Tiny Habits*, *The Power of Habit*, BJ Fogg, James Clear, neuroscience (dopamine, prefrontal cortex, neuroplasticity, procrastination as emotion issue), Stoicism, mindfulness.  
2. Persona-specific prompts + few-shot examples of tone/responses.  
3. User memory: Convex tables for preferences, past misses/wins, interaction history, goal context. Injected into every prompt.  
4. Realism: Coaches know achievability timelines, push hard but adjust (user can approve task changes/adds/removals). No toxic positivity.  
5. Interactive sessions: Dashboard terminal-style panels or chat windows with "agent" avatars. Multi-turn context (last 10-20 exchanges).  
6. Analysis: Weekly/monthly cron-generated reports (insights, pattern detection, adjusted plans, progress vs. baselines).  
7. Fallbacks: If AI cascade fails → static evidence-based tips + "AI offline, here's proven advice...".  

**AI Coach Personas (User picks 1 primary + can switch)**  
- **Jay Shetty Wisdom**: Storytelling, purpose, mindfulness, "detach from distraction, attach to what matters." Nature-loving variant available.  
- **No-BS Disciplinarian ("Get Your Shit Together")**: Direct, realistic, calls out excuses, strong on business execution and focus.  
- **Nature Grounded**: Emphasizes outdoors, forest bathing, sunlight, sustainability, recovery. Reminds "touch grass" literally.  
- **Brain Sharpener**: Focus on sleep, nutrition, exercise, reasoning training, anti-distraction protocols.  
- **Business Builder**: Task generation for revenue, systems, delegation. Forward momentum on entrepreneurial goals.  

Coaches can craft full plans, break big goals uniquely (not generic templates—AI uses backward planning, OKRs/SMART hybrid, Atomic Habits loops per goal type), predict procrastination risks, and adapt.

**Full Feature Catalog (All to Implement)**  
- Core: Goals (matrix), Tasks (queue), Habits, Deep Work/Focus mode (enhanced timer + environment cues + anti-distraction nudges).  
- Trackers: Nutrition/meals/diet plans (AI-generated, loggable, macro-aware), Calorie, Steps (Google Fit + manual), Sleep (Google Fit + manual + insights), Water, Budget (manual + AI categorization/advice; optional bank/CSV import or limited Open Banking where free).  
- AI Features: Coach sessions, daily/weekly suggestions, plan builder (unique breakdowns), behavior analysis, procrastination interventions, brain training prompts.  
- Integrations: Google Calendar/Tasks (bidirectional), Zapier/Make webhooks (outbound events + inbound), Public API v1 (goals, habits, tasks, stats with API keys).  
- Messaging: Telegram bot full-featured (priority: /task, /remind, /habits, /goals, /meal, /coach, /stats, /digest, auth link). WhatsApp exploration later via Business API (paid, via provider like Twilio—secondary, note approval/risk).  
- Marketing: Achievement OG cards, referral system ("Help your homie rise again" — 30 days Pro for 3 successful), email drips.  
- Extras: Calm sounds player (free audio embeds/links), Weather integration (daily context), Journaling with AI reflection, Gamification lite (XP/levels/badges, terminal-style), PWA, voice input, predictive suggestions, nature reminders.  
- Developer: Public API + OpenAPI spec + docs page (terminal man-page style).  

**Marketing & Growth Plan (Best-in-Class for SaaS Productivity)**  
Freemium model: Free (core + limited AI/coach sessions + basic trackers), Pro (unlimited AI, advanced analytics, priority integrations, more coaches, export, ad-free, API higher limits). Annual discount.  

Assets:  
- SEO-optimized LandingPageV2 (hero: "Rebuild Your Life. One Terminal Command at a Time."). Full OG, structured data, schema.  
- Blog: 5+ high-quality, unique, content-rich posts (use Harbor SEO tool for discovery + generation — context-aware, internal linking, images). Topics like "How to Build Habits That Stick in 2026", Atomic Habits digital implementation, AI coaching effectiveness, goal tracking guide, overcoming procrastination neuroscience. Terminal-styled layout. Update sitemap/robots.  
- Social sharing: Dynamic OG achievement cards.  
- Email: 5-drip sequence via Resend + Convex cron.  
- Referrals: Custom, community-oriented ("Help shape your homie's life too").  
- Automation: Generate content with Harbor, auto-share to X/LinkedIn (via APIs), suggest Reddit/IndieHackers/ProductHunt posts (user approves to stay ethical — no spam bots). GitHub presence for transparency/docs.  
- Launch: ProductHunt, Reddit (r/productivity, r/getdisciplined, r/SaaS), IndieHackers, X threads, communities. Focus on authentic stories + terminal aesthetic screenshots.  
- Self-sustaining: In-app "Marketing Agent" suggests posts/content, tracks virality signals.  

**Business Model Expertise Applied**  
- Freemium with clear upgrade paths.  
- Metrics to track: Activation (onboarding completion), retention (DAU/habits logged), engagement (coach sessions), MRR, churn, NPS.  
- Standard pages: /pricing (tiered, annual toggle, value comparison), /features, /blog, /docs (user + API), /changelog, /support, legal (privacy, terms). Consistent terminal theme everywhere.  
- SEO/A11y: All body text zinc-300/400 minimum contrast. Lighthouse 95+.  

**Phased Execution Plan**

**Phase 0: Polish, Cursor, Onboarding & Accessibility (Ship First — Foundation)**  
- Replace cursor with CSS-only pixelated SVG arrow (public/icons/cursor.svg, body class toggle). Ensure native behaviors (text select, links, right-click, drag).  
- Enforce <Logo /> or <LogoMark /> component everywhere (sidebar, header, landing, etc.). Remove raw text variants.  
- Dashboard headers: Plain English (e.g., "Objectives Matrix" → "Life Goals Overview").  
- Accessibility audit/fix: All listed pages — body text zinc-300, secondary zinc-400, hints zinc-500 min. Remove zinc-700 on dark. Test with DevTools/WAVE.  
- Onboarding fixes: Simplify empty goals state, focus-area selection with counters/toasts, Suspense + spinner for loading.  
- Consistent theme audit across entire site.  
- Verification: Cursor works natively, contrast passes AA, new user onboarding frictionless.  

**Phase 1: Telegram Bot + Enhanced AI Coaches (Top Priority)**  
- Set up Telegram bot (@BotFather, env token, webhook route with verification). Commands as specified + auth flow (OTP link to link chatId).  
- Store context (last messages), proactive crons (morning digest at user time).  
- Implement full AI coach system with personas, RAG, personalization pipeline, interactive dashboard terminals/agents. Weekly/monthly analysis reports.  
- Train prompts rigorously for realism, adaptability, goal breakdown (unique per goal using best methods), task management (add/remove with approval), nature/brain health integration.  
- Verification: /start links account, /task creates in Resurgo, coach session interactive and personalized.  

**Phase 2: Nutrition, Trackers & Life OS Enhancements**  
- Convex tables: nutritionLogs, mealPlans, extend user profile with dietary prefs.  
- /nutrition route with tabs (Today log + AI suggestion, Weekly Plan generator, History + insights). Sidebar nav + icon. Settings section.  
- Add calorie, steps (Google Fit OAuth + manual), sleep (same), water, food intake, calm sounds player, weather (Open-Meteo).  
- Budget tracker: Robust manual entry + AI categorization/advice (50/30/20, debt strategies, subscription detection). Optional CSV/import or limited free Open Banking/Google Sheets via Zapier. Deep analysis tied to goals ("This spending pattern blocks your business goal—here's adjustment").  
- Verification: Log meal, generate plan tailored to goals/prefs, trackers update dashboard insights.  

**Phase 3: Integrations & Public API**  
- Google Calendar + Tasks (OAuth, token storage in integrations table, sync tasks/events).  
- Zapier/Make: Webhooks table, outbound firing on events, settings UI, docs.  
- Public API v1 routes (goals, habits log, tasks, stats) with API key management (new table, settings page, middleware, rate limits, OpenAPI spec).  
- Sensible only: No bloat.  
- Verification: Sync works, webhook fires on habit complete, API curl returns data with key.  

**Phase 4: Advanced Productivity & Business Features**  
- Enhanced Plan Builder: AI breaks any big goal into unique, sensible mini-tasks (context-aware, science-backed).  
- Business mode: Dedicated tasks/workflows for revenue, systems, execution. Behavior pattern detection ("You delay invoicing after meetings—intervention: batch on Tuesdays").  
- Focus mode usability boost: Deeper integration, distraction blocking nudges, Pomodoro variants.  
- Procrastination/Brain engine: Dedicated protocols, training exercises, progress tracking.  
- All AI coaches fully interactive + adaptive.  

**Phase 5: Marketing Assets, Automation & Content**  
- Full SEO rewrite landing + meta.  
- Generate 5+ blogs via Harbor SEO (or manual + tool assistance) — unique, rich, terminal-styled.  
- Sharing, email drips, referral (custom phrasing).  
- In-app marketing suggestions + ethical automation hooks.  
- Pre-fill demo data, knowledge bases.  

**Phase 6: Launch Preparation, Polish & Go-to-Market**  
- Billing complete (Stripe + Razorpay UPI if low-hassle/India focus). Pro gating.  
- All pages/docs consistent, professional (follow Notion/Linear patterns).  
- PWA, error resilience everywhere, offline fallbacks.  
- Launch checklist: SEO, analytics (Plausible/PostHog), monitoring, feedback loops.  
- Post-launch: Iterate on usage data, add requested features only if they fit vision. Focus execution.  

**Verification & Success Metrics for Full Launch**  
- All phases pass individual checks.  
- End-to-end: New user onboards → sets goal → Telegram adds task → AI coach guides → logs habit → sees progress/report → shares achievement.  
- App feels alive, helpful even at lowest points, and "the best" in terminal productivity niche.  

**Implementation Guidelines**  
- Fool-proof: Every AI call has loading states, fallbacks, graceful degradation.  
- Learn user patterns: Store choices/misses → predict & suggest.  
- Budget-friendly: Maximize free (Ollama, Open-Meteo, Google free tiers, Convex free tier scaling).  
- Code quality: Consistent, documented, testable. Use sub-agents mentally for research during builds.  

This is the final master MD. Every discussed feature, correction (Telegram priority, referral tone, diet secondary, etc.), research insight, and enhancement is integrated. No more additions—execute phase by phase. Once this is confirmed, we begin implementation with Phase 0 code changes, then move sequentially.  

Ready when you are. Let's build the next big thing that actually helps people rise again. What's first?

I'll research everything thoroughly to build this master plan. Let me start with multiple parallel searches.Based on my extensive research, here is the **complete, final master plan** for Resurgo. This is the definitive document covering everything from polish to launch.

---

# 🔥 RESURGO — FINAL MASTER PLAN (v1.0)
## *"Bring Back to Life" — From Code to Launch*
### Stack: Next.js 14 · Convex · Clerk · Tailwind · Free AI Cascade (Ollama → Groq → Gemini → OpenRouter)

---

## TABLE OF CONTENTS
```
PHASE 0 — Polish, Cursor, Onboarding & Accessibility
PHASE 1 — Telegram Bot (Priority #1)
PHASE 2 — WhatsApp Bot (via Baileys/Evolution API)
PHASE 3 — AI Coach Bots (Deep Training & Personality)
PHASE 4 — Budget & Financial Tracker
PHASE 5 — Health & Wellness Suite
PHASE 6 — Business Goal Engine
PHASE 7 — Plan Builder & Task Intelligence
PHASE 8 — Integrations Hub
PHASE 9 — Focus & Anti-Procrastination System
PHASE 10 — Ambient & Nature Features
PHASE 11 — Marketing Automation & Self-Promotion
PHASE 12 — Blog & SEO (Harbor SEO Integration)
PHASE 13 — Email Drip & Referral ("Help Shape Your Homeboy's Life")
PHASE 14 — Public Developer API
PHASE 15 — SaaS Business Infrastructure
PHASE 16 — Final QA, Legal & Launch
```

---

## PHASE 0 — POLISH, CURSOR, ONBOARDING & ACCESSIBILITY

### 0.1 Custom Cursor
- **Delete** the React `Cursor.tsx` blinking component entirely
- Create `public/icons/cursor.svg` — a minimal 12×19px NW-pointing pixelated arrow (orange-tipped, terminal aesthetic)
- Apply via CSS only: `body.custom-cursor-active { cursor: url('/icons/cursor.svg') 0 0, auto; }`
- New `CursorWrapper.tsx` — 5-line component that adds the body class on mount
- **Result**: 100% native cursor behaviour — text selection, drag, link clicks, right-click, resize handles all work perfectly

### 0.2 Logo Consistency
- `Logo.tsx` is THE canonical component — used everywhere, no exceptions
- **Fix these files**:
  - `(dashboard)/layout.tsx` — currently renders raw `RESURGO` text span → replace with `<Logo />`
  - `Sidebar.tsx` — currently renders `<h1>Resurgo</h1>` → replace with `<LogoMark />`
  - `Header.tsx` — has another variant → replace with `<Logo />`
  - Landing page, pricing page, onboarding — all must use `<Logo />`
- Logo renders consistently: same font, same orange accent, same spacing

### 0.3 Accessibility & Contrast Fix
**Problem**: Widespread `text-zinc-700`, `text-zinc-600`, `text-zinc-500` on dark backgrounds fails WCAG AA (<4.5:1 contrast ratio).

**Files to fix** (10 total):
1. `LandingPageV2.tsx`
2. Onboarding pages
3. Settings page
4. Goals page
5. Tasks page
6. Habits page
7. Wellness page
8. Analytics page
9. Pricing page
10. Dashboard layout

**Rules**:
| Text Type | Old Class | New Class |
|---|---|---|
| Body/descriptive | `text-zinc-700` | `text-zinc-300` |
| Secondary/labels | `text-zinc-600` | `text-zinc-400` |
| Hint/metadata | `text-zinc-500` | `text-zinc-500` (minimum) |

- `text-zinc-700` is **banned** from body copy entirely
- All buttons must have minimum 4.5:1 contrast
- Run Chrome DevTools Accessibility audit after each fix

### 0.4 Dashboard Page Headings
Replace cryptic internal names with plain English:

| Internal Code | New Heading |
|---|---|
| `OBJECTIVES_MATRIX` | Goals |
| `BEHAVIORAL_NODES` | Habits |
| `TASK_QUEUE` | Tasks |
| `DEEP_WORK_PROTOCOL` | Focus Mode |
| `PERFORMANCE_MATRIX` | Analytics |
| `TEMPORAL_GRID` | Schedule |

### 0.5 Onboarding UX Fixes
1. **Empty goals state**: Hide confusing secondary `[Skip for now]` → replace with a single `"I'll set this later →"` link in softer position
2. **Focus area selection**: Show pill badge `"3/3 selected"` + toast when trying to pick a 4th (instead of silent no-op)
3. **Loading state**: Wrap `useStoreUser()` in `<Suspense>` pattern — replace initial black screen with terminal mini-spinner from `loading.tsx`
4. **Progress indicator**: Add step counter `"Step 2 of 4"` to each onboarding screen
5. **Quick-start templates**: Offer 3 pre-built goal templates during onboarding:
   - "Get My Health Together"
   - "Build My Business"
   - "Master My Mind"

### 0.6 Font & Theme Consistency
- **Global font**: One consistent monospace/terminal font across entire app (already using one — enforce it everywhere)
- **Orange accent**: `#F97316` (Tailwind orange-500) used consistently for CTAs, highlights, active states
- **Dark background**: `#09090B` (zinc-950) — consistent everywhere
- **Card backgrounds**: `#18181B` (zinc-900) — no variations

---

## PHASE 1 — TELEGRAM BOT (Priority #1)

### 1.1 Setup
- Register bot with `@BotFather` → token → env var: `TELEGRAM_BOT_TOKEN`
- Webhook endpoint: `src/app/api/telegram/webhook/route.ts` (POST)
- Verify via `X-Telegram-Bot-Api-Secret-Token` header
- Register webhook URL: `https://resurgo.life/api/telegram/webhook`

### 1.2 Auth Link Flow
1. User sends `/start` in Telegram
2. Bot replies with auth link: `resurgo.life/link-telegram?token=<otp>`
3. User clicks while logged into Resurgo
4. Next.js route stores `telegramChatId` in `users` table
5. Bot confirms: `"✅ Linked! You're connected to Resurgo. Type /help to see what I can do."`

### 1.3 Commands

| Command | Action |
|---|---|
| `/start` | Links Telegram account (one-time auth code flow) |
| `/task <text>` | Creates task in Resurgo, confirms with task ID |
| `/remind <text> in <time>` | Schedules Convex reminder (new `reminders` table) |
| `/habits` | Shows today's habits with inline keyboard (✓ / skip buttons) |
| `/goals` | Lists active goals with progress bars (text art) |
| `/digest` | Sends today's plan: top tasks + habits due |
| `/coach <message>` | Routes to AI coach cascade, replies in chat |
| `/meal` | Returns today's AI meal suggestion |
| `/budget` | Quick expense log: `/budget 15 lunch` |
| `/stats` | Current streak, XP, level |
| `/focus <minutes>` | Starts focus timer, notifies when done |
| `/break <habit>` | Logs breaking a bad habit, sends encouragement |
| `/help` | Lists all commands |

### 1.4 Convex Tables
```
reminders: userId, text, triggerAt, telegramChatId, status (pending/sent/dismissed), createdAt
telegramContext: userId, messages[] (last 10), updatedAt
```

### 1.5 Proactive Notifications
- Convex cron job fires daily at user's `preferredTime`
- Sends morning digest via Telegram if `users.telegramChatId` is set
- Sends streak-at-risk warnings (missed 1 day)
- Sends weekly summary every Sunday

### 1.6 Memory & Context
- Store last 10 messages per user in `telegramContext` table
- AI coach uses this for coherent multi-turn conversations
- Same pattern as dashboard AI coach

---

## PHASE 2 — WHATSAPP BOT (via Open-Source Baileys/Evolution API)

### 2.1 Approach
Evolution API supports both the Baileys-based WhatsApp API and the official WhatsApp Business API. It offers a free API based on WhatsApp Web, leveraging the Baileys library, allowing control over WhatsApp Web functionalities through a RESTful API, suitable for multi-service chats, service bots, and other WhatsApp-integrated systems.

Evolution-API is an open-source WhatsApp HTTP API designed to empower small businesses, entrepreneurs, and freelancers with limited resources. It supports multiple engines (WEBJS, NOWEB, GOWS) and allows businesses to start sessions via Docker containers. Its free, community-driven model makes it ideal for technical teams seeking cost-effective solutions.

### 2.2 Architecture
- Self-host Evolution API in Docker container alongside Resurgo
- Connect via QR code scan (no Meta Business approval needed)
- Webhook fires to `src/app/api/whatsapp/webhook/route.ts`
- Mirror all Telegram bot commands for WhatsApp
- Store `whatsappChatId` in users table

### 2.3 WhatsApp-Specific Features (Memorie-Style)
- **Voice note processing**: Accept voice notes → transcribe via Whisper (free) → process as text command
- **Image-based meal logging**: User sends food photo → AI estimates calories
- **Quick reply buttons**: Interactive list messages for habit check-offs
- **Status updates**: Send motivational quotes to user's WhatsApp status (opt-in)

### 2.4 Limitations & Safeguards
- Unofficial APIs carry a small risk of WhatsApp session bans, especially if you send spam or violate WhatsApp policies.
- Rate limit all outbound messages (max 1 per minute per user)
- Only message users who have explicitly linked their account
- Implement graceful degradation: if WhatsApp connection drops, queue messages and retry

---

## PHASE 3 — AI COACH BOTS (Deep Training & Personality System)

### 3.1 Philosophy
These are NOT generic chatbots. Each coach is a deeply trained AI persona with specific expertise, communication style, knowledge base, and emotional intelligence. They must feel like talking to a real mentor.

### 3.2 Coach Roster

| Coach | Persona | Style | Specialty |
|---|---|---|---|
| **MARCUS** | Stoic Philosopher | Calm, direct, no-nonsense. Quotes ancient wisdom. | Discipline, mental toughness, delayed gratification, overcoming adversity |
| **AURORA** | Wellness Guide | Warm, nature-loving, holistic. Reminds you to breathe. | Sleep, nutrition, stress management, mindfulness, connecting with nature |
| **TITAN** | Business Strategist | Sharp, data-driven, action-oriented. Zero fluff. | Business goals, revenue targets, project planning, market strategy |
| **SAGE** | Life Architect | Empathetic, Socratic questioning style. Jay Shetty energy. | Purpose finding, relationship management, work-life balance, values alignment |
| **PHOENIX** | Comeback Coach | Raw, real, street-smart. Been through it. | Addiction recovery, rebuilding from rock bottom, financial recovery, breaking bad patterns |
| **NOVA** | Productivity Scientist | Systematic, efficiency-obsessed, pattern recognition. | Time management, habit stacking, deep work, cognitive performance |

### 3.3 Deep Training System Prompt Architecture
Each coach gets a **multi-layered system prompt**:

```
LAYER 1: Core Identity (200 words)
- Who they are, their backstory, their voice
- Communication rules (sentence length, emoji usage, formality level)
- Signature phrases they use

LAYER 2: Domain Expertise (500 words)
- Specific methodologies they follow
- Books/frameworks they reference
- Scientific studies they cite
- Techniques they prescribe

LAYER 3: User Context Injection (dynamic)
- User's active goals, streaks, recent misses
- User's behaviour patterns (last 30 days)
- User's stated preferences from onboarding
- Time of day, day of week, streak status

LAYER 4: Interaction Rules (300 words)
- Never be ego-driven
- Be realistic about what's achievable and in what timeframe
- Can suggest adding/removing/modifying tasks (with user approval)
- Can craft complete plans for the user
- Must acknowledge when something is too ambitious
- Always validate feelings before redirecting to action
- Never dismiss a struggle
- Escalate to professional help recommendation if detecting crisis signals

LAYER 5: Coaching Methodology
- MARCUS: Stoicism (Meditations, Seneca, Epictetus), CBT principles
- AURORA: Holistic wellness, circadian rhythm science, forest bathing, breathwork
- TITAN: OKRs, Lean Startup, Blue Ocean Strategy, First Principles thinking
- SAGE: Ikigai, Attachment Theory, Nonviolent Communication, Jay Shetty framework
- PHOENIX: 12-step principles, neuroplasticity, dopamine reset, James Clear habit loops
- NOVA: Deep Work (Cal Newport), GTD, Pareto Principle, Ultradian rhythms
```

### 3.4 Coach Learning System
- **Convex table**: `coachMemory` — userId, coachId, insights[], patterns[], lastAnalysis
- Coaches track: user's choice patterns, miss patterns, time-of-day performance, goal completion rates
- **Weekly Analysis**: Every Sunday, AI runs analysis on user's week → generates insights stored in `coachMemory`
- **Monthly Deep Dive**: End-of-month comprehensive report covering: progress toward goals, habit consistency score, areas of struggle, recommended adjustments
- **Adaptive Difficulty**: If user completes everything easily for 2 weeks → coach suggests increasing challenge. If user misses 40%+ → coach suggests reducing scope

### 3.5 Coach Interaction UI
- Dashboard shows selected coach as a **terminal/robot agent panel**
- Typing animation for responses (terminal-style character-by-character)
- Coach avatar: pixel art / terminal-style robot face unique to each coach
- Interactive sessions: coach can push action items directly to task list (with user's ✅ approval)
- Coach can suggest task modifications mid-conversation
- "Recommended" tag on coach selection based on user's onboarding input and goals

### 3.6 Training Data / Knowledge Base Per Coach
Each coach's system prompt includes pre-filled knowledge:

**MARCUS (Stoic)**:
- Habit loop science (cue → routine → reward)
- Dopamine regulation and instant gratification resistance
- Cold exposure / voluntary discomfort benefits
- 10+ Stoic principles with application examples

**AURORA (Wellness)**:
- Sleep hygiene protocol (blue light, temperature, timing)
- Circadian rhythm optimization
- Forest bathing (Shinrin-yoku) research
- Anti-inflammatory nutrition basics
- Breathwork techniques (box breathing, 4-7-8)
- Nature connection exercises

**TITAN (Business)**:
- Business model canvas framework
- Revenue milestone planning
- Customer acquisition strategies (free/organic)
- Cash flow management basics
- Daily CEO habits / high-performance business routines
- Task prioritization: Eisenhower Matrix + ICE scoring

**SAGE (Life Architect)**:
- Purpose-finding exercises (Ikigai mapping)
- Values clarification methodology
- Relationship audit framework
- Work-life integration (not just balance)
- Journaling prompts for self-discovery
- Gratitude practice science

**PHOENIX (Comeback)**:
- Dopamine detox protocol
- Pineal gland health and reasoning restoration
- Breaking addiction loops (phone, social media, substances)
- Financial recovery step-by-step
- Identity reconstruction after failure
- Neuroplasticity exercises

**NOVA (Productivity)**:
- Time blocking methodology
- Deep work rituals (Cal Newport)
- Habit stacking (James Clear)
- Parkinson's Law application
- Energy management vs time management
- Context switching cost awareness

---

## PHASE 4 — BUDGET & FINANCIAL TRACKER

### 4.1 Core Budget Engine (Built In-House)
**Convex tables**:
```
transactions: userId, amount, type (income/expense), category, description, date, isRecurring, tags[]
budgetCategories: userId, name, monthlyLimit, color, icon
financialGoals: userId, name, targetAmount, currentAmount, deadline, type (savings/debt_payoff/investment)
```

### 4.2 Features
- **Quick expense logging**: Terminal-style input — type `spent 15 lunch` → parsed by AI
- **Category auto-detection**: AI categorizes expenses based on description
- **Monthly budget view**: Bar chart showing spend vs budget per category
- **Income tracking**: Log income sources, track freelance/business revenue
- **Recurring expense management**: Rent, subscriptions, loans — auto-tracked
- **Savings goals**: Visual progress bars (pixel art style)
- **Spending patterns**: AI identifies unhealthy spending patterns, suggests cuts
- **AI Financial Advisor**: Coach bot (TITAN or PHOENIX) can analyze spending and give advice
- **Export**: CSV export for tax purposes

### 4.3 Bank Integration (Optional, via Plaid)
Plaid offers a free tier for developers to test the API, with the first 200 API calls free. Plaid is a financial technology company that builds the infrastructure connecting applications to users' bank accounts, founded in 2013.

- **Implementation**: Use Plaid Link for secure bank connection
- **Scope**: Read-only transaction data — no write access to accounts
- **User control**: Connect/disconnect anytime from settings
- **Privacy**: Display clear data handling policy before connection
- **Fallback**: Full manual entry system for users who don't want bank integration
- **International**: For regions without Plaid support, manual CSV import from bank statements

### 4.4 Inspiration Sources
Firefly III is a self-hosted manager for your personal finances that can help you keep track of expenses and income, and supports the use of budgets, categories and tags. Actual is a local-first personal finance tool that is 100% free and open-source, written in NodeJS, with synchronization across devices.

We take the best from these open-source tools and rebuild within Resurgo's terminal aesthetic.

---

## PHASE 5 — HEALTH & WELLNESS SUITE

### 5.1 Calorie Tracker
- **Convex table**: `nutritionLogs` — userId, date, meals[], waterGlasses, notes, aiSuggestions[]
- **Meal plans table**: `mealPlans` — userId, weekStartDate, days[], dietaryPreferences, active
- Quick meal log: type meal name + rough calories
- AI estimates calories from description
- Water intake tracker (8-glass progress bar, pixel art)
- Daily/weekly macro summary

### 5.2 Diet & Meal Planning
- User profile extension: `dietaryPreferences` (vegetarian, vegan, gluten-free, dairy-free, calorie target, protein target, cuisine preferences)
- AI generates weekly meal plans based on: dietary prefs, active goals, budget constraints
- "Today's Suggestion" panel on dashboard
- Regenerate button for new suggestions
- Settings page: "Nutrition Preferences" section

### 5.3 Sleep Tracker
- Manual sleep log: bedtime, wake time, quality rating (1-5)
- Sleep pattern analysis over 7/30 days
- AI recommendations for sleep improvement
- Coach AURORA specially trained for sleep optimization
- Evening reminder notification (via Telegram/WhatsApp)

### 5.4 Step/Activity Tracker
- Manual daily step log (or integrate with wearable if using Terra API)
- Terra API transforms raw health metrics such as HRV, respiratory rate, sleep and activity into validated scores including recovery, strain, stress, and immunity, backed by research and adapted to individual users' baseline values.
- Activity goals with streak tracking
- Movement reminders during focus sessions

### 5.5 Food Intake Tracker
- Food diary with AI-powered nutritional analysis
- Use free [OpenFoodFacts API](https://openfoodfacts.org) for food database
- Barcode scanner (future mobile app)
- Pattern recognition: AI identifies emotional eating, late-night eating, etc.

### 5.6 Calm Sounds Player
- Built-in ambient sound player with categories:
  - Rain, Forest, Ocean, Campfire, White Noise, Lo-fi
- Source: Free royalty-free ambient audio files
- Integrate with Focus Mode
- Timer: auto-stop after focus session ends
- Volume mixer: blend multiple sounds

### 5.7 Weather Tracker
- Free [Open-Meteo API](https://open-meteo.com) — no API key needed
- Display current weather on dashboard
- AI coaches use weather context: "It's sunny today — AURORA suggests a walk outside"
- Weather-based habit suggestions

---

## PHASE 6 — BUSINESS GOAL ENGINE

### 6.1 Business Module
- New dashboard section: "Business Command Center"
- Track: revenue goals, client acquisition, product milestones
- **Convex table**: `businessGoals` — userId, businessName, type (revenue/clients/launch/growth), target, current, milestones[], aiTasks[]

### 6.2 AI-Generated Business Tasks
- TITAN coach generates specific, actionable business tasks based on stated goals
- Example: If goal is "Launch SaaS product" →
  - Week 1: Validate idea with 10 potential customers
  - Week 2: Build MVP landing page
  - Week 3: Set up payment processing
  - etc.
- Tasks are specific, not generic — tailored to user's stated business type and stage

### 6.3 Business Health Dashboard
- Revenue tracking chart
- Customer/client count tracker
- Key metrics (customizable)
- AI-generated weekly business insights
- Competitor awareness prompts

### 6.4 Hustle Reminders
- "Keep the user aware of how they need to get their shit together"
- Daily motivational push: Don't get distracted, don't get taken advantage of
- Focus reminders during business hours
- Anti-distraction notifications
- Real talk from PHOENIX/TITAN coaches when user is slacking

---

## PHASE 7 — PLAN BUILDER & TASK INTELLIGENCE

### 7.1 Smart Plan Builder
- User enters a big goal → AI breaks it into phases → phases into milestones → milestones into daily tasks
- **NOT GENERIC** — each breakdown is unique to the specific goal
- AI considers: user's available time, current commitments, skill level, resources
- Visual: tree/waterfall view of goal → sub-goals → tasks

### 7.2 Task Decomposition
- When user creates a "big" task (AI detects complexity), prompt: "This looks like a big one. Want me to break it down?"
- User approves → AI creates 3-7 sub-tasks
- Sub-tasks have estimates, dependencies, priorities
- Progress bar shows sub-task completion toward parent task

### 7.3 Predictive Task Suggestions
- App learns user's patterns over time
- Predicts tasks based on: day of week, time patterns, goal progress
- Suggests: "You usually plan your week on Sundays. Want to start?"
- Learns what types of tasks user procrastinates on → coaches address this specifically

### 7.4 AI-Powered Task Validation
- When AI or user creates tasks, AI validates:
  - Is this achievable in the stated timeframe?
  - Does this actually move the needle toward the goal?
  - Is this too vague? (suggest making it specific)
  - Is there a dependency the user hasn't considered?

---

## PHASE 8 — INTEGRATIONS HUB

### 8.1 Google Calendar Sync
- OAuth flow: `src/app/api/integrations/google/route.ts` + callback
- Scopes: `calendar.readonly` + `calendar.events`
- **Convex table**: `integrations` — userId, provider, accessToken, refreshToken, expiresAt, scopes[]
- Sync Resurgo tasks with due dates → Google Calendar events
- Settings "Integrations" section with connect/disconnect cards

### 8.2 Google Tasks Sync
- Same OAuth token (add Google Tasks API scope)
- One-way import: pull Google Tasks into Resurgo

### 8.3 Zapier/Make Webhook Layer
- **Convex table**: `webhooks` — userId, url, events[], secret, active
- Supported events: `task.created`, `habit.logged`, `goal.completed`, `streak.broken`, `budget.expense`, `focus.completed`
- Route: `src/app/api/webhooks/route.ts` — test-fire + CRUD
- Outbound firing: when matching event occurs, fire all subscribed webhooks
- Settings section: "Webhooks & Automation" with URL input + event checkboxes
- Documentation page: `src/app/(marketing)/docs/webhooks/page.tsx`

### 8.4 Web Search Integration
- Use **Ecosia** search API for web searches (aligned with nature/sustainability values)
- Google Custom Search API (free tier: 100 queries/day) as fallback
- AI coaches can search the web for relevant information during sessions

### 8.5 Free APIs Integrated

| API | Purpose | Cost |
|---|---|---|
| Open-Meteo | Weather data | Free, no key |
| OpenFoodFacts | Food/nutrition database | Free |
| Ecosia/Google CSE | Web search | Free tier |
| Telegram Bot API | Messaging | Free |
| Evolution API (Baileys) | WhatsApp | Free, self-hosted |
| Plaid | Bank connection | Free tier (200 calls) |
| Resend | Email sending | Free (100/day) |
| Unsplash | Blog/marketing images | Free |
| Google Calendar API | Calendar sync | Free |
| Google Tasks API | Task sync | Free |
| Ollama | Local AI | Free |
| Groq | AI inference | Free tier |
| Google Gemini API | AI inference | Free tier |
| OpenRouter | AI fallback | Free tier |

---

## PHASE 9 — FOCUS & ANTI-PROCRASTINATION SYSTEM

### 9.1 Enhanced Focus Mode
- Pomodoro timer with customizable intervals
- Ambient sound integration (calm sounds player activates)
- Block notifications during focus (Telegram/WhatsApp notifications paused)
- Focus session history and analytics
- Streak tracking for consecutive focus days

### 9.2 Anti-Procrastination Engine
- AI detects procrastination patterns:
  - Task sitting untouched for 3+ days
  - User consistently delaying same category of tasks
  - Late-night task creation but no morning completion
- Intervention system:
  - Gentle nudge (day 1 missed)
  - Coach conversation triggered (day 3 missed)
  - Task restructure suggestion (day 5 missed)
  - Priority escalation (week missed)

### 9.3 Dopamine & Brain Training
- **Pineal gland awareness content**: Pre-loaded tips on sleep, sunlight exposure, meditation
- **Reasoning restoration exercises**: Daily logic puzzles, decision-making scenarios
- **Dopamine detox protocols**: PHOENIX coach can guide multi-day digital detoxes
- **Screen time awareness**: Periodic reminders to take breaks
- **Brain sharpening**: Weekly cognitive challenges suggested by NOVA coach

### 9.4 Distraction Awareness
- "Stay focused. Don't let the noise win." — periodic motivational interrupts
- Daily intention setting: "What's the ONE thing that matters today?"
- End-of-day reflection prompt: "Did you move the needle today?"
- Weekly: "What distracted you this week? Let's fix that."

---

## PHASE 10 — AMBIENT & NATURE FEATURES

### 10.1 Nature Connection
- AURORA coach specifically trained to recommend nature activities
- Weather-based nature suggestions: "It's 72°F and sunny — take a 15-minute walk in the park"
- Nature appreciation journal prompts
- Forest bathing (Shinrin-yoku) guided sessions
- Grounding exercises

### 10.2 Mindfulness Features
- Breathing exercises (box breathing, 4-7-8, Wim Hof intro)
- Quick meditation timer (3, 5, 10 minutes)
- Gratitude logging (3 things daily)
- Mood tracking (emoji-based, 5-point scale)
- Journaling prompts (AI-generated based on user's current struggles)

---

## PHASE 11 — MARKETING AUTOMATION & SELF-PROMOTION

### 11.1 Automated Reddit Marketing
- **Convex cron job**: Monitors relevant subreddits via Reddit API (free):
  - r/productivity, r/getdisciplined, r/selfimprovement, r/Entrepreneur, r/habittracking
- **Strategy**: NOT spam. The bot:
  1. Identifies posts where people ask for productivity/habit app recommendations
  2. Drafts a helpful, genuine response mentioning Resurgo naturally
  3. Queues for human review (you approve/edit before posting)
  4. Tracks which responses drive traffic (UTM links)
- **Account management**: Use Reddit API with OAuth, respect rate limits
- **Content types**:
  - Genuine helpful comments (not promotional)
  - "Show HN" style posts on r/sideproject, r/webdev
  - Weekly progress update posts (building in public)

### 11.2 GitHub Presence
- Open-source the public API client libraries
- Create a beautiful README with GIFs/screenshots
- Add to GitHub Topics: `productivity`, `habit-tracker`, `terminal-ui`, `saas`
- Star-bait: Open-source the cursor component, ambient sounds module, and AI coach prompt templates

### 11.3 Community Seeding
- Product Hunt launch preparation (screenshots, description, maker story)
- Indie Hackers post: "How I Built a Terminal-Style Productivity App"
- Hacker News: "Show HN: Resurgo — Terminal-style life management"
- BetaList submission
- Dev.to + Hashnode technical blog posts about the tech stack

### 11.4 Social Media Automation
- Auto-generate shareable achievement cards when users hit milestones
- `ShareAchievement.tsx` component renders terminal-style 1200×630 card
- Share to X/Twitter, LinkedIn — with Resurgo branding
- Dynamic OG image route: `src/app/api/og/achievement/route.ts`

### 11.5 SEO Automation Monitoring
- Weekly automated Lighthouse audit (via cron)
- Sitemap auto-generation for all public routes including blog
- robots.txt properly configured
- Structured data: WebApplication schema in `<head>`

---

## PHASE 12 — BLOG & SEO (Harbor SEO Integration)

### 12.1 Harbor SEO
Harbor creates highly ranking content with AI-powered SEO tools, generating keyword research, content, and powerful backlinks. Harbor seamlessly integrates legacy SEO strategies with advanced Large Language Models, analyzing your website's unique context, brand voice, and industry specifics to generate highly optimized content. It covers keyword research, blog content generation, and strategic link building.

- Use Harbor SEO for: keyword research, content structure, internal linking suggestions
- Harbor currently offers free use with limited credits. Use free tier for initial blog posts
- If budget allows later, upgrade for bulk content generation

### 12.2 Blog Infrastructure
- New route group: `src/app/(marketing)/blog/`
- `page.tsx` — blog index with article cards (terminal-styled)
- `[slug]/page.tsx` — dynamic route with `generateMetadata` for per-article SEO
- Each post has: full OpenGraph meta, Twitter card, structured data

### 12.3 Blog Content Strategy (10 Launch Articles)
Write in terminal-styled layout. Each ~1500-2000 words. Highly unique, content-rich:

1. **"How to Build Habits That Actually Stick (Science-Backed Guide 2026)"** — informational, targets Atomic Habits audience
2. **"Best Productivity Apps for Goal Setting — Honest Comparison"** — comparison, includes Resurgo naturally
3. **"The Terminal Approach to Life Management — Why Command Lines Beat Pretty UIs"** — unique angle, brand story
4. **"AI Habit Coach — Does It Actually Help? 90-Day Experiment"** — trust/conversion
5. **"How to Track Goals Digitally — Complete Guide for Beginners"** — how-to SEO
6. **"Dopamine Detox Guide: Reset Your Brain in 30 Days"** — wellness, high search volume
7. **"Breaking Bad Habits: A Programmer's Approach to Behavioral Change"** — dev audience
8. **"Budget Tracking for People Who Hate Spreadsheets"** — financial feature promotion
9. **"Why Most Productivity Apps Fail (And What Resurgo Does Different)"** — direct conversion
10. **"Building in Public: How We're Creating the Ultimate Life OS"** — founder story

### 12.4 Landing Page SEO Rewrite
- Hero headline: **"Get Your Life Back Together. One System. Zero Excuses."**
- Semantic `<h1>` tag
- Full OpenGraph suite: `og:title`, `og:description`, `og:image` (800×400 terminal card), `og:type: website`
- Twitter card meta tags
- Structured data: `WebApplication` schema with `applicationCategory: LifestyleApplication`

---

## PHASE 13 — EMAIL DRIP & REFERRAL SYSTEM

### 13.1 Email Drip (via Resend — Free: 100 emails/day)
**5 email templates** in `src/lib/email-templates/`:

| Day | Subject | Content |
|---|---|---|
| 0 (signup) | "Welcome to Resurgo. Let's get your life back." | Terminal-styled welcome, quick-start guide |
| 2 | "Did you set your first habit?" | Gentle nudge + how-to |
| 5 | "Your streak is building — protect it" | Streak science + tips |
| 10 | "Meet your AI coach — they're ready" | Coach intro + feature highlight |
| 30 | "30 days in — look how far you've come" | Achievement summary + share prompt + referral CTA |

- **Convex cron job**: `convex/emailCrons.ts` fires daily, checks user milestone days, triggers correct email
- Env var: `RESEND_API_KEY`

### 13.2 Referral System — "Help Shape Your Homeboy's Life Too"
NOT generic. On-brand, raw, real.

- **Convex table**: `referrals` — referrerId, refereeId, code, status, rewardGranted, createdAt
- Each user gets unique referral code on account creation → stored in `users.referralCode`
- **Referral page** (`/refer`): Terminal-styled with messaging:
  - "Know someone who needs to get their shit together?"
  - "Share Resurgo. Help shape your homeboy's life too."
  - "You've started your comeback. Now pull someone else up."
- **Share options**: Copy link, WhatsApp share, Telegram share, X/Twitter, QR code
- **Reward**: 30 days Pro features on first 3 successful referrals
- **Tracking**: Landing page middleware catches `?ref=CODE` → stores in cookie → converts on signup completion

---

## PHASE 14 — PUBLIC DEVELOPER API

### 14.1 API Routes
Under `src/app/api/v1/`:

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/v1/goals` | List user's active goals |
| POST | `/api/v1/goals` | Create a goal |
| GET | `/api/v1/habits` | List habits |
| POST | `/api/v1/habits/log` | Log a habit completion |
| GET | `/api/v1/tasks` | List tasks |
| POST | `/api/v1/tasks` | Create a task |
| GET | `/api/v1/stats` | User stats (XP, level, streaks) |
| GET | `/api/v1/budget/transactions` | List transactions |
| POST | `/api/v1/budget/transactions` | Log an expense/income |

### 14.2 API Key Auth
- **Convex table**: `apiKeys` — userId, key (hashed), name, createdAt, lastUsedAt, revokedAt, rateLimitPerHour
- Settings → "Developer" section → generate/revoke keys, view last-used
- Middleware validates `Authorization: Bearer <key>` on all `/api/v1/*` routes
- Rate limit: 100 requests/hour free, 1000/hour pro

### 14.3 Developer Docs
- `src/app/(marketing)/docs/api/page.tsx` — styled as terminal man page
- Lists all endpoints, auth headers, example curl commands, rate limits
- `public/openapi.json` — machine-readable OpenAPI spec for tools and AI agents

### 14.4 Use Case
"If anyone wants to make a productivity app, they can use my API to integrate Resurgo into theirs."

---

## PHASE 15 — SAAS BUSINESS INFRASTRUCTURE

### 15.1 Billing (Stripe)
- Verify Stripe integration is complete:
  - Free tier (limited features)
  - Pro tier ($9/month or $79/year)
  - Checkout flow
  - Customer portal (manage subscription)
  - Webhook handling (payment success, failure, cancellation)
- **UPI/Scan-to-Pay**: Stripe supports UPI in India — enable `upi` payment method in Stripe dashboard (no extra code needed). Other regions: standard card payments.

### 15.2 Required SaaS Pages
- [x] Landing page (LandingPageV2)
- [x] Pricing page
- [ ] **Terms of Service** — `src/app/(marketing)/terms/page.tsx`
- [ ] **Privacy Policy** — `src/app/(marketing)/privacy/page.tsx`
- [ ] **Cookie Policy** — banner component
- [ ] **Changelog** — `src/app/(marketing)/changelog/page.tsx`
- [ ] **Status page** — link to free UptimeRobot or similar
- [ ] **Contact/Support** — `src/app/(marketing)/contact/page.tsx`
- [ ] **FAQ** — `src/app/(marketing)/faq/page.tsx`
- [ ] **Developer Docs** — `src/app/(marketing)/docs/page.tsx`
- [ ] **Blog** — `src/app/(marketing)/blog/page.tsx`
- [ ] **About** — `src/app/(marketing)/about/page.tsx`

### 15.3 SaaS Business Model Checklist
- [ ] Free trial / freemium tier clearly defined
- [ ] Upgrade prompts at natural friction points (not aggressive)
- [ ] Churn prevention: email before expiry, pause option
- [ ] Analytics: track signup → onboarding → activation → retention
- [ ] Customer support: at minimum email, ideally in-app chat widget (Crisp free tier)
- [ ] GDPR compliance: data export, data deletion on request
- [ ] Error tracking: Sentry free tier
- [ ] Uptime monitoring: UptimeRobot free tier
- [ ] Performance monitoring: Vercel Analytics (free)

### 15.4 Feature Gating (Free vs Pro)

| Feature | Free | Pro |
|---|---|---|
| Habits | 5 max | Unlimited |
| Goals | 3 max | Unlimited |
| AI Coach sessions | 10/month | Unlimited |
| Focus Mode | Basic timer | Advanced + sounds + analytics |
| Budget Tracker | Manual only | Bank integration + AI insights |
| Telegram/WhatsApp Bot | Basic commands | Full AI coach + meal plans |
| Meal Plans | 1/week | Unlimited + custom |
| Integrations | None | Google Cal, Webhooks |
| API Access | None | Full |
| Coach Selection | 2 coaches | All 6 |
| Analytics | Basic | Advanced patterns + predictions |

---

## PHASE 16 — FINAL QA, LEGAL & LAUNCH

### 16.1 Error Handling & Resilience
- **AI Fallback Chain**: Ollama (local) → Groq → Gemini → OpenRouter
- If ALL AI fails: graceful degradation — show pre-written tips/suggestions from local database, NOT an error message
- Every API call wrapped in try/catch with meaningful user-facing messages
- Offline-capable: core features (task list, habit check-off) work without internet
- Rate limit handling: queue and retry, never lose user data

### 16.2 Testing Checklist
- [ ] Custom cursor works on all browsers (Chrome, Firefox, Safari, Edge)
- [ ] All body text passes WCAG AA (4.5:1 contrast)
- [ ] Onboarding flow: new user can complete in < 3 minutes
- [ ] Telegram bot: all commands work end-to-end
- [ ] WhatsApp bot: message send/receive works
- [ ] AI coaches: each coach responds in character
- [ ] Budget tracker: expense CRUD, category assignment
- [ ] Meal plan generation works
- [ ] Focus mode timer + ambient sounds play
- [ ] Google Calendar sync works
- [ ] Webhook fires on event
- [ ] Stripe: payment → access granted
- [ ] Referral: code tracks through signup
- [ ] API: key generation → authenticated request → response
- [ ] Email drip: signup triggers welcome email
- [ ] Blog: all 10 articles render with proper meta tags
- [ ] Mobile responsive: all pages work on 375px width
- [ ] Share card generates with correct OG image

### 16.3 Legal
- Terms of Service (use template, customize)
- Privacy Policy (list all data collected, third-party services)
- Cookie consent banner
- GDPR: data export endpoint, data deletion endpoint
- Stripe PCI compliance (handled by Stripe Checkout)

### 16.4 Launch Sequence
1. **Week -2**: Deploy to production, invite 20 beta testers
2. **Week -1**: Fix all beta feedback, prepare launch assets
3. **Launch Day**:
   - Product Hunt submission (Tuesday, 00:01 PST)
   - Reddit posts: r/sideproject, r/webdev, r/productivity
   - Hacker News: "Show HN: Resurgo"
   - BetaList submission
   - Twitter/X announcement thread
   - LinkedIn post
4. **Week +1**: Respond to all feedback, iterate fast, blog post about launch metrics
5. **Week +2**: Indie Hackers post, dev.to technical deep-dive
6. **Month +1**: First email to churned free users, referral system push

---

## IMPLEMENTATION ORDER (Priority Sequence)

```
Sprint 1 (Days 1-3):    Phase 0 — Polish, cursor, accessibility, onboarding
Sprint 2 (Days 4-7):    Phase 3 — AI Coach training (system prompts only, no new UI)
Sprint 3 (Days 8-12):   Phase 1 — Telegram Bot
Sprint 4 (Days 13-16):  Phase 7 — Plan Builder & Task Intelligence
Sprint 5 (Days 17-20):  Phase 9 — Focus & Anti-Procrastination
Sprint 6 (Days 21-24):  Phase 4 — Budget Tracker (manual first)
Sprint 7 (Days 25-28):  Phase 5 — Health Suite (calorie, sleep, sounds)
Sprint 8 (Days 29-32):  Phase 6 — Business Goal Engine
Sprint 9 (Days 33-36):  Phase 8 — Integrations (Google Cal, Webhooks)
Sprint 10 (Days 37-40): Phase 2 — WhatsApp Bot
Sprint 11 (Days 41-44): Phase 12 — Blog & SEO
Sprint 12 (Days 45-48): Phase 13 — Email Drip & Referral
Sprint 13 (Days 49-52): Phase 14 — Public API
Sprint 14 (Days 53-56): Phase 15 — SaaS Infrastructure
Sprint 15 (Days 57-60): Phase 10 & 11 — Nature features & Marketing automation
Sprint 16 (Days 61-65): Phase 16 — QA, Legal, Launch prep
Launch Day: Day 66
```

---

## TECH DECISIONS SUMMARY

| Decision | Choice | Reason |
|---|---|---|
| Messaging Bot Priority | Telegram first, WhatsApp second | Free API, instant setup, no Meta approval |
| WhatsApp Integration | Evolution API (Baileys) | Open-source, REST API, multi-session support, free and highly customizable with community support. |
| Budget Engine | In-house + optional Plaid | Full control, free core, Plaid free tier for bank link |
| Personal Finance Reference | Firefly III + Actual Budget patterns | Firefly III gives insight and control over finances, making money useful rather than scary. |
| SEO Tool | Harbor SEO | Harbor analyzes your website and generates high-quality, SEO-optimized articles in minutes. |
| Health Data | Terra API (future) + manual logging | Terra API enables integration with wearables like Garmin, Fitbit, Apple, Google, Polar through a single source. |
| Calorie Database | OpenFoodFacts API | Free, open source, comprehensive |
| Weather | Open-Meteo API | Free, no API key required |
| Email | Resend | Free tier: 100 emails/day |
| Cursor | CSS-only SVG | Native cursor behaviour guaranteed |
| AI Cascade | Ollama → Groq → Gemini → OpenRouter | All free, graceful fallback |
| Bot Framework | Custom (no framework) | Lighter, faster, no dependencies |
| Marketing Automation | Custom Convex cron jobs | No external tool costs |
| Competitor Approach | Habitica focuses on gamified habit tracking — Resurgo does gamification PLUS AI coaching PLUS financial management PLUS business goals, making it far more comprehensive. |

---

## WHAT MAKES RESURGO BEAT EVERY COMPETITOR

| Competitor | What They Do | What Resurgo Does Better |
|---|---|---|
| **Habitica** | Gamified interface where you make a character and track habits. | Same gamification + AI coaches + financial + business + messaging bots |
| **Todoist** | World-class to-do list with recurring tasks for habit stacking. | Task intelligence + AI decomposition + coach-driven prioritization |
| **Notion** | A universe of digital LEGO bricks. | Opinionated structure (not blank canvas), AI that actively pushes you |
| **Streaks** | Extreme simplicity, track exactly 12 habits. | Unlimited habits + goals + tasks + financial + AI coaching |
| **Habitify** | Focused on structured tracking and insight-driven self-improvement. | Same analytics + AI coaches + Telegram/WhatsApp + budget + meal plans |
| **Forest** | Cultivates focus habit — plant virtual tree, leave app and it dies. | Built-in focus mode + ambient sounds + anti-procrastination engine |
| **TickTick** | Comprehensive productivity suite combining task management, calendar, and Pomodoro timer. | All that + AI coaching + budget + messaging bots + business tools |
| **YNAB** | Budget tracking | Budget tracker + life management + AI financial advisor |
| **Calm/Headspace** | Meditation & wellness | Ambient sounds + breathing exercises + AI wellness coach AURORA |

**Resurgo's unique moat**: No other app combines terminal aesthetic + AI personality coaches + Telegram/WhatsApp bot + budget tracker + business goal engine + meal planning + focus mode + public API — all in one system.

---

## AI MODEL PIPELINE CONFIGURATION

```typescript
// src/lib/ai-cascade.ts
const AI_CASCADE = [
  {
    name: 'ollama',
    priority: 0,
    endpoint: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: 'llama3.1:8b',
    cost: 0,
    fallback: true,
    maxTokens: 4096
  },
  {
    name: 'groq',
    priority: 1,
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.1-70b-versatile',
    cost: 0, // free tier
    rateLimit: '30/min',
    maxTokens: 8192
  },
  {
    name: 'gemini',
    priority: 2,
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    cost: 0, // free tier
    rateLimit: '15/min',
    maxTokens: 8192
  },
  {
    name: 'openrouter',
    priority: 3,
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    cost: 0, // free tier
    maxTokens: 4096
  }
];

// Fallback logic: try each in order, if one fails -> next
// If ALL fail: return pre-written response from local tips database
```

---

## FINAL NOTES

This is **THE** document. Every feature discussed is here. Every integration researched. Every coach defined. Every marketing channel planned. Every competitor analyzed.

**Core principle**: Resurgo isn't just an app — it's a system that genuinely changes lives. Every feature must serve that mission. No bloat. No fluff. Everything earns its place by helping someone get their life back together.

**Budget**: $0 for all core tools and services (free tiers across the board). Only paid costs: domain, hosting (Vercel free tier works), and optional Harbor SEO/Plaid upgrades later.

**Start with Phase 0. Ship it. Move to Phase 1. Keep shipping.**

---

*"Resurgo — Bring back to life."*

---

Would you like me to start implementing Phase 0 (Polish, Cursor, Onboarding & Accessibility) now?