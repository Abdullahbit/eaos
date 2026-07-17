# Campus Insider Homepage Wireframe Spec (v2.0)

This document outlines the visual structure, layout rhythm, and content hierarchy for the **Campus Insider** homepage, designed around the *Wayfinding & Journey* visual metaphor.

---

## 1. Conversion User Journey Map
Every section on the homepage is designed to progress the visitor’s trust and reduce their uncertainty:

```text
  [Visitor Lands] 
         ↓
  [Understands the Problem]  <-- Hero / The Chaos of Admissions
         ↓
  [Trusts Campus Insider]   <-- Abdullah's Story / Trust Guarantees
         ↓
  [Sees the Product]        <-- Assessment & Recommendation Preview
         ↓
  [Understands the Process]  <-- Interactive Waypoint Diagram
         ↓
  [Starts the Assessment]   <-- Actionable Final CTA
```

---

## 2. Global Page Layout & Route Map (ASCII Overview)

```text
+---------------------------------------------------------------------------------+
|  [Logo] Campus Insider                                      [Updated: 11:21 AM] |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  SECTION 1: HERO (Find Turkish university options that actually fit you)       |
|  [Start My Free Assessment]             [How Recommendations Work]              |
|                                                                                 |
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|  (Route Line Begins)                                                            |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 2: THE PROBLEM (Three traps international students fall into)    |
|  |                                                                              |
|  |    1. Hidden Fees      2. Fake Rankings     3. Commission-driven Agents      |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 3: ABDULLAH'S NARRATIVE (Concise Student Story Letter)            |
|  |                                                                              |
|  |    "I got burned by sales agencies when I arrived. Let me help you avoid    |
|  |     the same mistakes."                                                      |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 4: SHOWING THE PRODUCT (Dynamic Previews)                         |
|  |                                                                              |
|  |    +--------------------------------+  +----------------------------------+  |
|  |    |  Preview: Assessment Step      |  |  Preview: Recommendation Card    |  |
|  |    |  "What is your max budget?"    |  |  "Why this matches your answers" |  |
|  |    +--------------------------------+  +----------------------------------+  |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 5: THE RECOMMENDATION WAYPOINTS (Process Flow)                    |
|  |                                                                              |
|  |    [Your Answers] -> [Assessment] -> [Program Matching] -> [Recommendations] |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 6: WHY TRUST CAMPUS INSIDER (Guarantees & Values)                 |
|  |                                                                              |
|  |    - Verified Admissions Data        - Transparent Tuition Costings          |
|  |    - Free Assessment Service         - Zero Affiliated Sales Pressure        |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 7: DATABASE COVERAGE (Generic Metrics)                            |
|  |                                                                              |
|  |    * 39 Universities  * 7,695 Programs  * Multi-Degree  * Multi-City         |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 8: FAQ & ANSWERS (Addressing Doubts)                             |
|  |                                                                              |
|  |    - How is our database updated?   - Are final admissions guaranteed?       |
|  |                                                                              |
|  *                                                                              |
|  |                                                                              |
|  +--- SECTION 9: FINAL WAYPOINT (Action CTA)                                    |
|  |                                                                              |
|  |    [ Start My Free Assessment Now ]                                          |
|                                                                                 |
+---------------------------------------------------------------------------------+
|  * Disclaimer: Results are preliminary. Final tuition and admission confirmed.  |
|  (C) 2026 Campus Insider. Built for students.                    Privacy Policy |
+---------------------------------------------------------------------------------+
```

---

## 3. Detailed Section Specifications

### Section 1: Hero & Entrance (Waypoint 0)
* **Purpose**: Capture interest immediately, frame the core problem, and invite action.
* **Emotion**: Relieved, Curious.
* **Layout**: Centered, spacious typography. A thin dotted route line begins at the bottom of the CTAs and guides the user downward.
* **Content**:
  * **Headline**: "Find Turkish university options that actually fit you."
  * **Subheading**: "Compare current programs and tuition fees based on your budget, preferred language and study level."
  * **CTAs**:
    * Primary: `Start My Free Assessment` (Solid Indigo pill button)
    * Secondary: `How Recommendations Work` (Typewriter/thin border button)
  * **Disclaimer Alert**: *"Results are preliminary. Final tuition, availability and admission decisions are confirmed before application."*

---

### Section 2: The Problem (Three Trap Points)
* **Purpose**: Validate the student's anxiety by explicitly highlighting the pitfalls of standard agency admissions.
* **Emotion**: Understood, Alert.
* **Layout**: Three asymmetrical columns aligned vertically along the dotted route line.
* **Content**:
  * **Trap 1: The Hidden Cost Trap**: Universities or agencies marketing only the first-year discount while hiding the high costs of subsequent years or prep school tuition.
  * **Trap 2: The Commission Trap**: Traditional agencies directing students to universities where they receive the highest commission, regardless of fit.
  * **Trap 3: The Fake Ranking Trap**: Fake or outdated ranking lists published to inflate the reputation of low-tier programs.

---

### Section 3: Abdullah’s Narrative (Human Connection)
* **Purpose**: Share the personal motivation behind the platform.
* **Emotion**: Reassured, Trusting.
* **Layout**: Two-column layout: Left column features Abdullah’s profile badge and a brief personal narrative; right column is open, letting the page breathe.
* **Content**:
  * **Summary**: Abdullah details how he made costly mistakes when arriving in Turkey due to commission-driven agencies, motivating him to index verified admissions data.
  * **Core Quote**: *“I'm not here to convince you to study in Turkey. I'm here to give you honest, current data so you can decide if it's the right choice for you.”*

---

### Section 4: Showing the Product (Early Visual Previews)
* **Purpose**: Demonstrate immediate value by previewing the tool's output.
* **Emotion**: Optimistic, Eager.
* **Layout**: Two side-by-side glass cards with translucent backdrops (`backdrop-filter: blur(20px)`).
* **Left Card (Wizard Preview)**:
  * Shows a mock question layout: *"Waypoint 3: What is your maximum annual budget?"*
  * Displays visual choice pills: `[$2,000/yr]`, `[$4,000/yr]`, `[$6,000/yr]`.
* **Right Card (Recommendation Preview)**:
  * Shows a mock matched program: *"Computer Engineering at Bahçeşehir University ($4,500/yr)"*.
  * Displays matching parameters: `✓ Fits $5k budget`, `✓ English instruction`.

---

### Section 5: The Recommendation Waypoints (Visual Flow)
* **Purpose**: Explain the matching process clearly, showing that recommendations are data-driven rather than sales-driven.
* **Emotion**: Confident, Clear.
* **Layout**: Horizontal pathway diagram connected by the dotted route line.
* **Steps**:
  1. **Your Profile**: You share your budget, language, and study level goals.
  2. **Database Filter**: The engine filters through 7,695 programs based on your inputs.
  3. **Verified Check**: Rationale checks confirm your options against verified portals.
  4. **Direct Review**: Abdullah manually reviews options before final submissions.

---

### Section 6: Why Trust Campus Insider (Value Guarantees)
* **Purpose**: Explicitly define our student-first guarantees.
* **Emotion**: Reassured, Safe.
* **Layout**: Two columns with structural line separators instead of cards.
* **Content**:
  * **Verified Admissions Data**: Regular synchronization ensures accurate tuition and program listings.
  * **Transparent Tuition Costings**: Clearly displays prep school fees alongside cash and installment rates.
  * **Free Student Assessment**: Assessment is completely free, with no pressure to apply.

---

### Section 7: Database Coverage (Database Facts)
* **Purpose**: Showcase the coverage of the synchronized database engine.
* **Emotion**: Impressed, Supported.
* **Layout**: Responsive grid displaying stats in large typography.
* **Metrics**:
  * `39` Universities mapped
  * `7,695` Programs indexed
  * `Associate to PhD` Options available
  * `English & Turkish` Programs supported
  * `Multiple` Cities included

---

### Section 8: FAQ & Answers (Resolving Uncertainty)
* **Purpose**: Address common student doubts immediately.
* **Emotion**: Reassured.
* **Layout**: Vertical accordion list separated by thin lines.
* **FAQs**:
  * *How is tuition data verified?*
  * *Does Campus Insider charge application fees?*
  * *Are final admission results guaranteed?*

---

### Section 9: Final Waypoint (The Call to Action)
* **Purpose**: Guide the user directly to the assessment wizard.
* **Emotion**: Determined, Confident.
* **Layout**: Centered action block at the end of the dotted route line.
* **Content**:
  * Headline: *"Ready to find your path?"*
  * CTA: `Start My Free Assessment` (Large pill-shaped Indigo button).
  * Supporting notice: *"Takes less than 3 minutes. Results are saved to your session."*
