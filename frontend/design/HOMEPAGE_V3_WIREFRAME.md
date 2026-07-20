# Homepage Redesign Specification (v3) — "The Istanbul Student Atlas"

This document outlines the layout, visual structure, and responsive behaviors for the 10 homepage sections under the new design system.

---

## 1. Minimal Editorial Header
* **Purpose**: Establish clean, magazine-like wayfinding.
* **Layout**: Left-aligned Atlas compass logo (🧭) in Ink Navy; right-aligned text block showing the synchronizer status (`DATABASE LIVE // SYNCS EVERY 24H`) and live pulse dot.
* **Colors**: Soft White (`#FCFBF8`) background, Ink Navy (`#152238`) text.
* **Desktop**: 12-column layout. Height `80px`. Left and right padding `64px`.
* **Mobile**: Flex row space-between; status text drops to small micro-caps (`10px`).
* **Motion**: None. Instant load for stability.
* **Component Structure**: `<Header />` containing logo and static status bar.
* **Acceptance Criteria**: Sync timestamp updates dynamically from the backend status API.

---

## 2. Asymmetrical Hero with Real Photography
* **Purpose**: Capture immediate student attention and project authenticity.
* **Layout**: 
  * Left side (7 columns): Over-sized Manrope heading (`80px`) with the slogan *"Avoid Costly Mistakes Studying in Turkey"* and a single, sharp Cobalt Blue call-to-action button: `Start My Free Assessment`.
  * Right side (5 columns): Asymmetrical vertical column containing a high-contrast black-and-white photograph of students at a Kadıköy café, offset by geographic coordinates overlay text (`41° 00' 49" N, 28° 57' 18" E`).
* **Typography**: Heading: `80px` Manrope (bold, line-height 1.1); Body: `18px` Inter; Coordinates: `12px` Monospace.
* **Colors**: Warm Sand (`#F3EEE5`) background, Ink Navy (`#152238`) text.
* **Desktop**: Offset right photo box pushed slightly higher than the text column.
* **Mobile**: Vertical stacking. Image moves above the title; heading scale drops to `44px`.
* **Motion**: Fade-in-up (`400ms` cubic-bezier) for text element elements.
* **Acceptance Criteria**: Button correctly triggers full-screen assessment view.

---

## 3. Editorial “Three Traps” Section
* **Purpose**: Explain the complexity of university choices in Turkey.
* **Layout**: Three asymmetrical horizontal rows. Each row contains a massive numbers column (`120px` Source Serif 4 in Muted Slate) followed by a 2-column details block (Title + Paragraph).
* **Typography**: Numbers: `120px` Source Serif 4; Row Title: `24px` Sora; Row Body: `16px` Inter.
* **Colors**: Soft White (`#FCFBF8`) background, Ink Navy (`#152238`) text.
* **Desktop**: Three stacked horizontal bands separated by `1px` lines.
* **Mobile**: Numbers scale down to `80px` and stack vertically above text.
* **Motion**: Scroll reveal fade-in.
* **Component Structure**: `<TrapsList />` rendering `<TrapRow />` loops.
* **Acceptance Criteria**: Focus items must remain screen-reader accessible via natural tab order.

---

## 4. Magazine-Style Abdullah Story
* **Purpose**: Establish personal, human credibility ("older brother" tone).
* **Layout**: Left column (5 columns): Portrait photograph of Abdullah at Boğaziçi campus; Right column (7 columns): Large Source Serif 4 quotation block describing his journey, followed by a signed signature line.
* **Typography**: Quote: `24px` Source Serif 4 (italic); Body: `16px` Inter.
* **Colors**: Warm Sand (`#F3EEE5`) background, Ink Navy (`#152238`) text.
* **Desktop**: Offset portrait overlaps the horizontal section border line.
* **Mobile**: Stacks text first, followed by the photograph centered at the bottom.
* **Acceptance Criteria**: Image contains semantic alt tags describing the scene.

---

## 5. Dark Product-Preview Section
* **Purpose**: Show the assessment results layout early to build confidence.
* **Layout**: Full-width Ink Navy banner containing a centered, high-contrast, borderless mockup of the recommendation table (tuition price lists and matches) highlighted in Cobalt Blue.
* **Typography**: Headings: `40px` Sora; Data: `14px` Inter.
* **Colors**: Ink Navy (`#152238`) background, Soft White (`#FCFBF8`) text.
* **Desktop**: Asymmetrical mock columns displaying cash vs installment options.
* **Mobile**: Mockup collapses to a single-column card mockup.
* **Acceptance Criteria**: Table data matches the format of active search results.

---

## 6. Recommendation Process Timeline
* **Purpose**: Walk the user through the waypoints from starting assessment to admissions.
* **Layout**: Four horizontal waypoint steps linked by a single solid Ink Navy line. Each waypoint is a sharp square node with coordinates.
* **Typography**: Step Title: `18px` Sora; Description: `14px` Inter.
* **Colors**: Warm Sand (`#F3EEE5`) background, Ink Navy (`#152238`) text.
* **Desktop**: Horizontal 4-step row.
* **Mobile**: Vertical timeline. Solid line runs vertically down the left edge.
* **Motion**: Hover states lift nodes slightly with a Cobalt Blue accent border.

---

## 7. Trust Principles Block
* **Purpose**: Highlight independent verification (no affiliate fees, verified database).
* **Layout**: Two alternating, wide rows. 
  * Row 1: Left: Principle Title & explanation; Right: High-contrast close-up photo of admissions database sync log screen.
  * Row 2: Left: Photo of student checking tuition table; Right: Principle Title explaining "Free student assessment".
* **Typography**: Title: `36px` Sora; Body: `16px` Inter.
* **Colors**: Soft White (`#FCFBF8`) background, Ink Navy (`#152238`) text.
* **Desktop**: Alternating columns.
* **Mobile**: Standard vertical stack. Images always display above text blocks.

---

## 8. Database Coverage Statistics
* **Purpose**: Demonstrate data authority.
* **Layout**: A single dominant statistic layout. The screen is filled with a massive counter (`160px` Manrope) showing `7,695` followed by a large label: `Verified programs across 39 Turkish Universities`.
* **Typography**: Stats: `160px` Manrope (bold); Description: `24px` Sora.
* **Colors**: Warm Sand (`#F3EEE5`) background, Ink Navy (`#152238`) text.
* **Desktop**: Centered dominant block.
* **Mobile**: Stat text scales down to fit on mobile viewports (`80px`).
* **Motion**: Gentle pulse outline animation.

---

## 9. Full-Width FAQ Accordion
* **Purpose**: Clear doubts regarding visas, language tests, and prep schools.
* **Layout**: A stacked vertical list of editorial FAQ headers. Clicking a header expands a slide-down paragraph in Source Serif 4. No container boxes; separated by horizontal `1.5px` lines.
* **Typography**: Question: `22px` Sora; Answer: `16px` Source Serif 4.
* **Colors**: Soft White (`#FCFBF8`) background, Ink Navy (`#152238`) text.
* **Desktop**: 12-column list.
* **Mobile**: Standard accordion width scaling.
* **Motion**: Smooth max-height transitions on toggle.
* **Acceptance Criteria**: Accordion headers use keyboard-accessible buttons (`aria-expanded`).

---

## 10. Strong Final CTA Color Block
* **Purpose**: Prompt the final user conversion.
* **Layout**: A full-width editorial block in Cobalt Blue (`#3157D5`) with large white text, a subhead, and a centered Soft White CTA button: `Start My Assessment`.
* **Typography**: Title: `56px` Sora (bold); Button: `18px` Manrope (bold).
* **Colors**: Cobalt Blue (`#3157D5`) background, Soft White (`#FCFBF8`) text and buttons.
* **Desktop**: Centered text layout with thick offset shadows on the primary button.
* **Mobile**: Heading scale down to `36px`; button spans full width.
