---
name: Institutional Core
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2fe'
  surface-container: '#ededf9'
  surface-container-high: '#e8e7f3'
  surface-container-highest: '#e2e1ed'
  on-surface: '#1a1b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7f2500'
  on-tertiary: '#ffffff'
  tertiary-container: '#a73400'
  on-tertiary-container: '#ffc9b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832700'
  background: '#faf8ff'
  on-background: '#1a1b23'
  surface-variant: '#e2e1ed'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-max: 1280px
  gutter: 16px
---

## Brand & Style
The design system is engineered for public academic institutions, prioritizing clarity, trust, and administrative efficiency. The brand personality is professional, reliable, and accessible, ensuring that students and staff feel supported during critical registration processes.

The aesthetic follows a **Corporate / Modern** style with a focus on high-fluidity and functional minimalism. It leverages significant whitespace and a structured hierarchy to reduce cognitive load during complex data entry. The visual language is intentionally neutral to remain timeless and institutional, favoring systematic alignment over decorative flourishes.

## Colors
The palette is rooted in "Wave Blue," a classic institutional color that signals authority and calm. 

- **Primary (Wave Blue):** Used for primary actions, active states, and branding accents.
- **Surface & Background:** A subtle distinction between `#F8FAFC` (page background) and `#FFFFFF` (content cards) creates a soft layered effect without heavy shadows.
- **Functional Colors:** Success (Green), Warning (Amber), and Destructive (Red) follow standard accessibility patterns to ensure status changes are immediately recognizable.
- **Typography:** Deep slates are used instead of pure black to improve legibility and reduce eye strain during prolonged use.

## Typography
This design system utilizes **Inter** exclusively to take advantage of its high legibility in digital interfaces. 

Headings are set to **Semi-Bold (600)** to provide a clear structural anchor for pages. Body text is prioritized at 16px for standard reading, while 14px is used for dense data tables and secondary labels. Tighten letter-spacing slightly on larger headlines to maintain a modern, "ink-trap" inspired look.

## Layout & Spacing
The layout employs a **Fluid Grid** system that transitions to a **Fixed Grid** on desktop screens (max-width 1280px). 

- **Mobile:** Single column with 16px side margins. 
- **Tablet:** 8-column grid with 24px margins.
- **Desktop:** 12-column grid with 24px gutters.

The spacing scale is built on a 4px baseline, but utilizes 8px increments for most component relationships to ensure a clean, breathable rhythm. Use "MD" (16px) for standard padding within cards and "LG" (24px) for section vertical spacing.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Low-Contrast Outlines**. 

Shadows should be used sparingly, primarily to indicate interactivity or modal overlays. Standard surface cards use a 1px border of `#E2E8F0` rather than a shadow to maintain a flat, institutional feel. When elevation is required (e.g., a dropdown or a floating modal), use a very soft, diffused shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.05)`.

## Shapes
The shape language is structured and professional. 

- **Level 1 (Soft):** Use `8px` (0.5rem) for all interactive elements like buttons, input fields, and checkboxes.
- **Level 2 (Rounded):** Use `12px` (0.75rem) for container-level elements including surface cards, modals, and alerts.
- **Pills:** Use for status indicators (tags/chips) only.

## Components

### Buttons
- **Primary:** Background `#1D4ED8`, Text `#FFFFFF`, 8px radius.
- **Secondary:** Background `#FFFFFF`, Border `#E2E8F0`, Text `#1E293B`.
- **States:** Hover states should darken the background by 5-10%. Focus states require a 2px offset ring in `#1D4ED8`.

### Input Fields
- **Default:** 8px radius, 1px border `#E2E8F0`, 16px horizontal padding.
- **Label:** `label-md` style, positioned above the field with 4px spacing.
- **Icons:** Use Lucide icons (e.g., `Search`, `Calendar`, `ChevronDown`) at 18px size, colored `#64748B`.

### Cards
- **Structure:** 12px radius, `#FFFFFF` background, 1px `#E2E8F0` border.
- **Padding:** 24px internal padding for desktop, 16px for mobile.

### Lists & Data Tables
- **Header:** Background `#F8FAFC`, `label-sm` typography.
- **Rows:** 1px bottom border `#E2E8F0`, hover state `#F8FAFC`.

### Chips / Status Tags
- **Success:** Soft green background with `#059669` text.
- **Warning:** Soft amber background with `#D97706` text.
- **Shape:** Full pill-shaped radius.

### Navigation
- **Sidebar:** Fixed on desktop, hidden behind a "Menu" Lucide icon on mobile. Use `#F8FAFC` background to differentiate from the main white content area.