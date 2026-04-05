// ─── Host Help — Cloudflare Worker ───────────────────────────────────────────
// Static asset server only. Chat is handled by capitan-dd Railway backend.

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
