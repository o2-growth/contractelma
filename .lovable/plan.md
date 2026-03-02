

# Fix: PDF sent to Autentique appears blank/garbled

## Problem
The `generateSimplePdf` function in the edge function has two critical bugs:

1. **Broken text positioning**: Uses `Td` (relative positioning) but treats values as absolute coordinates. After the first line, every subsequent line jumps to wrong positions, making most text invisible (off-page).
2. **UTF-8 encoding issue**: Uses `/Encoding /WinAnsiEncoding` with Helvetica but writes raw UTF-8 bytes. Portuguese characters (ã, ê, í, ç) get corrupted or lost.

## Fix

### `supabase/functions/send-to-autentique/index.ts`

Rewrite `generateSimplePdf` to:
- Use **absolute positioning** via `BT ... Tf ... Td(once) ... Tj ... ET` per line, or use `Tm` for absolute text matrix
- Convert UTF-8 Portuguese characters to their WinAnsiEncoding byte equivalents (e.g., `ã` = `\xe3`, `ç` = `\xe7`)
- Word-wrap long lines properly (current code truncates at 100 chars)
- Fix the content stream so each line renders at the correct Y coordinate

The key change in the stream building loop: position each line absolutely instead of using cumulative relative moves.

After fixing, redeploy the edge function.

