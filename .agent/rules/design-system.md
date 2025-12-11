# Design System & UI Rules

## 1. Aesthetic Direction ("Cinematic")
- **Archetype:** Cinema / Production House. High-end, editorial, immersive.
- **Palette:** Dark backgrounds (Charcoal/Black), Spotlight accents (Indigo/White), Glassmorphism.
- **Typography:** Expressive headings (Space Grotesk/Syne), Clean body.

## 2. Component Implementation
- **Never Inline HTML:** Extract raw HTML to `src/components/ui` or `src/components/marketing`.
- **Tokens:** Map all colors/spacing to Tailwind config. No magic hex values.
- **Hierarchy:**
  - `src/components/ui`: Primitives (Button, Input, Card).
  - `src/components/marketing`: Hero, Features, Pricing.
  - `src/components/application-ui`: Complex app patterns (Tables, Forms).

## 3. Motion Guidelines
- **Library:** Framer Motion (default).
- **Style:**
  - **Marketing:** Cinematic reveals (300-500ms), Staggered, Parallax.
  - **App:** Fast micro-interactions (120-180ms).
- **Reduced Motion:** Respect user preference.

## 4. HTML Conversion Protocol
1. **Identify Archetype**.
2. **Extract Components**.
3. **Normalize Props** (className, variant).
4. **Replace Classes** with Tailwind tokens.
5. **Add Motion** (Framer).
