// Motor-Oid — What3Words location lookup
// GET ?lat=51.521&lng=-0.203 → { words, nearestPlace, country, map }

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const { lat, lng } = event.queryStringParameters || {};
    if (!lat || !lng) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'lat and lng required' }) };
    }

    const apiKey = process.env.W3W_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'W3W not configured' }) };
    }

    try {
        const res = await fetch(
            `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&language=en&format=json`,
            { headers: { 'X-Api-Key': apiKey } }
        );

        if (!res.ok) {
            throw new Error(`W3W API error: ${res.status}`);
        }

        const data = await res.json();

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                words: data.words,
                nearestPlace: data.nearestPlace,
                country: data.country,
                map: data.map,
            }),
        };

    } catch (err) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
