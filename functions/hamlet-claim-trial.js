// Community hamlets — claim a 7-day free trial, generalised across any hamlet
// POST { hamlet: 'green-party' | 'ravers' | ... } → generates UUID token → inserts into
// hamlet_trials → returns { token, expires_at, days }
//
// Generalised 2026-07-26 from skinner-claim-trial.js (Skinner Brothers keeps its own
// dedicated skinner_trials/skinner_posts tables + functions, untouched — this is the
// shared version for every community hamlet built from here on, so a new one is just
// a new page, not new backend).
//
// Supabase setup required: see hamlet-posts.js header for full SQL schema.

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

    let hamlet;
    try { hamlet = JSON.parse(event.body || '{}').hamlet; } catch(e) { /* falls through */ }
    if (!hamlet || typeof hamlet !== 'string') {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'hamlet slug required' }) };
    }

    const token     = randomUUID();
    const expiresAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    try {
        const supa = createClient(url, key);
        const { error } = await supa.from('hamlet_trials').insert({ hamlet_slug: hamlet, trial_token: token, expires_at: expiresAt });
        if (error) {
            console.error('hamlet-claim-trial:', error);
            return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not create trial' }) };
        }
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ token, expires_at: expiresAt, days: TRIAL_DAYS }) };
    } catch(err) {
        console.error('hamlet-claim-trial:', err);
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
    }
};
