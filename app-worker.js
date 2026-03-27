export default {
  async fetch(request) {
    const originalHost = new URL(request.url).hostname; // e.g. "app.host-help.com"
    const url = new URL(request.url);
    url.hostname = 'capitan-dd-production.up.railway.app';
    url.port = '';

    const newHeaders = new Headers(request.headers);
    newHeaders.set('x-forwarded-host', originalHost);

    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: newHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    return fetch(newRequest);
  }
}
