// Motor-Oid — DVLA Vehicle Enquiry Service
// Returns: taxStatus, motStatus, colour, markedForExport, yearOfManufacture, fuelType
// Needs: DVLA_API_KEY in Netlify env vars
// Register free at: https://developer-portal.driver-vehicle-licensing.dvla.gov.uk/

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const { DVLA_API_KEY } = process.env;
    if (!DVLA_API_KEY) {
        return { statusCode: 503, headers: CORS_HEADERS, body: JSON.stringify({ error: 'DVLA_API_KEY not configured' }) };
    }

    const reg = event.queryStringParameters && event.queryStringParameters.reg;
    if (!reg) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Missing reg parameter' }) };
    }

    const clean = reg.replace(/\s+/g, '').toUpperCase();

    try {
        const res = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
            method: 'POST',
            headers: {
                'x-api-key': DVLA_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ registrationNumber: clean }),
        });

        if (res.status === 404) {
            return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Vehicle not found' }) };
        }
        if (!res.ok) {
            const err = await res.text();
            return { statusCode: res.status, headers: CORS_HEADERS, body: JSON.stringify({ error: `DVLA error ${res.status}`, detail: err }) };
        }

        const data = await res.json();
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(data) };

    } catch (err) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
