// Motor-Oid — Admin operator provisioning
// POST { operator_email, operator_name, credits, type, note, kindness_advance } → { success, operator }
// type: 'advance' | 'bonus' | 'purchase'
// Kindness Protocol advances set kindness_advance = true

const { provisionOperator } = require('./lib/provision-operator-core');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

const VALID_TYPES = ['advance', 'bonus', 'purchase'];

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { operator_email, operator_name, credits, type, note, kindness_advance } = body;

    if (!operator_email || !operator_name) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'operator_email and operator_name required' }) };
    }
    if (!credits || typeof credits !== 'number' || credits < 1) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'credits must be a positive number' }) };
    }
    if (!VALID_TYPES.includes(type)) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'type must be advance | bonus | purchase' }) };
    }

    try {
        const operator = await provisionOperator({
            operator_email,
            operator_name,
            credits,
            type,
            note: note || null,
            kindness_advance: !!kindness_advance,
        });

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ success: true, operator }),
        };
    } catch (err) {
        console.error('Provision operator error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Provisioning failed', detail: err.message }),
        };
    }
};
