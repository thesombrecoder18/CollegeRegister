---
name: SaaS Admin Core
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#041528'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a2a3e'
  on-tertiary-container: '#8191a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
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
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
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
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for multi-tenant educational administration, prioritizing high-density information architecture and institutional reliability. The aesthetic is **Corporate Modern** with a focus on functional clarity and systemic order. It targets academic administrators, registrars, and educators who require a high-efficiency environment for managing complex datasets.

The UI evokes a sense of "quiet authority"—it is unobtrusive, predictable, and robust. By utilizing a neutral foundation with dynamic primary accents, the system allows for multi-tenant white-labeling while maintaining a consistent structural integrity.

## Colors
This design system utilizes a foundation of Slate tones to provide a sophisticated, professional environment. 

- **Primary (--color-brand-primary):** Slate 800 (#1E293B) is reserved for structural headers, primary navigation, and high-level UI anchors.
- **Secondary (--color-brand-secondary):** Emerald 600 (#059669) signifies success, completion, and growth, used for positive action states.
- **Background:** Slate 50 (#F8FAFC) provides a subtle, cool-toned canvas that reduces eye strain during long sessions.
- **Surfaces:** Pure White (#FFFFFF) is used for cards and workspace modules to create clear separation from the background.
- **Borders:** Slate 200 (#E2E8F0) is the standard for hair-line dividers and input strokes, ensuring definition without visual noise.

## Typography
The system uses **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. The hierarchy is tight, with smaller increments between sizes to accommodate dense administrative dashboards.

- **Data Grids:** Use `body-sm` or `data-mono` for tabular content to maximize information density.
- **Labels:** Use `label-sm` in all-caps for table headers and section overviews to provide clear categorization.
- **Responsiveness:** On mobile devices, `display` scales down to 30px and `headline-lg` to 24px. Smaller body text remains constant to ensure readability.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. To facilitate dense data management, the spacing rhythm is based on a 4px baseline, but defaults to a 16px/24px standard for most container padding.

- **Desktop:** 12 columns, 20px gutters, 32px outer margins.
- **Tablet:** 8 columns, 16px gutters, 24px outer margins.
- **Mobile:** 4 columns, 12px gutters, 16px outer margins.

Content is organized into "Workspace Containers"—white cards that house specific functional modules. Sidebars are fixed at 280px for primary navigation, while the main content area expands fluidly.

## Elevation & Depth
The design system avoids heavy shadows in favor of **Tonal Layers** and crisp outlines. This maintains a clean, architectural feel suitable for "SaaS Admin Core."

- **Level 0 (Background):** Slate 50.
- **Level 1 (Cards/Surface):** White background with a 1px solid border of Slate 200. No shadow.
- **Level 2 (Dropdowns/Modals):** White background with a 1px Slate 200 border and a soft, neutral ambient shadow (Offset: 0, 4px; Blur: 12px; Opacity: 0.05).
- **Interactive States:** On hover, buttons and interactive cards may transition to a Slate 100 background or increase border prominence.

## Shapes
The shape language is disciplined and geometric. A standard `roundedness` of 8px is applied to most UI components to balance modern friendliness with professional structure.

- **Standard (8px):** Buttons, Input fields, Checkboxes.
- **Large (12px):** Main content cards, Modals, Feature containers.
- **Icons:** Use Lucide icons with a 2px stroke weight and "round" join/cap settings to mirror the UI's radius.

## Components
- **Buttons:** Solid `--color-brand-primary` for primary actions. Ghost buttons use Slate 600 text with no border. 8px radius.
- **Input Fields:** Slate 200 border, White background. 14px text. Focus state uses a 2px ring of `--color-brand-primary` at 20% opacity.
- **Cards:** White surface, Slate 200 border, 12px radius. Padding should be 24px for standard content, 16px for data grids.
- **Data Grids:** Zebra striping using Slate 50 on even rows. 12px vertical cell padding for density. Table headers in `label-sm` (Slate 500).
- **Chips:** Soft Slate 100 background with Slate 700 text. Use `--color-brand-secondary` (Emerald) backgrounds at 10% opacity for "Success" or "Active" status chips.
- **Icons:** Lucide icons only. Size standard is 18px for buttons and 20px for standalone actions. No emojis are permitted within the core administrative interface.