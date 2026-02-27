# Support Team Training: Billing v2.1.0 Release

**Date:** February 26, 2026  
**Training Duration:** 1–2 hours  
**Audience:** Support team, customer success, escalation handlers  
**Prerequisite:** Read [RELEASE-NOTES.md](RELEASE_NOTES.md) first (15 min)

---

## Quick Reference Card (Print This)

```
=== BILLING v2.1.0 SUPPORT QUICK GUIDE ===

🎯 Main Change: Free tier users can now restore archived items after plan downgrade

Q: "I upgraded but some of my habits/goals are missing!"
A: During a downgrade, items over the free limit (10 habits / 3 goals) were archived 
   to preserve them. Upgrade back to Pro to restore them! Go to Settings > Archived Items.

Q: "What's 'Archived Items'?"
A: When your plan changes, items beyond the free tier limits are archived (saved) 
   instead of deleted. You can restore them anytime in Settings > Archived Items.

Q: "How do I restore my archived items?"
A: 1. Go to Settings > Archived Items > click Restore
   2. Or upgrade your plan (all archived items restored automatically)

Q: "Will I lose my data?"
A: No! We preserve all your items. They're just hidden (archived) when your plan doesn't 
   allow them. Restore anytime.

Q: "Why did my items get archived?"
A: Your plan changed (downgrade). The free plan allows 10 habits / 3 goals max.
   Any excess items are archived automatically.

Q: "I see a yellow banner about archived items. What do I do?"
A: This is normal! The banner shows you have archived items. Click the banner to go to
   Settings > Archived Items > Restore.

Key Numbers:
- Free plan: 10 habits, 3 goals
- Pro plan: Unlimited habits, unlimited goals
- Archived items stay forever (no expiration)
- Users CAN'T lose data from this change

Escalation: If user reports data loss or can't restore, escalate to engineering immediately.
```

---

## Training Module 1: Understanding the Changes (30 min)

### What Users Will See

**Scenario 1: User with Pro plan downgrades to Free**

**Before This Release:**
- User had 20 habits, 8 goals (Pro plan)
- Payment fails → Auto-downgrade to Free
- Result: 🔴 **Habits 11-20 disappear silently** (data loss) ← BAD

**After This Release:**
- User had 20 habits, 8 goals (Pro plan)
- Payment fails → Auto-downgrade to Free
- System archives excess items:
  - Habits 1-10: remain active
  - Habits 11-20: marked as "archived" with flag `archivedByDowngrade: true`
  - Goals 1-3: remain active
  - Goals 4-8: marked as "archived"
- UI shows yellow banner: "You have 10 archived items. Restore them or upgrade."
- Result: ✅ **Data preserved, user can restore with one click** ← GOOD

**Scenario 2: User on Free plans creates items, then upgrades to Pro**

**Before This Release:**
- Limited to 10 habits / 3 goals (forced limit)
- If upgrade happened before downgrade, nothing special

**After This Release:**
- Free plan: 10 habits, 3 goals (same as before)
- User upgrades to Pro
- System automatically restores any archived items
- User now has all original items + any new items created
- Result: ✅ **Upgrade is seamless, nothing to do**

**Scenario 3: User on Free, never downgraded**

**Expected Behavior:**
- No archived items (user never hit plan limit)
- No yellow banner (nothing to archive)
- No change to user experience
- Result: ✅ **Completely invisible to this user**

---

### Key Points to Remember

1. **Archived ≠ Deleted**
   - Items are saved and recoverable
   - Not lost data; just hidden from active list
   - Archive flag: `archivedByDowngrade = true`

2. **Automatic Process**
   - Users don't need to do anything
   - Archival happens automatically on downgrade
   - Restoration happens automatically on upgrade OR via one-click restore button

3. **One-Click Restore**
   - Users can restore individually in Settings > Archived Items
   - One "Restore All" button to restore all archived items at once
   - Works whether user is on Free or Pro plan

4. **Transparent to User Experience**
   - No surprise data loss (data preserved)
   - One yellow notification banner (non-intrusive)
   - Clear action path: click banner → see archived items → click restore

5. **Plan Limits**
   - Free: 10 habits, 3 goals
   - Pro: Unlimited
   - Lifetime: Unlimited
   - These limits are FIXED (not changing)

---

## Training Module 2: Common Questions & Answers (30 min)

### User Asks: "What happened to my habits?"

**Red Flag Phrases:**
- "My habits disappeared!"
- "Where did my 20 habits go?"
- "I upgraded and lost everything!"

**Root Cause Diagnosis:**
1. Check user's plan history: Did they downgrade (accidentally or intentionally)?
2. Check user's app: Do they see yellow "Archived Items" banner?
3. Check user's Settings > Archived Items: Are the items there?

**Diagnosis Script:**
```
1. Ask: "What plan were you on before, and what plan are you on now?"
2. Ask: "Do you see a yellow banner at the top of your dashboard?"
3. Ask: "If you go to Settings > Archived Items, do you see your missing items?"
4. Ask: "When did you notice your items went missing?"

If answers → downgrade + archival is showing correctly:
"Great news! Your habits are safe. They're archived because you downgraded.
Here's how to restore them..."
```

**Support Response:**

```
RESPONSE TEMPLATE:

Hi [User],

Good news! Your items are safe and saved. Here's what happened:

When your plan changed from [Old Plan] to [New Plan], we automatically archived 
items beyond your new plan's limits to protect your data. The free plan allows 
10 habits and 3 goals maximum.

YOUR ITEMS ARE STILL YOURS. You can restore them anytime:

Option 1 (Quickest):
1. Go to Settings > Archived Items
2. Click "Restore All" button
3. All archived items come back instantly

Option 2 (Selective restore):
1. Go to Settings > Archived Items
2. Click "Restore" next to the items you want back
3. Choose which items to activate

Option 3 (Upgrade to Pro):
If you upgrade your plan back to Pro, all archived items restore automatically.

This change prevents data loss when plans change. Your data is always preserved!

Let me know if you need any help.
Best,
[Support Team]
```

---

### User Asks: "Will my archived items ever expire?"

**Answer:** No. Archived items remain forever. Users can restore them at any time, on any plan.

**Details to Share:**
- No expiration date on archived items
- No automatic deletion
- Can restore one week later, one year later, doesn't matter
- If user stays on Free plan for 6 months and restores, all items come back

---

### User Asks: "Why didn't I get a notification?"

**Answer Options:**

**If they got the yellow banner (most likely):**
"You actually did! When your plan changed, we showed a yellow notification banner 
on your dashboard. It says 'You have X archived items.' That's the notification! 
Click on it to see your archived items."

**If they didn't see the banner (less common):**
"We automatically sent an in-app notification, but it might have been dismissed or 
hidden. No worries—you can still restore from Settings > Archived Items. We'll also 
be sending email notifications about plan changes going forward."

---

### User Asks: "If I upgrade to Pro, will I get my items back automatically?"

**Answer:** Yes! When you upgrade, all archived items restore automatically.

**Details:**
- Upgrade happens instantly
- Archived items appear in active list within seconds
- No need to click anything or go to Settings
- Seamless upgrade experience

---

### User Asks: "What if I have more than 10 habits on Pro, then downgrade?"

**Answer:**
"Great question! Here's exactly what happens:

**Before:** You have 20 habits on Pro plan
**Downgrade:** You change to Free plan
**What happens:** 
- Habits 1-10 stay active (no change to you)
- Habits 11-20 get archived (marked for safety, not deleted)
- You see yellow banner with count

**To restore:** Go to Settings > Archived Items > click Restore

**Important:** Even archived items stay on your account forever. You can restore them 
weeks later if you want."

---

### User Asks: "Can I lose data from this change?"

**Answer:** No. This feature is designed to prevent data loss.

**Detailed Explanation:**
"Before this release, when plans changed, data could be lost silently. We've changed 
that. Now, when your plan changes, excess items are archived (preserved) instead of 
deleted. The yellow banner tells you exactly how many items were archived, so you 
know what happened."

---

### User Asks: "Is there a charge to restore my items?"

**Answer:** No. Restoration is free. It's a built-in feature of your account.

**Details:**
- Restore as many times as you want
- Restore to Pro plan or Free plan (both allowed)
- No fees, no surprises
- Free users can keep archived items on Free plan forever

---

### Tricky Question: "Why do you archive stuff? Why not just delete it?"

**Answer:** Because your data matters, and we respect it.

**Explanation:**
"We don't automatically delete your data. When your plan changes, we preserve 
everything by archiving excess items. You control what happens next:
- Restore them immediately
- Keep them archived for later
- Or upgrade your plan

This way, no data loss, and you have options."

---

## Training Module 3: Troubleshooting (20 min)

### Issue 1: User can't find "Archived Items" in Settings

**Diagnosis:**
- Are they on a version with the feature? (v2.1.0 or newer)
- Have they downgraded their plan? (No archived items = no section visible)
- Are they using mobile or desktop? (Check both interfaces)

**Solution:**
1. Verify they're on latest app version: `Settings > About > Version` should show 2.1.0+
2. Verify they had a plan change: "When was your plan last changed?"
3. If version is old, ask them to update app
4. If no plan change, there are no archived items (nothing to restore)

**Response:**
```
"I see. To access Archived Items, you need:
1. The latest version of the app (v2.1.0+)
2. A history of plan downgrade (which triggers archival)

What version do you see in Settings > About? And when did your plan last change?"
```

---

### Issue 2: User clicks Restore but nothing happens

**Diagnosis Steps:**
1. Are they still on Free plan? (Can restore on Free or Pro)
2. Did the page refresh after clicking? (Might need manual refresh)
3. Are the items actually archived? (Check `archivedByDowngrade` flag in backend)

**Solution:**
- Ask them to refresh the app: `Settings > Pull down to refresh` (mobile) or `Cmd+R` (desktop)
- If still not working, ask them to try again via web browser
- If recurring issue, escalate to engineering (could be race condition)

**Response:**
```
"Thanks for reporting. Let's troubleshoot:
1. Try refreshing the app (pull down on mobile, Cmd+R on desktop)
2. Go back to Settings > Archived Items
3. Click Restore again

If items still don't appear, it might be a sync issue. 
Can you try on a different device to see if it works there?"
```

---

### Issue 3: User upgraded but archived items didn't restore

**Diagnosis:**
1. Did they actually upgrade? (Check Clerk account confirmation)
2. Did the upgrade complete? (Any payment failures?)
3. How much time passed? (Give it 5 min for sync)

**Solution:**
- Confirm upgrade in their Clerk account
- Wait 5 min for sync
- Refresh app
- If still not restored: escalate to engineering (possible bug)

**Response:**
```
"Good question. When you upgrade, archived items should restore automatically 
within a few seconds. Let's verify:

1. Check your email—did you get an upgrade confirmation?
2. Go to Settings > Billing > Subscription—does it show 'Pro'?
3. Refresh the app (Cmd+R or pull down)
4. Wait 5 minutes and refresh again

If items still aren't restored after 5 minutes, let me know and I'll escalate 
to our engineering team."
```

---

### Issue 4: User reports data loss (items actually missing)

**This is an ESCALATION to Engineering**

**Diagnosis:**
```
Ask the user:
1. "What plan were you on before, and are you on now?"
2. "Approximately how many items are missing?"
3. "Do you see them in Settings > Archived Items?"
4. "When did you last see them?"
5. "Did you manually delete them, or did they disappear?"
```

**Escalation Template:**
```
Subject: URGENT - Potential Data Loss Report

User: [User ID / Email]
Issue: User reports [X items] missing
Plan Change: [Old Plan] → [New Plan]
Archived Items Visible: [Yes / No]
Time of Incident: [When they noticed]
Impact: [Data loss / Confusion / Other]

Reproduction Steps:
[Include user's exact steps]

Screenshots: [If available]

Next Steps: Need engineering investigation for possible:
- Archive operation failure
- UI display bug
- Database query issue
```

**Support Response to User:**
```
"Thank you for reporting this. Missing data is serious and we want to help immediately.

I'm escalating your case to our engineering team for investigation. 
They'll:
1. Check if your items are archived in our system
2. Verify the archive operation completed correctly
3. Restore any items we can recover
4. Identify what happened

You'll hear back from us within 2 hours.
We apologize for any inconvenience."
```

---

## Training Module 4: Communication Scripts (10 min)

### Script 1: Proactive Communication (Before Release)

**Email to Users:**
```
Subject: Ascendify Update: Better Data Protection

Hi there,

We're shipping a feature that makes your data safer. Here's what's changing:

📌 What You Need to Know:
- If your plan ever changes, we now preserve your items instead of deleting them
- Free plan allows 10 habits and 3 goals (unchanged)
- Pro plan allows unlimited (unchanged)
- You control what happens to archived items (restore with 1 click)

🎯 What This Means for You:
- No more surprise data loss during plan changes
- Your data is always backed up
- You have full control: restore items anytime

❓ Questions?
- New to Ascendify? See our [help docs](...)
- Confused about plans? Check [billing FAQ](...)
- Need help? Contact support@ascendify.com

Thanks for using Ascendify!
The Team
```

### Script 2: Reactive Communication (During Release)

**In-App Banner Text:**
```
You have 5 archived items from a plan downgrade.
Click here to restore them or learn more.
```

**Notification Email (Automated):**
```
Subject: Your Ascendify Plan Changed

Hi [User],

Your plan changed to [New Plan]. During plan changes, items beyond your new 
plan's limits are archived to keep them safe.

You have:
- 10 archived habits
- 2 archived goals

Restore them anytime in Settings > Archived Items, or upgrade to Pro to restore automatically.

Your data is safe. You're in control.

[Button: View Archived Items] [Button: Upgrade Plan]
```

### Script 3: Post-Support-Ticket Response (Issue Already Escalated)

**Email Template:**
```
Hi [User],

Thank you for contacting us about your archived items.

✅ Here's the good news: Your items are safe and recoverable.

📍 What Happened:
Your plan changed from Pro to Free. We automatically archived 10 habits and 2 goals 
that exceed the free tier limit (10 habits, 3 goals). This preserves your data 
instead of losing it.

🔧 How to Restore:
1. Go to Settings > Archived Items
2. Review the items you want to restore
3. Click "Restore" next to each item, or "Restore All"

⏱️ Time to Restore: Less than 1 second. Your items appear immediately.

💪 Going Forward:
- Archive items stay on your account forever
- Restore anytime, on any plan
- No charge for restoration

If you need any help or have questions, reply to this email.

Best,
[Support Team]
```

---

## Training Module 5: Escalation Criteria (5 min)

### When to Escalate to Engineering

**Do escalate if:**
- [ ] User reports items actually missing (not archived, not visible anywhere)
- [ ] Restore button crashes or throws error
- [ ] Archive operation fails (user saw error message)
- [ ] User upgraded but archived items didn't auto-restore after 5 min
- [ ] Same issue reported by multiple users (potential bug)
- [ ] Data inconsistency (item shows in one place, not in another)

**Do NOT escalate if:**
- [ ] User can't find Archived Items (point to Settings path)
- [ ] User confused about what "archived" means (explain with script above)
- [ ] User hasn't updated to v2.1.0 (ask them to update)
- [ ] User just downgraded and doesn't see banner yet (wait 5 sec, refresh)

**Escalation Template:**
```
To: billing-team@ascendify.dev
Cc: oncall-engineer@ascendify.dev

Subject: [ESCALATION] Billing v2.1.0 — [Issue Type]
Severity: [High / Critical / Low]

User: [User ID]
Issue: [Brief description]
Reproduction: [Steps to reproduce]
Expected: [What should happen]
Actual: [What's happening]
Screenshots: [If available]
Logs: [If available]

Needed ASAP because: [Why this is important]
```

---

## Testing Before Release

### Support Team Should Verify (30 min before launch)

**Test User 1: Free Plan**
- [ ] Create account
- [ ] Create 10 habits (all succeed)
- [ ] Try to create 11th habit (fails with limit error) ✓
- [ ] No yellow banner (no archived items)

**Test User 2: Pro → Free Downgrade (Simulated)**
```
Prerequisite: Access to test environment / admin panel

- [ ] Create account, set to Pro
- [ ] Create 15 habits + 5 goals
- [ ] Trigger downgrade (admin panel or webhook test)
- [ ] Verify yellow banner appears: "You have 5 archived items"
- [ ] Navigate to Settings > Archived Items
- [ ] See 5 habits + 2 goals listed as archived ✓
- [ ] Click "Restore All"
- [ ] Verify items reappear in active list ✓
```

**Test User 3: Free → Pro Upgrade (Simulated)**
```
Prerequisite: Test user with archived items from above

- [ ] Upgrade plan to Pro
- [ ] Refresh app
- [ ] Verify yellow banner disappears
- [ ] Verify all 15 habits + 5 goals appear in active list
- [ ] Verify Settings > Archived Items is empty ✓
```

**Test User 4: Webhook Edge Cases**
```
Prerequisite: Access to webhook testing tools (Svix, Clerk dashboard)

- [ ] Send valid webhook: succeeds (200 OK) ✓
- [ ] Send tampered signature: fails (403) ✓
- [ ] Send old timestamp: fails (400) ✓
- [ ] Check billingEvents table: all 3 logged ✓
```

**Verification Checklist:**
- [ ] All 4 test scenarios pass
- [ ] No console errors in browser
- [ ] No backend errors in logs
- [ ] App stays responsive during operations
- [ ] Ready to support users confidently

---

## Day-of-Release Readiness

**Support Team Checklist (1 hour before launch):**
- [ ] All team members read this guide
- [ ] Test users created and verified
- [ ] FAQ printed and posted (or shared in Slack)
- [ ] Escalation contacts verified (who to ping?) 
- [ ] Slack channel created and all team members added (#billing-v2.1-support)
- [ ] Time zone conversions posted (when is rollout for each region?)
- [ ] Staffing confirmed (extra coverage during rollout?)
- [ ] Training questions addressed (ask now, not during rollout)

**During Rollout (Live Monitoring):**
- [ ] Have this guide open in a tab
- [ ] Monitor support tickets for "archived" keyword
- [ ] Monitor Slack #billing-v2.1-support for alerts
- [ ] Be ready to copy-paste responses from above
- [ ] Escalate any data loss reports immediately
- [ ] Document all questions for post-rollout training review

---

## Post-Rollout Debrief (Next Day)

- [ ] Review all support tickets from release day
- [ ] Identify any patterns or gaps in this guide
- [ ] Update FAQ based on real user questions
- [ ] Congratulate team on smooth rollout!

