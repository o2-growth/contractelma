

# Fix: Deploy the `send-to-autentique` Edge Function

## Problem
The edge function `send-to-autentique` has zero logs -- it was never deployed. The CORS error is actually the server returning a non-200 response to the preflight because the function endpoint doesn't exist.

## Fix
Deploy the `send-to-autentique` edge function. No code changes needed -- the function code and CORS headers are already correct.

