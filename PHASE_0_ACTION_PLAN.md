# PHASE 0 - POLISH & FOUNDATION - DETAILED ACTION PLAN

## Overview
Phase 0 must be completed BEFORE launching. These changes affect every page and user interaction.

**Total Time**: ~6 hours  
**Blockers**: None  
**Priority**: 🔴 CRITICAL

---

## ACTION 0.1: CUSTOM CURSOR IMPLEMENTATION (1 hour)

### Step 0.1.1 - Create SVG Cursor File
**File**: `public/icons/cursor.svg`  
**Content**: Pixelated 12×19px NW-pointing arrow, orange tip

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 19" width="12" height="19">
  <path d="M0,0 L0,16 L3,13 L6,19 L7,18 L3,11 L9,11 Z" fill="#F97316" stroke="#EA580C" stroke-width="0.5"/>
</svg>
```

### Step 0.1.2 - Create CursorWrapper Component
**File**: `src/components/CursorWrapper.tsx`

```tsx
'use client';
import { useEffect } from 'react';

export function CursorWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, []);
  return <>{children}</>;
}
```

### Step 0.1.3 - Apply Global CSS
**File**: `src/app/globals.css` (or `src/app/(dashboard)/layout.tsx` <style> block)

```css
body.custom-cursor-active {
  cursor: url('/icons/cursor.svg') 0 0, auto;
}

/* Ensure native cursor on specific elements */
button.custom-cursor-active,
a.custom-cursor-active,
input.custom-cursor-active {
  cursor: url('/icons/cursor.svg') 0 0, auto;
}

/* Text selection cursor stays native (browser handles) */
textarea.custom-cursor-active,
input[type="text"].custom-cursor-active {
  cursor: url('/icons/cursor.svg') 0 0, auto !important;
}
```

### Step 0.1.4 - Wrap RootLayout
**File**: `src/app/layout.tsx`

Wrap the children with `<CursorWrapper>`:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CursorWrapper>
          {children}
        </CursorWrapper>
      </body>
    </html>
  );
}
```

### Verification
- [ ] Open http://localhost:3000
- [ ] Cursor appears as orange pixel arrow
- [ ] Click links, drag elements, right-click menu — all work natively
- [ ] Text selection works normally

---

## ACTION 0.2: LOGO CONSISTENCY (1 hour)

### Files to Audit & Fix

**Search codebase for each and replace with `<Logo />` or `<LogoMark />`**:

```
grep -r "RESURGO" src/app --include="*.tsx" --include="*.ts"
grep -r "<h1>Resurgo</h1>" src --include="*.tsx"
grep -r "Resurgo" src/components/Logo.tsx -A 5 -B 5
```

### Specific Replacements

1. **`src/app/layout.tsx`** (Root Layout)
   - Find: Any hardcoded "RESURGO" text in header
   - Replace with: `<Logo />`

2. **`src/app/(dashboard)/layout.tsx`** (Sidebar Logo)
   - Find: `<h1>Resurgo</h1>` or raw text span
   - Replace with: `<LogoMark />`

3. **`src/app/(marketing)/layout.tsx`** (Marketing Header)
   - Find: Logo rendering code
   - Replace with: `<Logo />`

4. **`src/app/(onboarding)/layout.tsx`** (Onboarding)
   - Find: Any logo variant
   - Replace with: `<LogoMark />`

5. **Landing Page** (`src/app/(marketing)/page.tsx`)
   - Find: Logo code
   - Replace with: `<Logo />`

6. **Pricing Page** (`src/app/(marketing)/pricing/page.tsx`)
   - Find: Logo code
   - Replace with: `<Logo />`

### Verification
- [ ] `grep -r "RESURGO" src` shows NO raw text (only in comments)
- [ ] All pages render consistent logo
- [ ] Logo size/spacing matches across pages
- [ ] Mobile view shows correct logo

---

## ACTION 0.3: ACCESSIBILITY AUDIT & CONTRAST FIX (3 hours)

### Files Requiring Fixes (10 Total)

| # | File | Contrast Issues |
|---|---|---|
| 1 | `src/app/(marketing)/page.tsx` | Hero, features section subtitle |
| 2 | `src/app/(onboarding)/page.tsx` | Labels, hints |
| 3 | `src/app/(dashboard)/settings/page.tsx` | Form labels, section text |
| 4 | `src/app/(dashboard)/goals/page.tsx` | Empty state text, secondary labels |
| 5 | `src/app/(dashboard)/tasks/page.tsx` | Task descriptions, timestamps |
| 6 | `src/app/(dashboard)/habits/page.tsx` | Habit descriptions, streak text |
| 7 | `src/app/(dashboard)/wellness/page.tsx` | Tab labels, form hints |
| 8 | `src/app/(dashboard)/analytics/page.tsx` | Chart labels, legend text |
| 9 | `src/app/(marketing)/pricing/page.tsx` | Plan descriptions, fine print |
| 10 | `src/app/(dashboard)/layout.tsx` | Sidebar text, secondary nav |

### Step 0.3.1 - Run Audit Tool (Chrome DevTools)
For each file:
1. Open in browser: `http://localhost:3000/<page>`
2. Press F12 → Lighthouse tab
3. Run accessibility audit
4. Note all "Low contrast" warnings

### Step 0.3.2 - Apply Contrast Rules

**Rule Set**:

```typescript
// OLD → NEW MAPPING
{
  'text-zinc-700': false,  // BANNED (fails at 2.8:1)
  'text-zinc-600': 'text-zinc-400',  // (3.5:1 → 5.2:1)
  'text-zinc-500': 'text-zinc-500',  // (4.1:1) allowed for hints only
}
```

**Examples**:

Bad (fails WCAG AA):
```tsx
<p className="text-zinc-700">This is hard to read</p>
```

Good (passes WCAG AA):
```tsx
<p className="text-zinc-400">This is easy to read</p>
```

### Step 0.3.3 - Master Find & Replace

Use `multi_replace_string_in_file` for all 10 files in parallel:

For each file:
1. Replace `text-zinc-700` → (remove, use default/zinc-300)
2. Replace `text-zinc-600` → `text-zinc-400` (secondary text)
3. Verify buttons have 4.5:1 minimum contrast

### Step 0.3.4 - Re-Audit
- [ ] Run Lighthouse on all 10 pages again
- [ ] All show 90+ accessibility score
- [ ] WCAG AA requirements met for all text
- [ ] No "Low contrast" warnings

### Verification Checklist
```
Page A: Lighthouse 95+ ✓
Page B: Lighthouse 95+ ✓
Page C: Lighthouse 95+ ✓
Page D: Lighthouse 95+ ✓
Page E: Lighthouse 95+ ✓
Page F: Lighthouse 95+ ✓
Page G: Lighthouse 95+ ✓
Page H: Lighthouse 95+ ✓
Page I: Lighthouse 95+ ✓
Page J: Lighthouse 95+ ✓
```

---

## ACTION 0.4: ONBOARDING UX FIXES (1 hour)

### Fix 0.4.1 - Empty Goals State
**File**: `src/app/(onboarding)/page.tsx` (or wherever goals are set)

**Current**:
```tsx
{!goals.length && (
  <>
    <button disabled className="...">Create First Goal</button>
    <a href="...">Skip for now</a>
  </>
)}
```

**New**:
```tsx
{!goals.length && (
  <>
    <button disabled className="...">Create First Goal</button>
    {/* Remove "Skip for now" button */}
    {/* Add softer link below in smaller text */}
    <a href="/dashboard" className="text-zinc-600 hover:text-zinc-400 text-xs font-mono mt-4">
      I'll set this later →
    </a>
  </>
)}
```

### Fix 0.4.2 - Focus Area Selection Counter
**File**: `src/app/(onboarding)/page.tsx` (focus area step)

**New Code**:
```tsx
const selectedCount = focusAreas.filter(fa => fa.selected).length;
const maxAllowed = 3;

<div className="mb-3 flex items-center justify-between">
  <h2 className="font-mono text-sm font-bold">Select Your Focus Areas</h2>
  <span className="border border-orange-900 bg-orange-950/30 px-2 py-1 font-mono text-xs text-orange-400">
    {selectedCount}/{maxAllowed}
  </span>
</div>

{focusAreas.map(area => (
  <button 
    key={area.id}
    disabled={!area.selected && selectedCount >= maxAllowed}
    onClick={() => {
      if (!area.selected && selectedCount >= maxAllowed) {
        // Show toast
        toast.info(`Only ${maxAllowed} areas allowed. Deselect one to choose another.`);
        return;
      }
      toggleFocusArea(area.id);
    }}
  >
    {area.label}
  </button>
))}
```

### Fix 0.4.3 - Loading State Suspense
**File**: `src/app/(onboarding)/layout.tsx`

**New Code**:
```tsx
import { Suspense } from 'react';

function OnboardingLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-zinc-950 border border-zinc-900 p-8">
        <div className="flex items-center gap-2 font-mono text-xs text-orange-500">
          <span className="h-2 w-2 animate-pulse bg-orange-500 rounded-full" />
          INITIALIZING...
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<OnboardingLoadingSpinner />}>
      {children}
    </Suspense>
  );
}
```

### Fix 0.4.4 - Dashboard Headers
**Replace These Headers**:

```typescript
{
  'OBJECTIVES_MATRIX': 'Goals',
  'BEHAVIORAL_NODES': 'Habits',
  'TASK_QUEUE': 'Tasks',
  'DEEP_WORK_PROTOCOL': 'Focus Mode',
  'PERFORMANCE_MATRIX': 'Analytics',
  'TEMPORAL_GRID': 'Schedule',
  'WELLNESS_SUITE': 'Wellness',
  'FINANCIAL_COMMAND': 'Budget',
}
```

Find each old header text and replace with plain English.

### Verification
- [ ] Create new test account
- [ ] Onboarding loads without black screen (Suspense working)
- [ ] Empty goals shows "I'll set later →" link only
- [ ] Focus area selection shows "2/3" counter
- [ ] Selecting 4th focus area shows toast
- [ ] All dashboard pages show plain English headers

---

## FINAL VERIFICATION CHECKLIST FOR PHASE 0

```
✓ Cursor
  ✓ SVG file created at public/icons/cursor.svg
  ✓ CSS applied to body.custom-cursor-active
  ✓ CursorWrapper component created and used in RootLayout
  ✓ Cursor visible and functional (text select, drag, links work)

✓ Logo
  ✓ All raw "RESURGO" text replaced with <Logo /> component
  ✓ All <h1>Resurgo</h1> replaced with <LogoMark />
  ✓ Logo consistent across 6+ pages
  ✓ Mobile view renders correctly

✓ Accessibility
  ✓ Lighthouse 95+ on all 10 flagged pages
  ✓ No "text-zinc-700" in body copy
  ✓ All secondary text is zinc-400 or higher
  ✓ Button contrast 4.5:1 minimum
  ✓ WCAG AA pass on Accessibility audit

✓ Onboarding
  ✓ No black screen on initial load (Suspense working)
  ✓ Empty goals state shows soft "I'll set later" link
  ✓ Focus area selection shows counter badge
  ✓ Selecting 4+ areas shows toast warning
  ✓ Dashboard headers all in plain English

✓ TypeScript
  ✓ npx tsc --noEmit returns 0 errors
  ✓ No new TypeScript errors introduced

✓ Build
  ✓ npx next build completes without errors
  ✓ Production build ready
```

---

## TIMELINE

- **Start**: Now
- **Cursor**: +1 hour
- **Logo**: +1 hour → 2h total
- **Accessibility**: +3 hours → 5h total
- **Onboarding**: +1 hour → 6h total
- **Testing & Verification**: Included in each section
- **Done**: 6 hours from start

**Next: Phase 1 (Telegram Bot) - 8 hours**

---

## SUCCESS CRITERIA

Phase 0 is complete when:
1. Custom cursor visible and fully functional
2. Logo consistent on all pages
3. All pages pass Lighthouse 95+ accessibility
4. New users can onboard without friction
5. Zero new TypeScript errors
6. No regressions in existing functionality

**Status**: Ready to execute immediately ✅
