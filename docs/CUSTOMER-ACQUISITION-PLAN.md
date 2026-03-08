# RESURGO :: OPERATOR_MISSION — First Customer + 25 Signups

> **Goal:** 1 paying customer + 20–25 email signups  
> **Timeline:** 30 days from launch  
> **Stack:** Resend + Meta Pixel + Reddit + Discord + organic social

---

## PHASE 0: LAUNCH CHECKLIST (Do These First — Today)

### Technical Must-Haves Before Promoting
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` set in Vercel env vars
- [ ] `META_ACCESS_TOKEN` set (Conversions API)
- [ ] `DISCORD_WEBHOOK_URL` set (get notified on signups)
- [ ] `ADMIN_EMAILS` set to your email address
- [ ] `RESEND_API_KEY` confirmed working (send yourself a test welcome email)
- [ ] Test full signup → welcome email flow
- [ ] Test free → Pro upgrade flow (Dodo Payments working)
- [ ] All 8 AI coaches respond (test ORACLE and NEXUS)
- [ ] Mobile: check the app on iPhone + Android

---

## PHASE 1: PLATFORM PREP (Days 1–3)

### Your Personal Brand Accounts (if not already set up)
Create/update these as the **creator of Resurgo** — not as the brand:

| Platform | Account | Strategy |
|----------|---------|----------|
| X/Twitter | @you | "Building an AI life OS in public" |
| Reddit | u/your-username | Participate in communities (see below) |
| LinkedIn | Your profile | "Founder building Resurgo" |
| TikTok/Instagram Reels | @resurgolife or @you | 30s app demos |
| Discord | Create Resurgo server | Community hub |
| Product Hunt | Account + followers | For launch day |

### Content You Need Ready (Create These Before Posting)
1. **30-second screen recording** of the app — MARCUS coach conversation, habit streak, goal decomposition
2. **"I built this because..." story** — 100 words, personal, honest (your restart cycle story)
3. **Before/After comparison** — what life felt like without a system vs with Resurgo
4. **Problem post** — "Why does every productivity app feel the same?" (no mention of Resurgo yet)

---

## PHASE 2: COMMUNITY-FIRST SIGNUPS (Days 3–14) — Target: 15 Signups

### The Strategy: Give First, Promote Second
**NEVER** post direct promotional links immediately. Follow the **5-1 rule**: 5 value posts before 1 promotional mention.

---

### Reddit Playbook — Highest ROI Channel

#### Target Subreddits (Engage in This Order)
```
r/getdisciplined        — 3.2M members, very active
r/HabitTracker          — 25K members, niche, less competition  
r/selfimprovement       — 2.1M members
r/productivity          — 1.1M members (strict rules, no spam)
r/ADHD_Productivity     — 250K members, underserved
r/nosurf                — 180K members
r/Entrepreneur          — for creator/founder angle
```

#### Week 1: Comment Only (Do NOT post links yet)
- Spend 15 min/day in 2–3 subreddits
- Answer questions genuinely
- Build up comment karma
- Goal: 10+ quality comments, 50+ karma

#### Week 2: Post Your Story (Soft Launch)
**Post to r/getdisciplined:**
```
Title: "I built my own productivity app after failing every other one — honest reflection"

[Tell your restart cycle story]
[Share what you learned about why apps fail]
[Mention you built something to solve this]
[At the END only: "If anyone wants to try it, resurgo.life — it's free"]
```

**Expected:** 50–200 upvotes if authentic, 50+ profile views, 5–15 signups

#### Week 3: Targeted Posts
- Post to r/HabitTracker: "Just launched my habit tracker with AI coaches"
- Post to r/ADHD_Productivity: Frame around the restart cycle, PHOENIX coach
- Use the `/api/marketing/reddit` route to prep posts (dryRun: true first)

---

### Discord Strategy

1. **Create your own Resurgo Discord server** (free)
   - Channels: #welcome, #goals, #wins, #feedback, #product-updates
   - Add invite link to DISCORD_WEBHOOK env var
   
2. **Join 5–10 productivity/self-improvement servers** as a member
   - Participate genuinely for 3–4 days
   - Share that you're building Resurgo in #intros when asked

3. **Activate Discord webhooks** with `DISCORD_WEBHOOK_URL` so you get instant alerts when someone signs up

---

### X/Twitter (Quick Wins)

**Thread format (post this):**

```
Thread: Why "start fresh Monday" is destroying your goals 🧵

1/ I failed at the same goals 11 times in 2 years.
   Not because I lacked discipline.
   Because I had the wrong system.

2/ Every app I tried rewarded streaks and punished breaks.
   So when life happened and I missed a day —
   I didn't just lose a streak. I lost momentum. Then identity.

3/ The cycle: Commit → Crush it → Miss one day → Shame spiral → Abandon → Restart
   Anyone else know this loop?

4/ The fix isn't more discipline. It's a system that accounts for being human.
   So I built one. 8 AI coaches. Comeback protocols built-in.
   It's called Resurgo. Free to try: resurgo.life

[attach 30s screen recording]
```

---

## PHASE 3: META ADS + RETARGETING (Days 14–25) — Target: 10 More Signups

### Before Spending ANY Money — Do This First
The Meta Pixel must have 10–15 organic signups tracked before ads are reliable.

Once pixels are firing correctly:

### Campaign 1: Cold Traffic (Budget: $5–10/day)
```
Objective: Conversions → Lead
Audience: Interests = productivity apps, Notion, Habitica, self-improvement
                      Behaviors = engaged shoppers, small business owners
Age: 22–35
Location: USA, UK, Canada, Australia
Ad Format: Short video (15-30s) showing the ORACLE coach
CTA: "Try Free at resurgo.life"
```

### Campaign 2: Retargeting (Add after Week 2)
```
Objective: Conversions → CompleteRegistration
Audience: Website visitors (past 7 days) who DID NOT sign up — 
          Meta Pixel custom audience
Budget: $3/day
Ad: "You visited Resurgo. Here's what you get with 2 free coaches..."
```

### Ad Creative Formula (A/B Test)
- **Version A** (Pain Point): "Tired of starting over? There's a reason you keep restarting." 
- **Version B** (Feature): "8 AI coaches. Zero generic advice. Built for humans who actually fail sometimes."
- **Version C** (Social proof): "Join [X] people using an AI life OS that actually adapts to them."

### Pixel Events to Track (Already in MetaPixel.tsx)
```
PageView → fires on every page load
Lead → fire when user completes signup (CompleteRegistration)
InitiateCheckout → fire when user clicks upgrade
Purchase → fire when subscription completes
```

---

## PHASE 4: PRODUCT HUNT LAUNCH (Day 21–28) — Potential: 50–200 Signups in 1 Day

### 30 Days Before Launch
- [ ] Create Product Hunt account
- [ ] Follow 20+ active PH makers
- [ ] Comment on 5 other launches (gives credibility)
- [ ] Get 5 "hunters" to follow you (DM on X/LinkedIn)

### Launch Day Checklist
- [ ] Schedule for Tuesday or Wednesday (highest traffic)
- [ ] Time: 12:01 AM PST
- [ ] Gallery images ready: 5 screenshots, 1 hero image
- [ ] Video: 90-second demo
- [ ] Tagline: "8 AI life coaches that actually read your data before advising you"
- [ ] First comment: personal story (not marketing copy)
- [ ] Ask 20 people to upvote/comment on launch day

---

## PHASE 5: DIRECT OUTREACH (Days 1–30, Ongoing) — Most Reliable Channel

### Email Your Personal Network First
Send this to 20–30 people you know:

```
Subject: I built something — would love 5 minutes of your honest opinion

Hey [Name],

I've been quietly building a productivity app for the past few months. 
It's called Resurgo — it's an AI life operating system.

The thing that makes it different: the AI coaches actually read your 
real data (habits, goals, tasks) before responding. Not generic advice.

I'd love your honest feedback before I push marketing. 
Free to try: resurgo.life

No pressure to keep using it — just 5 minutes would mean a lot.

[Your name]
```

### LinkedIn Founder Story Post
```
6 months ago I built a productivity app for myself because nothing 
else was working.

Today it's called Resurgo. Here's what I learned building it:

[3-4 genuine lessons about productivity and building in public]

If you're someone who's tried every app and still feels stuck — 
I think you'll find it worth trying. Link in comments.
```

---

## CONVERSION STRATEGY: Free → First Paying Customer

### Trigger: The Upgrade Decision
Highest conversion moments:
1. When user has a **7-day habit streak** 
2. When they **chat with MARCUS or AURORA** and get genuine value
3. When they **hit the Pro feature wall** (TITAN, SAGE, PHOENIX, NOVA locked)
4. After completing the **Deep Scan** (high investment = more likely to upgrade)

### Upgrade Email Sequence (Automated via `/api/email/campaigns`)
```
Day 0: Welcome email (already implemented)
Day 3: If no Deep Scan completed → "Complete your AI profile" nudge
Day 7: If streak ≥ 7 → Streak milestone email with Pro upgrade mention  
Day 10: "You're using [feature], here's what Pro unlocks" contextual nudge
Day 14: Direct upgrade email with pricing clarity
Day 21: If still free → Re-engagement email from PHOENIX ("comeback")
```

### Pricing Clarity (Add to UI)
```
Free:    2 coaches (MARCUS + AURORA), 3 habits, 5 goals
Pro:     8 coaches, unlimited everything = $97/year ($8.08/mo)
Lifetime: Everything forever = $197 one-time
```

**The first paying customer pitch to FOCUS on:** The user who has been active 10+ days as free and has clear engagement signals (habit streaks, goal completions). Message them directly if possible.

---

## WEEK-BY-WEEK EXECUTION PLAN

| Week | Primary Actions | Target Signups |
|------|-----------------|----------------|
| Week 1 | Fix env vars, test all flows, personal network outreach, Reddit karma building | 3–5 |
| Week 2 | First Reddit story post, X thread, Discord join | 5–8 |
| Week 3 | Meta Pixel activation, more Reddit posts, direct upgrade email to engaged users | 5–8 |
| Week 4 | Product Hunt prep, retargeting ads, community posts | 5–10 |

**Cumulative target: 20–25 signups, 1 paying customer (day 10–21)**

---

## TRACKING YOUR PROGRESS

### Key Metrics to Watch Daily
```
Signups: Clerk Dashboard → Users
Active users: Convex Dashboard → users table 
Habit completions: convex → habits  
Coach conversations: convex → coachMessages
Pixel events: Meta Events Manager (verify after setup)
Email opens: Resend Dashboard → Emails
Discord alerts: Should ping your channel on each signup
```

### First Paying Customer Signals
Watch for users who:
- Active 3+ consecutive days
- Has 7+ day habit streak
- Has chatted with a coach 5+ times
- Has set 2+ goals

These users are ready for a personalized upgrade message from you directly.

---

## THE UNFAIR ADVANTAGE

Resurgo is different from Habitica, Notion, Streaks, and all the others because:

1. **AI coaches that use real user data** — Not just chatbots, they read your actual goals/habits
2. **Comeback protocol built in** — PHOENIX coach specifically for restart cycles
3. **8 distinct coaching philosophies** — stoic, neural, performance, finance, resilience, creative, omniscient, neural-integration
4. **Terminal aesthetic** — genuinely unique design that looks like nothing else
5. **Free tier with real value** — 2 coaches +habits + goals. People will actually use it.

**Positioning: "The first AI life OS that actually adapts to you — not just recommends."**

---

*Last updated: Post-sprint implementation*  
*Status: Launch-ready pending env var configuration*
