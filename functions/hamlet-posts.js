// Community hamlets — fetch bulletin board posts, generalised across any hamlet
// GET ?hamlet=green-party&type=public  → public posts
// GET ?hamlet=green-party&type=private&token=XXX → verifies trial token (for that hamlet), returns private posts if valid
//
// Generalised 2026-07-26 from skinner-posts.js (Skinner Brothers keeps its own dedicated
// skinner_posts/skinner_trials tables + functions, untouched).
//
// Supabase setup required (run in SQL editor) — see hamlet_community.sql in repo root
// for the full schema (hamlet_posts, hamlet_trials).

const { createClient } = require('@supabase/supabase-js');

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
    if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'GET only' }) };

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Not configured' }) };

    const hamlet = event.queryStringParameters?.hamlet || '';
    const type   = event.queryStringParameters?.type   || 'public';
    const token  = event.queryStringParameters?.token  || '';
    if (!hamlet) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'hamlet slug required' }) };

    const supa = createClient(url, key);

    if (type === 'private') {
        if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Token required' }) };

        const { data: trial, error: tErr } = await supa
            .from('hamlet_trials')
            .select('expires_at')
            .eq('trial_token', token)
            .eq('hamlet_slug', hamlet)
            .maybeSingle();

        if (tErr || !trial) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Invalid token' }) };
        if (new Date(trial.expires_at) < new Date()) {
            return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'expired' }) };
        }

        const { data: posts, error: pErr } = await supa
            .from('hamlet_posts')
            .select('id,created_at,content,author,pinned,post_type')
            .eq('hamlet_slug', hamlet)
            .eq('is_public', false)
            .order('pinned', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(20);

        if (pErr) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not fetch posts' }) };
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ posts: posts || [] }) };
    }

    const { data: posts, error } = await supa
        .from('hamlet_posts')
        .select('id,created_at,content,author,pinned,post_type')
        .eq('hamlet_slug', hamlet)
        .eq('is_public', true)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not fetch posts' }) };
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ posts: posts || [] }) };
};
