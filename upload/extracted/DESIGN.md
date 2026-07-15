# 🎨 DESIGN DOCUMENT — AADHAAR-PAN LINK CHECK PORTAL
### Tilak Infotech | UI/UX & Visual Design Specification

---

## TABLE OF CONTENTS

1. [Design Philosophy](#1-design-philosophy)
2. [Visual Identity](#2-visual-identity)
3. [Typography](#3-typography)
4. [Color System](#4-color-system)
5. [Spacing & Grid](#5-spacing--grid)
6. [Component Library](#6-component-library)
7. [Screen-by-Screen Wireframes (Text)](#7-screen-by-screen-wireframes)
8. [Responsive Breakpoints](#8-responsive-breakpoints)
9. [CSS Architecture](#9-css-architecture)
10. [Device-Specific UX Rules](#10-device-specific-ux-rules)
11. [Accessibility Guidelines](#11-accessibility-guidelines)
12. [Iconography](#12-iconography)

---

## 1. DESIGN PHILOSOPHY

### Direction: **Neo-Sovereign Slate Glass — Polished, Trustworthy, Modern**

This portal handles sensitive documents (Aadhaar & PAN). The design must communicate:
- **Trust** — feels secure, official, and cutting-edge
- **Clarity** — zero ambiguity at every step
- **Simplicity** — accessible to mobile first-time smartphone users
- **Responsive Symmetry** — balanced layouts with micro-glow overlays

### Visual Details
- Border-radius: 16px (smooth rounded corners) or 8px
- Glassmorphism backdrop-filter blur (16px blur) for high-end professional appearance
- Spotlight focus glow on cursor movement
- Soft, highly visible light/dark visual mode toggles
- Consistent steps indicating exactly what needs completion

---

## 2. VISUAL IDENTITY

### Logo Placement
- Top-left on all screens (after onboarding)
- On onboarding: centered, larger
- Logo: `logo.png` — Tilak Infotech
- Below logo: tagline in small caps: `AADHAAR · PAN Verification Portal`

### Visual Motif
- Thin borders with subtle glow
- Section headers in UPPERCASE with letter-spacing

---

## 3. TYPOGRAPHY

### Font Stack

```css
/* Primary: Structural headings, labels, buttons */
font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;

/* Monospace: Codes, numbers, reference IDs */
font-family: 'IBM Plex Mono', 'Courier New', monospace;
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
```

---

## 4. COLOR SYSTEM

### Slate Glass Palette

```css
:root[data-theme="dark"] {
  --bg: #07090E;
  --bg-gradient: radial-gradient(circle at 50% 0%, #111827 0%, #07090E 100%);
  --surface: rgba(17, 24, 39, 0.7);
  --border: rgba(255, 255, 255, 0.08);
  --text: #F3F4F6;
  --accent: #3B82F6;
  --success: #10B981;
  --error: #EF4444;
}

:root[data-theme="light"] {
  --bg: #F3F4F6;
  --bg-gradient: radial-gradient(circle at 50% 0%, #E5E7EB 0%, #F3F4F6 100%);
  --surface: rgba(255, 255, 255, 0.75);
  --border: rgba(0, 0, 0, 0.08);
  --text: #111827;
  --accent: #2563EB;
  --success: #059669;
  --error: #DC2626;
}
```

---

## 5. SPACING & GRID

### Spacing Scale (base: 4px)

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

---

## 6. COMPONENT LIBRARY

### 6.1 Buttons

**Primary Button**
- Sizing: full width on mobile, max 320px on desktop
- Accent filled with shadow glow

**Secondary Button (Outline)**
- Transparent background with standard border

---

## 7. WIREFRAMES

- **Screen 1**: Onboarding Explainer
- **Screen 2**: Step 1 - Aadhaar Upload (Instruction card, drop area, browser input, preview, NEXT button)
- **Screen 3**: Step 2 - PAN Card Upload (Instruction card, upload controls, preview, NEXT button)
- **Screen 4**: Step 3 - WhatsApp Mobile Number (Plus indicator prefix, digits field, input-hint text)
- **Screen 5**: Step 4 - Process Payment (Amount indicator, pay online links, action-acknowledgement box)
- **Screen 6**: Step 5 - Upload Scan Receipts (Instruction grid, browser file picker, SUBMIT trigger)
- **Screen 7**: Step 6 - Transmission Complete (6-digit ID tracker displays, COPY, click status tracker)
- **Screen 8**: Status Tab (Reference field query, status card results, 4-node progress workflow, star feedback review)

---

## 8. RESPONSIVE BREAKPOINTS

- `<480px`: Full layout width, stacked buttons
- `>768px`: Desktop orientation, horizontal step meters, drag drop zones

---

## 9. ICONOGRAPHY

All icons derived from embedded vector structures or clean unicode symbols.

- ✓ Completion, progress nodes
- ⚠ Diagnostic, validation alerts
- ⏱ Payment clock counts
- ⚑ Complaint fabrications

---

*Design document compiled for Tilak Infotech portal verification ecosystems.*
