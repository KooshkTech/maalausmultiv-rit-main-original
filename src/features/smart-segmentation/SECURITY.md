# Security boundary

- Never place third-party AI tokens in Vite/browser environment variables.
- Browser segmentation must not silently upload customer photos.
- Any future server fallback requires explicit product/privacy review and server-side credentials only.
- Validate image MIME type and size before processing.
- Treat model output as untrusted: validate mask dimensions and coverage before applying it.
- Keep production Supabase/auth behavior unchanged by the editor implementation.
