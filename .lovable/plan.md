

# Fix: Enable Typography Plugin and Refine Document Preview

## Root Cause
The `@tailwindcss/typography` plugin is installed (`package.json`) but **not registered** in `tailwind.config.ts` plugins array. All `prose-*` classes are silently ignored -- headings render as plain text, tables have no styling, and the document looks nothing like Word.

## Changes

### 1. `tailwind.config.ts`
- Add `require("@tailwindcss/typography")` to the `plugins` array alongside `tailwindcss-animate`

### 2. `src/components/wizard/steps/ContractLivePreview.tsx`
- No structural changes needed -- the existing prose classes should work once the plugin is active
- Minor tweaks if needed after testing (the classes already target h1, h2, tables, etc. correctly)

This single fix should make all the existing styling take effect: rose-colored H2 headings, dark table headers, proper font sizes, centered H1, invisible `<hr>` separators, and the overall document appearance.

