addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') {
    event.respondWith(jsonError(`Method ${request.method} is not allowed`, 405));
    return;
  }

  event.respondWith(handleRequest(event.request));
})


/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.substring(1);

  if (!path) {
    return jsonError('Missing input', 406);
  }

  return new Response(path, {status: 200});
}

function jsonError(message, status = 400) {
  return new Response(
      JSON.stringify({
        error: message
        }
      ),
      {
        status: status,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
}
