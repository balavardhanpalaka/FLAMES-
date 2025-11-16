```markdown
# FLAMES Checker — Animated Themed Interfaces

What's included
- index.html — main markup and accessible theme controls.
- styles.css — base layout plus Classical, Romantic and Sad themes; includes styles for animated FLAMES letters.
- script.js — FLAMES logic with step-by-step elimination animation and aria-live updates for accessibility.

What I changed
- Added a visual FLAMES area that renders F L A M E S as tappable/animatable tiles.
- Implemented an animated elimination: the script counts through letters for each round, highlights the counted letter during the counting, visually removes it, and continues until one letter remains.
- Kept the original normalization and removal of common letters.
- Improved Romantic and Sad theme accents: heart mask for Romantic title and layered raindrop overlay for Sad.
- Ensured accessibility: result area and visual area use aria-live; buttons use aria-selected.

How the animation works (brief)
1. After calculating leftover letters, the animation runs with that count.
2. For each elimination round the script highlights letters as it "counts" through them.
3. The targeted letter is visually removed (fade/scale/line-through).
4. This repeats until a single letter remains; the final outcome is displayed.

How to use
- Open index.html in a browser.
- Enter two names and click "Check FLAMES".
- Watch the elimination animation and read the final result in the result box.
- Switch themes using the top buttons.

Next steps you might want
- Tune speed/delays or let users configure animation speed.
- Add sound cues or small particle effects for removals.
- Add a step-by-step history panel that records each elimination for sharing or replay.

License: MIT
```