import { fetchImageFromDiscord, fetchNormalImage, getImageFetchUrl } from './functions';

// const ITEM_REGEX = /^([A-Z]{2}-)?[0-9a-zA-Z]{10,}$/; // With optional prefix for now, until implemented
const ITEM_REGEX = /^[A-Z]{2}-[0-9a-zA-Z]{10,}$/;

addEventListener('fetch', event => {
  const method = event.request.method;

  if (method !== 'GET') {
    event.respondWith(jsonError(`Method ${method} is not allowed`, 405));
    return;
  }

  event.respondWith(handleRequest(event));
})

/**
 * Respond to the request
 * @param {FetchEvent} event
 */
async function handleRequest (event) {
  const request = event.request;
  const url = new URL(request.url);
  const path = url.pathname.substring(1);

  if (!path) {
    return jsonError('Missing input', 406);
  }

  if (!ITEM_REGEX.test(path)) {
    return jsonError('Not found', 404);
  }

  // return new Response(path, {status: 200});
  return fetchCdnImage(path, event);
}

/**
 * Fetch an image with the id
 * @param {String} imageId
 * @param {FetchEvent} event
 * @return Response
 */
async function fetchCdnImage(imageId, event) {
  const lookUpUrl = getImageFetchUrl(imageId);
  const cache = caches.default;
  const request = event.request;
  let response = await cache.match(request);
  // let response = await cache.match(lookUpUrl);

  if (!response) {
    const actualImageUrl = await fetchRealImageUrl(lookUpUrl);

    console.log(actualImageUrl);

    if (!actualImageUrl) {
      return jsonError('Item not present on cdn', 404);
    }

    let imageResponse;

    if (actualImageUrl.includes('discord')) {
      imageResponse = await fetchImageFromDiscord(actualImageUrl);
    } else {
      imageResponse = await fetchNormalImage(actualImageUrl);
    }

    const cloned = imageResponse.clone();
    const headers = {
      'cache-control': 'public, max-age=14400', // 4 hours in seconds
      'x-duncte123': 'yes',
      'content-type': cloned.headers.get('content-type'),
    };

    response = new Response(cloned.body, { ...cloned, headers });

    event.waitUntil(cache.put(request, response.clone()));
    // event.waitUntil(cache.put(lookUpUrl, response.clone()));
  }

  return response;
}

async function fetchRealImageUrl(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Cloudflare Worker (+https://cdn.duncte123.me/)'
    }
  });

  if (res.status !== 200) {
    return null;
  }

  return res.text();
}

function jsonError(message, status = 400) {
  return new Response(
      JSON.stringify({
        error: message
      }),
      {
        status: status,
        headers: {
          'content-type': 'application/json'
        }
      }
  );
}
