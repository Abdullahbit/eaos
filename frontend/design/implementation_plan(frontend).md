# Implementation Plan - Visual System and Copy Redesign

This plan outlines the changes required to implement the approved **Design System v2** and **Homepage Wireframe v2** specifications in the Next.js frontend.

---

## Proposed Changes

### 1. Style Foundations
#### [MODIFY] [globals.css](file:///d:/Projects/eaos/eaos/frontend/src/app/globals.css)
- Implement color variables for Light Paper background (`hsl(40, 20%, 97%)`) and Dark Slate (`hsl(220, 25%, 9%)`).
- Setup Google Fonts imports for Outfit, Inter, and Playfair Display.
- Define styles for the dotted Route Line (`.route-line`), typographic Coordinates detail class, and tactile inputs (underline transition focus, required field asterisks).
- Implement responsive media queries for the 12-column grid and asymmetric container limits.

### 2. Homepage Content & Structure
#### [MODIFY] [page.tsx](file:///d:/Projects/eaos/eaos/frontend/src/app/page.tsx)
- Re-layout the page structure to match the approved wireframe narrative order:
  - **Section 1: Hero & Primary Problem Match** (Headline: *"Find Turkish university options..."*, Subheading, Disclaimer notice, CTAs).
  - **Section 2: The Problem** (Three Trap points: Hidden Cost, Commission, and Fake Rankings).
  - **Section 3: Abdullah’s Narrative** (Concise letter, cursive signature quote).
  - **Section 4: Product Preview** (Visual mockups of the wizard and recommendation card side-by-side).
  - **Section 5: Process Waypoints** (Horizontal pathway timeline).
  - **Section 6: Why Trust Campus Insider** (Guarantees & Values: Verified data, Transparent costs, Free assessment, No sales pressure).
  - **Section 7: Database Coverage** (39 universities, 7,695 programs, Associate to PhD, English/Turkish, Multi-city).
  - **Section 8: FAQ** (Interactive accordion toggles).
  - **Section 9: Final Waypoint CTA** (Action block triggering the wizard).
- Integrate backend fetch to update the sync status badge dynamically on mount.

### 3. Assessment Conversation Flow
#### [MODIFY] [AssessmentWizard.tsx](file:///d:/Projects/eaos/eaos/frontend/src/app/components/AssessmentWizard.tsx)
- Restructure step views into "Waypoints" conversation frames (e.g. Abdullah's avatars asking questions in a friendly voice).
- Implement the step transition animation (slide out to left on forward, slide out to right on backward).
- Add the dotted horizontal progress track displaying step numbers.
- Add keyboard shortcuts (`1`, `2`, `3` keys select options, `Enter` advances).
- Render custom inputs for budget and degree level.

### 4. Recommendation Cards & WhatsApp Direct Link
#### [MODIFY] [ResultsDisplay.tsx](file:///d:/Projects/eaos/eaos/frontend/src/app/components/ResultsDisplay.tsx)
- Redesign result cards into "Study Blueprints" displaying:
  - The teal highlighted **Rationale List** ("Why This Matches").
  - Cost breakdowns in clean tabular structure (Cash tuition, installment plans, separate prep school fees).
  - Green outline `Ask Abdullah on WhatsApp` CTA carrying prefilled templates.
- Update Zero-Match UI to render Abdullah's friendly manual lookup letter.

---

## Verification Plan

### Automated Tests
- Run `.venv\Scripts\pytest` to verify backend routes are not affected by style/route additions.

### Manual Verification
- Open Next.js server locally and inspect:
  - Responsive column stacking on mobile (stacking stats below story).
  - Toggle states in FAQs.
  - Form validation indicators.
  - WhatsApp prefilled parameters.
