# AIUN Frontend Diagnosis With awesome-design-md

Date: 2026-06-14

## Setup

- Installed `VoltAgent/awesome-design-md` at `/Users/zonghe/.codex/tools/awesome-design-md`.
- Used `/Users/zonghe/.codex/tools/awesome-design-md/design-md/apple/DESIGN.md` as the primary reference because the intended direction is Apple-style.
- Captured current local frontend at `http://127.0.0.1:4173/` using a 1440x900 desktop viewport.
- Evidence files:
  - `01-hero-upload.png`
  - `02-story-ranked.png`
  - `03-coverage.png`
  - `04-story-ranked.png`
  - `05-story-email.png`
  - `metrics.json`
  - `console-errors.json`

## Apple Reference Criteria Used

- Single interactive accent: Action Blue `#0066cc`; avoid second accent colors.
- No decorative gradients; atmosphere should come from product/experience imagery, not CSS gradients.
- Shadows are reserved for product imagery, not UI chrome, buttons, cards, or text.
- Display headlines should feel tight but calm: SF/system font, weight 600, not overly heavy.
- Body copy should be readable and lighter: around 17px, weight 400, generous line height.
- Full-bleed sections should be edge-to-edge color surfaces, not framed cards.
- Primary CTA should be a quiet blue pill with minimal shadow and clear focus/active states.

## Step Findings

### 1. Intro Personal Note

Health: **directionally expressive, but not Apple-aligned yet**

Strengths:
- The personal voice makes AIUN feel more human and founder-led.
- The screen is simple and focused; there is no competing navigation.

Risks:
- The full green gradient introduces a second brand accent and visually dominates the system. This conflicts with the Apple reference, where blue is the only interaction/brand signal.
- The intro currently centers `Zayne Ma` more than the product outcome. For a landing page, the first screen should still make AIUN's value obvious within seconds.
- Heavy glow/shadow on the card and text makes the intro feel more startup/SaaS than Apple.

Recommendation:
- Keep the conversational founder idea, but move it into an Apple-like white/parchment surface or a restrained inline quote module.
- If green is kept, use it only as a tiny trust/status accent, not a full-screen brand color.

### 2. Upload Story State

Health: **clear concept, visually too heavy**

Strengths:
- The upload flow is immediately understandable.
- The resume-to-button structure communicates the product mechanics quickly.
- The copy is concise and user-oriented.

Risks:
- The blue button uses gradient plus a large shadow. Apple DESIGN.md explicitly avoids decorative gradients and UI chrome shadows.
- The green `Resume.pdf` tile creates a second dominant accent beside blue.
- Headline/body weights are too heavy: title is visually near 700; body is also bold. This reduces the calm Apple feel.
- The CTA shadow competes with the upload animation. Apple-style CTAs are flatter and quieter.
- The scroll cue is visible but not self-explanatory; users may not realize this is a scroll narrative.

Recommendation:
- Convert the upload button to a flat Action Blue pill, with only press-scale interaction.
- Make `Resume.pdf` a white/light-gray document tile with a small blue icon, not a green object.
- Reduce headline to weight 600 and body to weight 400.
- Treat bubbles/signals as light translucent chips, not glowing objects.

### 3. Story Progression And Email State

Health: **interaction idea is good, state rendering is fragile**

Strengths:
- The three-step narrative matches the product well.
- The email state has the right user promise: recommendation arrives without repeated searching.

Risks:
- During capture, the third story state produced a large blank blue panel before the email content was visible. This creates a high-risk moment: the main visual becomes a placeholder instead of proof.
- Programmatic scrolling did not reliably land on the second ranked state; this suggests the scroll narrative depends on timing/position in a brittle way.
- The story is visually strong but not yet "museum-like"; the UI cards are too chromed with shadows, gradients, and bright fills.

Recommendation:
- Make every pinned scroll state valid when captured at any point in its range. No state should show an empty gradient panel.
- Separate `activeStory` state from transient animation phase so the correct content is always mounted before animation begins.
- Use flat product-style surfaces and let motion provide delight instead of shadows/gradients.

### 4. Coverage Section

Health: **structurally clean, but too generic**

Strengths:
- The section hierarchy is simple: title, subtitle, stats, logo grid.
- The grid is readable and dense enough to show coverage.
- 40 organization tiles render, and there were no console errors.

Risks:
- The title is 76px/700, heavier and larger than the Apple reference; it feels more SaaS hero than Apple product tile.
- Logo tiles are generic pill/cards with acronym text. They do not provide the recognition value expected from "organizations we cover."
- Tile radius and repeated card borders are acceptable for utility cards, but the grid currently lacks Apple-like product polish.
- The coverage section does not use the visual proof available from real organization logos, so the section undersells capability.

Recommendation:
- Lower title weight to 600 and bring the scale closer to 56-64px.
- Use real logo assets where possible; if not available, use a cleaner wordmark treatment with less border emphasis.
- Keep tiles flat: light hairline only, no shadow.
- Consider a first row of recognizable marquee organizations before the full grid.

## Accessibility And Robustness Risks

- Motion is present and appears substantial. `prefers-reduced-motion` exists in CSS, but the current audit did not verify every animation state under reduced motion.
- Some buttons/links use bold 14px text. Touch/click size seems acceptable, but focus states should be checked explicitly.
- Scroll narrative state changes may not be announced to assistive tech. The page should still read logically as static content.
- The first full-screen green intro delays the product explanation; keyboard and screen-reader users may encounter extra content before the core task.

## Priority Recommendations

1. **Remove second dominant accent from the hero path.**
   Use Apple Action Blue as the only strong color. Turn green into either neutral white/gray or a tiny status accent.

2. **Flatten UI chrome.**
   Remove most button/card shadows and decorative gradients. Keep only subtle product/preview depth if needed.

3. **Fix story-state robustness.**
   Ensure ranked and email states always render useful content, never a blank panel, at every scroll progress point.

4. **Lighten typography.**
   Use 600 for headlines and 400 for body copy. Current body text reads too bold and compressed.

5. **Upgrade coverage proof.**
   Replace acronym-only tiles with more recognizable logo/wordmark treatments or at least clearer organization labels.

6. **Clarify intro's role.**
   If the founder note stays, make it a short trust module rather than the dominant first screen.

## Evidence Limits

- This diagnosis is based on desktop screenshots and computed styles from the current local build.
- It does not claim full WCAG compliance.
- It did not test mobile behavior because recent design feedback has focused on desktop.
- It did not modify the frontend; this is a diagnosis only.
