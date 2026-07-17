# Campus Insider Assessment Experience Design Spec

The assessment wizard should feel like a **guided conversation** with Abdullah, not an online school test. The interface remains quiet, clean, and interactive.

---

## 1. Step-by-Step Conversation Flow (ASCII Layout)

```text
+---------------------------------------------------------------------------------+
|  Step 3 of 6: Major Intended                                  [Close Assessment] |
|  [||||||||||||||||||||||                    ] (Progress Bar: 50% Complete)      |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  "What subject do you want to study in Turkey?"                                 |
|  - Abdullah                                                                     |
|                                                                                 |
|  [ Computer Engineering                     ] (Input field with soft focus)     |
|                                                                                 |
|  * Tip: If you are not sure, type a broad field like "Business" or "Engineering"  |
|                                                                                 |
+---------------------------------------------------------------------------------+
|  [ Back ]                                                   [ Next Question → ] |
+---------------------------------------------------------------------------------+
```

---

## 2. Interaction Design Specs

### Micro-Interactions
* **Selection Option Hover**: Option cards (e.g. choosing study level "Bachelor") do not change background color immediately. They lift upwards by `2px` with a subtle increase in border contrast from `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.25)`.
* **Selection Trigger (Click)**: Upon clicking an option, a soft success checkmark icon fades into the card corner, followed by a `300ms` auto-advance transition to the next step.
* **Text Fields**: When typing the intended major, the text field grows in scale by `1.01` and borders shift to Indigo.

---

## 3. Step Transitions & Navigation
* **Directional Animation**:
  * **Moving Forward**: The current step fades out and slides to the left by `20px`, while the next step slides in from the right by `20px` and fades in.
  * **Moving Backward**: The current step slides out to the right by `20px`, and the previous step slides back in from the left.
* **Keyboard Shortcut Support**:
  * Options list mapped to numbers (`1`, `2`, `3`). Clicking `1` selects the first choice.
  * Pressing `Enter` automatically advances on text-input steps.
  * Pressing `Esc` triggers a clean cancel prompt.

---

## 4. Progress Indicators
* **Context Preservation**: The top status indicator displays `Step X of Y` alongside a visual timeline tracker.
* **The Navigation Timeline**: A thin, horizontal progress track. Completed steps are filled with Indigo, active is marked with a pulsing Gold dot, and incomplete steps remain in Slate.

---

## 5. Loading, Validation & Errors
* **The Loading State**: When submitting lead contact details, the modal screen dims by 20%, elements blur slightly, and a clean, centered loading animation appears:
  * *“Curating your options, checking tuition limits...”* (with a smooth circular spinner).
* **Validation Messaging**:
  * Validation checks are inline and run on input blur.
  * If a phone number is entered without country prefix: the input box border glows soft yellow, showing advice: *“Please include your country prefix (e.g., +90).”*
* **Double-Submit Guard**: The CTA button transforms into a disabled lock state, ignoring repeated clicks while backend database queries execute.
