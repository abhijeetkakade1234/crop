# Design System Strategy: The Modern Agrarian

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Editorial Asset Harvester."** 

We are moving away from the sterile, "safe" SaaS aesthetics of the last decade. Instead, we are blending the tactile, high-contrast soul of a **vintage food poster** with the relentless precision and functional density of **Linear.app**. This system balances organic warmth with brutalist structure. It is intentional, confident, and unapologetically editorial. We break the "template" look through massive typographic scales, hard-edged shadows that imply physical thickness, and a layout that breathes through expansive white space rather than restrictive lines.

## 2. Color & Tonal Depth
The palette is a celebration of harvest. It uses high-saturation accents against a warm, paper-like foundation.

### The Palette Roles
*   **Primary Background (`surface` / `#fff8ef`):** Our "Cream" canvas. It should feel like high-quality heavy-stock paper.
*   **The "Forest" Anchor (`inverse_surface` / `#18542a`):** Used for high-impact dark sections, footers, or primary cards to create a "well" of depth.
*   **The Accents:** `Sunshine`, `Carrot`, `Tomato`, and `Kiwi` are used as rotating identifiers. Each major section of the experience should adopt one primary accent to guide the user's mental model.

### Surface Hierarchy & Nesting
*   **The "No-Line" Rule:** We do not use 1px solid borders to define sections. Period. Boundaries are defined by shifting from `surface` to `surface_container_low` (`#fef3d6`) or by the use of the **Hard Offset Shadow**.
*   **Tonal Layering:** Treat the UI as stacked sheets of cardstock. An inner card should not have a border; it should sit on a `surface_container_high` (`#f2e7cb`) background, appearing to be "recessed" or "elevated" solely through color value.
*   **The "Glass & Gradient" Rule:** While the brand is vintage, the execution is modern. Use `surface_bright` with a 60% opacity and a `20px` backdrop-blur for floating navigation or overlays. This creates a "frosted glass" effect that keeps the warm Cream tones bleeding through.

## 3. Typography: The Editorial Voice
Typography is the primary vehicle for the brand’s personality. We use a "High-Low" mix of classic serif and technical monospaced fonts.

*   **Display & Headlines (`newsreader` / Playfair Display):** These must be massive and confident. Use `display-lg` (3.5rem) for hero moments. Use *Italic* weights (700/900) exclusively for headlines to evoke a sense of heritage and "The Sunday Times" editorial authority.
*   **Titles & Labels (`epilogue` / Syne):** Use these for functional clarity. `Syne` (600/700) provides a modern, slightly wider stance that balances the elegance of the headlines. It is the "workhorse" for buttons and card headers.
*   **Body & Technicals (`spaceGrotesk` / DM Mono):** This is where the "Linear.app" influence lives. Use `DM Mono` for technical descriptions, tags, and metadata. The monospaced nature provides a "data-rich" feel that contrasts beautifully against the flowy headlines.

## 4. Elevation & Depth: The Physicality
We reject the standard "fuzzy" shadow. This system prioritizes **Physical Presence.**

*   **Hard Offset Shadows:** To elevate a card or button, use a solid offset: `4px 4px 0px #1a1a0f`. This isn't a shadow; it's an "extrusion." It makes the UI feel like it was printed on thick board.
*   **The Ghost Border:** If a container requires a boundary (e.g., inside a Dark Forest section), use the `outline_variant` at **15% opacity**. It should be a "whisper" of a line, never a "statement."
*   **Section Dividers:** Instead of lines, use the **Harvest Gradient**. A 4px tall horizontal bar transitioning from `Sunshine` → `Carrot` → `Tomato` serves as the primary separator between major content blocks.

## 5. Components

### Buttons
*   **Primary:** `Sunshine` background, `4px 4px 0px #1a1a0f` hard shadow, `Syne` Bold type. On hover, the shadow collapses to `2px 2px`, mimicking a physical press.
*   **Secondary:** `Cream` background with a `1px` Ghost Border (`outline_variant`). 
*   **Tertiary:** All-caps `DM Mono` with a `Kiwi` underline (2px).

### Cards
*   Cards should never use standard shadows. They use either a background shift (`surface_container`) or the Hard Offset Shadow. 
*   **Corner Radius:** Use `lg` (16px) for main containers and `md` (12px) for nested elements.

### Chips & Tags
*   Use `DM Mono` exclusively. 
*   Backgrounds should be the rotating accents (`Kiwi`, `Carrot`, etc.) at 10% opacity with a matching 100% opacity technical label.

### Input Fields
*   Text inputs should be `surface_container_low` with a bottom-only border of 2px in `primary`. This mimics a vintage ledger or fill-in-the-blank form.

### The "Pulse" Indicator
*   A custom component for this system: A small, rotating "sun" or geometric shape in the `Sunshine` accent used to denote "Live" data or active states, reinforcing the "Crop" and growth theme.

## 6. Do's and Don'ts

### Do
*   **Do** use massive amounts of whitespace. If a section feels "full," add 32px of padding.
*   **Do** rotate accent colors. If the Hero section uses `Sunshine`, the first feature section should use `Kiwi`.
*   **Do** use `Playfair Display Italic` for emphasis within body copy to maintain the editorial feel.

### Don'ts
*   **Don't** use pure black (#000000). Use the `on_background` (#201b0a) for text and `#1a1a0f` for hard shadows.
*   **Don't** use standard 1px borders to separate content. Use the "Harvest Gradient" or a background color shift.
*   **Don't** use soft, blurry shadows. They dilute the "Vintage Poster" confidence of the system.