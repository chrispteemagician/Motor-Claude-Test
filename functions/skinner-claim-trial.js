// Skinner Brothers — claim a 7-day free trial
// POST (no body required) → generates UUID token → inserts into skinner_trials → returns { token, expires_at, days }
//
// Supabase setup required:
// See skinner-posts.js header for full SQL schema.
// skinner_trials table must exist before this function is called.

const { createClient } = require('@supabase/supabase-js');
const { randomUUID }   = require('crypto');

const TRIAL_DAYS = 7;

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'POST only' }) };

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Not configured' }) };

    const token     = randomUUID();
    const expiresAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    try {
        const supa = createClient(url, key);
        const { error } = await supa.from('skinner_trials').insert({ trial_token: token, expires_at: expiresAt });
        if (error) {
            console.error('skinner-claim-trial:', error);
            return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not create trial' }) };
        }
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ token, expires_at: expiresAt, days: TRIAL_DAYS }) };
    } catch(err) {
        console.error('skinner-claim-trial:', err);
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
    }
};
