# Visual Migration Plan (v3) — "The Istanbul Student Atlas"

This document outlines the step-by-step engineering plan to transition the Campus Insider frontend from the current design to the new editorial version (v3) while keeping a zero-risk rollback path.

---

## Phase 1: Safeguards & Rollback Setup
Before editing any active layout components, we copy existing files to backup locations to ensure we can roll back immediately if issues occur.

1. **Backup Current Layout Components**:
   - Copy `frontend/src/app/page.tsx` to `frontend/src/app/page-v2-rollback.tsx.bak`
   - Copy `frontend/src/app/components/AssessmentWizard.tsx` to `frontend/src/app/components/AssessmentWizard-v2-rollback.tsx.bak`
   - Copy `frontend/src/app/components/ResultsDisplay.tsx` to `frontend/src/app/components/ResultsDisplay-v2-rollback.tsx.bak`
   - Copy `frontend/src/app/globals.css` to `frontend/src/app/globals-v2-rollback.css.bak`

2. **Verify Backup Branch Integrity**:
   - Create a git branch `rollback/v2-stable` pointing to the current commit `a84ac07`.

---

## Phase 2: Design Token & Core Global Styles (V3)
Rather than modifying the current layout immediately, we configure the new design system properties alongside the old ones to prevent styling conflicts.

1. **Update `globals.css` Tokens**:
   - Declare the new editorial HSL values:
     ```css
     :root {
       --v3-ink-navy: #152238;
       --v3-cobalt-blue: #3157D5;
       --v3-warm-sand: #F3EEE5;
       --v3-soft-white: #FCFBF8;
       --v3-terracotta: #D96C4A;
       --v3-sea-green: #168B83;
       --v3-muted-slate: #667085;
     }
     ```
   - Define typography classes for Sora, Manrope, and Source Serif 4.
   - Define asymmetric container wrappers `.v3-grid-container` and borderless dividers `.v3-divider`.

---

## Phase 3: Conversational Assessment Restructuring
Transition the wizard from the old card modal into a full-screen layout.

1. **Modify `AssessmentWizard.tsx` Wrapper**:
   - Remove overlay modal containers, backgrounds, and close buttons.
   - Expand the wrapper to fill the viewport (`w-screen h-screen min-h-screen bg-warm-sand`).
2. **Standardize Options Lists**:
   - Align option items vertically as wide horizontal rows.
3. **Verify Functionality**:
   - Keep keyboard numerical shortcuts (`1`-`4`), session variables, and Turnstile integrations identical.

---

## Phase 4: Ranked Results Blueprint
Transition the results display to the Ranked Atlas layout.

1. **Modify `ResultsDisplay.tsx` Grid**:
   - Remove the 3-column equal grid container.
   - Render `results[0]` inside the dominant `Best Overall Match` card layout.
   - Map remaining results (`results.slice(1)`) into secondary row components.
2. **Configure Price Table Structure**:
   - Refactor grid items to print-style clean data tables.

---

## Phase 5: Homepage Visual Redesign
Update the main landing page sections.

1. **Rewrite `page.tsx`**:
   - Update layouts for Hero, Traps, story quotes, trust rows, and stats.
   - Ensure the database synchronizer badge updates dynamically from `http://localhost:8000/api/sync/status`.

---

## Phase 6: Compilation & Smoke Verification
1. **Compilation Check**:
   - Run `npm run build` in the frontend to verify TypeScript and lint parameters.
2. **Local Smoke Audits**:
   - Complete E2E verification test using the Turnstile test sitekey.
   - Verify correct layout wrapping down to `360px` mobile devices.
