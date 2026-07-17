# Campus Insider Results Experience Design Spec

The results view lists the tailored university options matching the student’s budget and preferences. It must feel like an **honest recommendation letter** rather than a typical affiliate catalog list.

---

## 1. Recommendation Result Card Layout (ASCII Diagram)

```text
+---------------------------------------------------------------------------------+
|  [Logo] Campus Insider                                      [Start New Search]  |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  "Here are the options matching your profile, Beta Tester."                     |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  |  Bahçeşehir University                                                     |  |
|  |  Computer Engineering (English)                                           |  |
|  |  Location: Besiktas, Istanbul                                             |  |
|  |                                                                           |  |
|  |  [Why This Matches]                                                       |  |
|  |  * Fits within your $5,000 maximum budget limit.                           |  |
|  |  * Taught completely in English as you preferred.                          |  |
|  |  * Strong engineering faculty and central campus in Besiktas.             |  |
|  |                                                                           |  |
|  |  TUITION COST BREAKDOWN                                                   |  |
|  |  - Cash Price (Annual): $4,500                                             |  |
|  |  - Installments Price: $4,900                                              |  |
|  |  - Prep School Fee: $4,500 (if English test is not passed)                |  |
|  |                                                                           |  |
|  |  [ Ask Abdullah on WhatsApp ]             [ Detailed Program Details ]    |  |
|  +---------------------------------------------------------------------------+  |
|                                                                                 |
|  No other matches found?                                                        |
|  "If these don't fit, click below to chat with me. I can search other options." |
|  [ Chat Directly with Abdullah ]                                                 |
|                                                                                 |
+---------------------------------------------------------------------------------+
|  * Results are preliminary. Final tuition, availability & admission are confirmed. |
+---------------------------------------------------------------------------------+
```

---

## 2. Card Design & Rationale Matching

### The "Why This Matches" Logic
* Every program card must contain a specific **Rationale List** detailing exactly how it fits the user’s answers:
  * E.g. *"✓ Under your $5k limit"*, *"✓ English program"*, *"✓ Located in Istanbul"*.
* This list is highlighted in a soft teal frame, standing out as the reasoning layer of the platform.

### Tuition Cost Breakdown
* Tuition numbers must be presented in a clean, tabular format inside the card:
  * **Cash Price**: Lower tuition when paid in full upfront.
  * **Installments Price**: Total cost if paying by semester.
  * **Prep School Fee**: Displayed separately to avoid unexpected first-year costs (a common mistake made by international students).
* Displayed currency is formatted in standard USD (`$`) or EUR (`€`) based on the synchronized database entry.

---

## 3. WhatsApp Direct Consultation Integration
* **Trigger button**: `Ask Abdullah on WhatsApp` (Pill button, green outline/text).
* **Click Action**: Opens a WhatsApp redirect page pre-filled with a structured, custom query message containing:
  * The student’s name
  * The selected university name
  * Intended major and degree type
* **Example message structure**:
  * *"Hi Abdullah, I did the assessment on Campus Insider and got matched with Bahçeşehir University Computer Engineering. I'd love to ask a few questions about life on campus and visa options."*

---

## 4. Zero-Match Helper CTA
* If the search parameters yield 0 matches:
  * Display a friendly, personalized letter box from Abdullah:
    * *“I couldn’t find a program matching your exact combination. Turkey's tuition fees change frequently. Let me know what you are looking for on WhatsApp, and I will manually check my database for you.”*
  * Renders a large green WhatsApp CTA button centered on the screen.
