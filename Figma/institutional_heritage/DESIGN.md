---
name: Institutional Heritage
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#251a00'
  on-tertiary-container: '#a67e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f7be1d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system embodies "Institutional Core"—a philosophy rooted in stability, clarity, and professional authority. It balances the high-utility requirements of governance and enterprise with subtle cultural resonance inspired by the Senegal flag.

The aesthetic is characterized by **Modern Minimalism** with a focus on structured hierarchy. It utilizes a refined slate-based background system to provide a neutral stage for high-contrast meaningful colors. The emotional response should be one of absolute reliability, transparency, and organized efficiency. 

Visual signals are clear and unambiguous, favoring sharp execution over decorative flair. The use of the Green-Yellow-Red palette is functional rather than ornamental, ensuring that state-based information is communicated with both precision and a nod to national identity.

## Colors

The palette is anchored by **Slate-900** as the primary professional blue, used for core branding and high-level navigation to maintain an institutional weight. 

Accent colors are derived from the Senegal flag, mapped to semantic utility:
- **Primary Accent / Success:** Green (#059669) is used for positive confirmations, primary action highlights, and brand flourishes.
- **Secondary Accent / Warning:** Gold (#EAB308) is reserved for pending states, attention-required notifications, and subtle highlights within data visualizations.
- **Destructive / Error:** Red (#DC2626) is utilized strictly for errors, critical alerts, and destructive actions.

Backgrounds utilize a tiered slate system (Slate-50 to Slate-200) to define workspaces, while typography primarily sits on Slate-900 for maximum legibility.

## Typography

This design system uses **Inter** exclusively to ensure a systematic, utilitarian, and highly readable experience across all platforms. 

The type scale is strictly enforced to maintain institutional hierarchy. Headlines use tighter letter-spacing and heavier weights to project authority. Body text is optimized for long-form reading with generous line heights. Labels utilize a slight tracking increase and medium weights to differentiate them from body content, particularly in data-heavy views or form fields.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop environments to maintain a sense of controlled, "official" structure, while transitioning to a fluid model for mobile.

- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Tablet:** 8-column grid, fluid width, 24px margins.
- **Mobile:** 4-column grid, fluid width, 16px margins.

Spacing follows a strict 4pt linear scale. Content blocks should use `xl` (40px) or `2xl` (64px) vertical padding to create a sense of breathing room and premium quality, avoiding the cluttered "legacy" institutional look.

## Elevation & Depth

To maintain a clean, professional aesthetic, this design system avoids heavy shadows and skeuomorphism. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Base):** Slate-50 background.
2.  **Level 1 (Cards/Surface):** White surface with a 1px border in Slate-200. No shadow.
3.  **Level 2 (Dropdowns/Modals):** White surface with a 1px border in Slate-200 and a subtle, high-diffusion "Ambient Shadow" (Slate-900 at 5% opacity, 12px blur, 4px Y-offset).

Interactive elements should not "pop" off the page; they should feel integrated into the grid. Depth is used only to signify temporary overlays or distinct content sections.

## Shapes

The shape language is **Soft (1)**. This choice balances the rigidity of institutional design with a contemporary, approachable feel. 

Standard components (inputs, buttons, cards) use a 0.25rem (4px) corner radius. This subtle rounding maintains the "Institutional Core" grid-alignment while removing the perceived "sharpness" of raw 0px corners, making the UI feel precise yet modern. Large containers or featured modals may scale up to 0.5rem (8px).

## Components

### Buttons
- **Primary:** Background Slate-900, Text White. Solid, authoritative.
- **Secondary:** Border 1px Slate-300, Text Slate-900. 
- **Accent (Success):** Background #059669, Text White. Used for the "final" positive action in a flow.
- **Destructive:** Border 1px #DC2626, Text #DC2626. For high-risk actions.

### Input Fields
Inputs use a 1px Slate-200 border. On focus, the border transitions to Slate-900 with a 2px outer "glow" of Slate-100. Error states use the Red (#DC2626) for both the border and the helper text, accompanied by the `<AlertCircle />` icon.

### Chips & Badges
Badges use low-saturation backgrounds with high-saturation text:
- **Success:** Background (Green-50), Text (#059669).
- **Warning:** Background (Yellow-50), Text (#854d0e).
- **Neutral:** Background (Slate-100), Text (Slate-600).

### Lists & Data Tables
Tables use a strict horizontal rule system (1px Slate-100) with no vertical borders. Headers are in `label-sm` style with a Slate-50 background.

### Cards
Cards are white with a 1px Slate-200 border. They should not use shadows unless they are interactive "hoverable" cards, in which case they transition to a slightly darker border (Slate-300).

### Icons
Use **Lucide** icons. Line weight should be consistently 2px. For status indicators, always pair an icon with text for accessibility (e.g., `<CheckCircle />` for success, `<AlertTriangle />` for warnings).