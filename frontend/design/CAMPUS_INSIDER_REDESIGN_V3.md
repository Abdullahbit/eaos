# The Istanbul Student Atlas — Design System (v3)

A premium editorial design system for Campus Insider, reimagining the study-abroad portal as an independent, high-contrast, magazine-style city guide for international students moving to Istanbul.

---

## 1. Visual Metaphor: "The Editorial Journal"
Instead of clean, template-based SaaS cards or corporate grid frameworks, **The Istanbul Student Atlas** feels like a tactile, premium print guide (e.g., *Monocle* or *Cereal Magazine* combined with *Notion* and *Stripe* simplicity). 

* **Asymmetry**: Unbalanced 12-column grids, large left-aligned headers offset by spacious right-aligned paragraphs, and side-aligned imagery.
* **Tactile Dividers**: Thick horizontal dividers (`2px` solid Ink Navy) to separate content zones cleanly, removing card containers entirely where possible.
* **Large Editorial Numbers**: Massive numbers (`120px` Source Serif 4) to guide reader attention.
* **Photography**: Grainy, high-contrast photography of real student life in Istanbul (Kadıköy ferries, Beşiktaş cafes, campus libraries) instead of stock vector illustrations or AI avatars.

---

## 2. Color System

| Token Name | Hex Code | Visual Role | Contrast Target |
| :--- | :--- | :--- | :--- |
| **Ink Navy** | `#152238` | Primary brand ink, main headers, dark buttons | AA/AAA text |
| **Cobalt Blue** | `#3157D5` | Wayfinding highlights, route badges, active interactive borders | UI indicators |
| **Warm Sand** | `#F3EEE5` | Primary layout backgrounds, hero sections, accent panel fills | Solid contrast base |
| **Soft White** | `#FCFBF8` | Secondary clean content backgrounds | Bright paper feel |
| **Terracotta** | `#D96C4A` | Rationale highlights, cost highlights, warnings | Accent attention |
| **Sea Green** | `#168B83` | Success states, secure indicators, WhatsApp CTA borders | Action highlight |
| **Muted Slate** | `#667085` | Supporting labels, table headers, coordinate markers | Soft metadata |

---

## 3. Typography System

### Headings (Manrope or Sora)
* **Hero Headline (Desktop)**: `80px` / Line height `1.1` (Bold, left-aligned, tight letter-spacing `-0.03em`)
* **Section Header (Desktop)**: `48px` / Line height `1.2` (Semi-bold, left-aligned)
* **Sub-section Header**: `24px` / Line height `1.3` (Medium)
* **Labels / Micro-caps**: `12px` / Line height `1.5` (Tracking `0.1em`, uppercase)

### Body Text (Inter)
* **Large Paragraphs**: `18px` / Line height `1.6` (Regular)
* **Standard Body**: `16px` / Line height `1.5` (Regular)
* **Table Data / Metadata**: `14px` / Line height `1.4` (Regular/Medium)

### Editorial Stories & Quotes (Source Serif 4)
* **Quotes**: `22px` italic / Line height `1.6` (Playful, academic, human voice)
* **Case Studies / Narratives**: `18px` / Line height `1.6` (Warm older-brother voice)

---

## 4. Spacing & Rhythm
* **Section Padding**: `120px` to `160px` vertical margins on desktop to allow elements to "breathe" with ample white space.
* **Grid**: 12-column asymmetric layout with `32px` gutter width.
* **Radius**: Minimal rounding (`0px` to `4px` maximum) for a sharp, high-contrast, premium print-like editorial appearance. No pill-shaped cards or bubble shapes.

---

## 5. UI Elements

### Buttons
* **Primary Editorial Button**: Flat `#152238` background, `#FCFBF8` text, sharp `4px` borders. Scale translation `+1.01` on hover with a thick offset drop-shadow.
* **Secondary Editorial Button**: Transparent background, `1.5px` solid `#152238` border, sharp corners. Shifts to Cobalt Blue on hover.

### Data Tables
* Flat, borderless borders replaced with subtle `1px` horizontal ink lines.
* Columns align left for descriptions and right for numeric tuition breakdowns.

---

## 6. Accessibility & Responsiveness
* **Reflow Target**: Text scale preserves readability down to `360px` mobile screens.
* **Contrast Compliance**: Headings and body components meet a minimum contrast ratio of `4.5:1` against Warm Sand and Soft White backdrops.
* **Reduced Motion**: Disables smooth transitions and vertical slider translations when `prefers-reduced-motion: reduce` is active.
