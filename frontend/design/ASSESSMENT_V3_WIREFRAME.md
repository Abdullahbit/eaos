# Assessment Redesign Specification (v3) — "The Focused Interview"

A full-screen, high-contrast, distraction-free conversational interview interface replacing the small centered card modal.

---

## 1. Core Visual Layout
Instead of popup dialog overlays, clicking the assessment CTA transitions the entire viewport into a clean, magazine-like canvas.

```
+-------------------------------------------------------------+
| [🧭 CAMPUS INSIDER]               STEP 03 OF 06 // MAJOR     |
+-------------------------------------------------------------+
|                                                             |
|   👨‍💻 Abdullah                                               |
|   "What study major are we focusing on in Istanbul?"        |
|                                                             |
|   [ Input Field: e.g. Computer Engineering             ]    |
|   * Press Enter to submit                                   |
|                                                             |
|                                                             |
|   [← Go Back]                               [Continue →]   |
+-------------------------------------------------------------+
```

* **Header (Top)**: Left-aligned minimalist brand logo; right-aligned waypoint counter (`STEP 02 OF 06 // INTENDED LEVEL`) using tracking micro-caps.
* **Dialogue Area (Center)**: Abdullah avatar (`👨‍💻` inside an asymmetric warm frame) asking the step question in large Source Serif 4 text (`28px`).
* **Input Area (Below Dialogue)**:
  * For input fields: Single large text input (`32px` font size) with a thick `2px` horizontal border in Cobalt Blue.
  * For options lists: Stacked rows (width: `100%`) with clear left numbers (`1`, `2`, `3`) mapped to options.
* **Control Footer (Bottom)**: Left-aligned `← Go Back` control; right-aligned `Continue →` button.

---

## 2. Colors & Typography
* **Canvas Background**: Warm Sand (`#F3EEE5`).
* **Interactive Elements**: Ink Navy (`#152238`) and Cobalt Blue (`#3157D5`).
* **Dialogue Font**: `28px` Source Serif 4 (regular, line-height 1.4).
* **Option Row Font**: `18px` Inter (medium).
* **Step Counters**: `12px` Monospace.

---

## 3. Options Row Design
Options are large, horizontal bars with clear numbering indicators:

```
+---------------------------------------------------------+
|  [ 1 ]  Associate Degree                                |
+---------------------------------------------------------+
|  [ 2 ]  Bachelor's Degree                               |
+---------------------------------------------------------+
|  [ 3 ]  Master's Degree                                 |
+---------------------------------------------------------+
```

* **Hover State**: Cobalt Blue border highlight, background shifts slightly to Soft White.
* **Keyboard Triggers**: Pressing keys `1`, `2`, `3`, `4` maps to options directly, triggering instant transition to the next step.

---

## 4. Mobile Layout
* **Top Header**: Logo and step counter stack vertically to preserve width.
* **Font Sizes**: Dialogue drops to `22px`; option rows to `16px`.
* **Footer Controls**: Stacks vertically at the bottom to remain thumb-accessible.

---

## 5. Script & State Preservations
* **Transitions**: Horizontal slide-out to the left when moving forward; slide-in from the right when clicking back (`400ms` cubic-bezier).
* **Session Restoration**: State variables synchronize with `sessionStorage` on every field change.
* **Error States**: Displayed as a clear Terracotta (`#D96C4A`) message block directly below the active input field.
