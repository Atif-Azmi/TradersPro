const axios = require('axios');

async function shortenUrl(longUrl) {
  try {
    const response = await axios.post(
      'https://api.tinyurl.com/create',
      {
        url: longUrl,
        domain: 'tinyurl.com',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYURL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );
    // Response structure: { data: { tiny_url: 'https://tinyurl.com/xxxxx' } }
    return response.data.data.tiny_url;
  } catch (error) {
    console.error('TinyURL API failed:', error.message);
    return longUrl; // Graceful fallback: return original URL
  }
}

module.exports = { shortenUrl };
