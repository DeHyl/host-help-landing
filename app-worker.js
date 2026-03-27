export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'capitan-dd-production.up.railway.app';
    url.port = '';

    const newRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    return fetch(newRequest);
  }
}
