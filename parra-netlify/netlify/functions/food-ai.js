// This runs on Netlify's servers, not in the browser — so the API key
// never gets exposed to anyone using the app.

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY environment variable in Netlify site settings.' }),
    };
  }

  try {
    const { system, content, max_tokens } = JSON.parse(event.body || '{}');
    if (!content) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing content in request body.' }) };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: max_tokens || 1000,
        system,
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Unknown error' }) };
  }
}
