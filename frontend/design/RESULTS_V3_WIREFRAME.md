# Results Redesign Specification (v3) — "The Ranked Atlas"

An editorial, hierarchy-driven ranked recommendation list replacing the generic three-column layout grid.

---

## 1. Visual Hierarchy
The results layout prioritizes the absolute top-ranked option as a dominant full-width section, followed by alternative options in a compact list format.

```
+-------------------------------------------------------------+
|  WAYPOINT 08 // RECOMMENDATIONS                             |
|  Your Study Blueprints                                       |
+-------------------------------------------------------------+
|                                                             |
|  [ BEST OVERALL MATCH ]                                     |
|  COMPUTER ENGINEERING                                       |
|  Kocaeli Saglik ve Teknoloji University • Istanbul          |
|                                                             |
|  Why This Matches:                                          |
|  - Taught fully in English as preferred                     |
|  - Annual tuition fits maximum budget ($2,000)              |
|                                                             |
|  Tuition Cost Breakdown:                                    |
|  +---------------------------+---------------------------+  |
|  | Payment Method            | Annual Fee                |  |
|  +---------------------------+---------------------------+  |
|  | Cash Price (Upfront)      | $2,000                    |  |
|  | Installments Price        | $2,200                    |  |
|  | Prep School Fee           | $1,900                    |  |
|  +---------------------------+---------------------------+  |
|                                                             |
|  [💬 Review Details with Abdullah on WhatsApp]              |
|                                                             |
+-------------------------------------------------------------+
|                                                             |
|  [ STRONG ALTERNATIVE ]                                     |
|  COMPUTER ENGINEERING // Topkapi University                 |
|  Tuition: $2,500/yr (Installments available)                |
|  [💬 Review Option]                                         |
|                                                             |
+-------------------------------------------------------------+
```

---

## 2. Recommendation Labels & Styling

### 🏆 Rank 1: "Best Overall Match" (Dominant Card)
* **Background**: Warm Sand (`#F3EEE5`) with a thick `2px` Cobalt Blue border.
* **Layout**: Full-width container. Double font sizes for program and university names.
* **Costs**: Detailed tabular view displaying cash, installment options, and prep-school fees.
* **CTA**: Large, center-aligned Cobalt Blue WhatsApp CTA.

### 🥈 Rank 2: "Best Budget Option" (Alternate Card)
* **Background**: Soft White (`#FCFBF8`) with a simple `1px` Muted Slate border.
* **Layout**: Half-width or full-width (collapsed). Shows simplified details.
* **CTA**: Clean, flat green WhatsApp icon link.

### 🥉 Rank 3: "Strong Alternative" (Secondary Card)
* **Background**: Soft White (`#FCFBF8`).
* **Layout**: Simple row format.

---

## 3. Cost Breakdown Data Tables
* Flat, borderless borders replaced with clean horizontal ink lines (`1px` solid Ink Navy).
* Headings (`Payment Method`, `Annual Fee`) formatted in uppercase `12px` Monospace.
* Numeric rates formatted in bold.

---

## 4. WhatsApp Query Redirection Template
The WhatsApp link maps variables dynamically, reflecting the student's name and the selected ranked program:

```typescript
const getWhatsAppUrl = (progName: string, uniName: string, rankLabel: string) => {
  const phone = "905000000000";
  const message = `Hi Abdullah! My name is ${fullName}. I completed the assessment and got matched with ${progName} at ${uniName} as my "${rankLabel}". Let's discuss visa application and campus life!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
```
* **Styling**: Rendered as a flat, full-width button with a Sea Green (`#168B83`) border and a green message bubble icon.
