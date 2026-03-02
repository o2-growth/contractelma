

# Fix: CORS Error on `send-to-autentique` Edge Function

## Problem
The edge function's CORS headers are missing the `x-supabase-client-platform*` headers that the Supabase JS client sends automatically. The preflight OPTIONS request fails, blocking the actual POST.

## Fix

### `supabase/functions/send-to-autentique/index.ts`
Update the `corsHeaders` object to include the missing headers:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

The current code already has `corsHeaders` and the OPTIONS handler — just need to add the four `x-supabase-*` headers to `Access-Control-Allow-Headers`. Single-line change.

