// Motor-Oid — DVSA MOT History lookup
// OAuth2 client credentials flow → reg plate → full MOT history

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

const TOKEN_URL = 'https://login.microsoftonline.com/a455b827-244f-4c97-b5b4-ce5d13b4d00c/oauth2/v2.0/token';
const SCOPE = 'https://tapi.dvsa.gov.uk/.default';
const MOT_API_BASE = 'https://history.mot.api.gov.uk/v1/trade/vehicles/registration';

async function getAccessToken(clientId, clientSecret) {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: SCOPE
        })
    });
    if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
    const data = await res.json();
    return data.access_token;
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const reg = event.queryStringParameters && event.queryStringParameters.reg;
    if (!reg) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Missing reg parameter' }) };
    }

    const { DVSA_CLIENT_ID, DVSA_CLIENT_SECRET, DVSA_API_KEY } = process.env;
    if (!DVSA_CLIENT_ID || !DVSA_CLIENT_SECRET || !DVSA_API_KEY) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'DVSA credentials not configured' }) };
    }

    try {
        console.log('[lookup-mot] Fetching token…');
        const token = await getAccessToken(DVSA_CLIENT_ID, DVSA_CLIENT_SECRET);
        console.log('[lookup-mot] Token OK');

        const clean = reg.replace(/\s+/g, '').toUpperCase();
        console.log('[lookup-mot] Looking up reg:', clean);

        const motRes = await fetch(`${MOT_API_BASE}/${clean}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-api-key': DVSA_API_KEY
            }
        });

        console.log('[lookup-mot] DVSA status:', motRes.status);

        if (motRes.status === 404) {
            console.log('[lookup-mot] Vehicle not found');
            return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Vehicle not found' }) };
        }
        if (!motRes.ok) {
            const errBody = await motRes.text();
            console.log('[lookup-mot] DVSA error body:', errBody);
            return { statusCode: motRes.status, headers: CORS_HEADERS, body: JSON.stringify({ error: `DVSA API error: ${motRes.status}`, detail: errBody }) };
        }

        const vehicle = await motRes.json();
        console.log('[lookup-mot] Success — tests on record:', (vehicle.motTests || []).length);
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(vehicle) };

    } catch (err) {
        console.log('[lookup-mot] Exception:', err.message);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
