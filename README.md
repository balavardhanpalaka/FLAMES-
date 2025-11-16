# FLAMES Checker (Static Website)

A small static website that calculates the FLAMES relationship result from two names.

How it works:
- Enter "Male name" and "Female name".
- The script sanitizes the inputs (letters only, case-insensitive), removes common letters between the names, counts the remaining letters, and performs the FLAMES elimination to return one of:
  - Friends, Love, Affection, Marriage, Enemy, Siblings

Files:
- index.html — main page and form
- styles.css — simple responsive styling
- script.js — FLAMES algorithm and UI logic

To run locally:
1. Put the three files in a folder.
2. Open `index.html` in any modern browser.

Notes:
- This is a playful, client-side implementation for entertainment.
- You can extend it with animations, translations, or server-side logging if you want.