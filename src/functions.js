const api_base = process.env.DATABASE_HOST + process.env.DATABASE_PATH;

/**
 * Fetch an image with the id
 * @param {String} imageId
 * @return String
 */
export function getImageFetchUrl(imageId) {
  return `${api_base}/real-image-url?imageId=${imageId}`;
}

/**
 *
 * @param {string} discordUrl
 * @returns {Promise<Response>}
 */
export function fetchImageFromDiscord(discordUrl) {
  return fetch(`${api_base}/discord`, {
    headers: {
      'X-Discord-Url': discordUrl,
      'User-Agent': 'Cloudflare Worker (+https://cdn.duncte123.me/)'
    }
  });
}

/**
 *
 * @param {string} imageUrl
 * @returns {Promise<Response>}
 */
export async function fetchNormalImage(imageUrl) {
  return fetch(imageUrl, {
    headers: {
      // 'User-Agent': 'Cloudflare Worker (+https://cdn.duncte123.me/)'
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
    }
  });
}
