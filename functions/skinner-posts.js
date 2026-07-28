// Skinner Brothers — fetch bulletin board posts
// GET ?type=public  → public posts (anon-safe via Supabase anon key, but proxied here for simplicity)
// GET ?type=private&token=XXX → verifies trial token, returns private posts if valid
//
// Supabase setup required (run in SQL editor):
//
// CREATE TABLE skinner_posts (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at timestamptz DEFAULT now(),
//   content text NOT NULL,
//   is_public boolean DEFAULT true,
//   author text DEFAULT 'The Skinner Brothers',
//   pinned boolean DEFAULT false,
//   post_type text DEFAULT 'update'  -- 'update' | 'gig' | 'news'
// );
// ALTER TABLE skinner_posts ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "anon_read_public" ON skinner_posts FOR SELECT TO anon USING (is_public = true);
//
// CREATE TABLE skinner_trials (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at timestamptz DEFAULT now(),
//   trial_token text UNIQUE NOT NULL,
//   expires_at timestamptz NOT NULL
// );
// ALTER TABLE skinner_trials ENABLE ROW LEVEL SECURITY;
// (service_role bypasses RLS — no additional policy needed for server-side reads/inserts)

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

    const type  = event.queryStringParameters?.type  || 'public';
    const token = event.queryStringParameters?.token || '';
    const supa  = createClient(url, key);

    if (type === 'private') {
        if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Token required' }) };

        const { data: trial, error: tErr } = await supa
            .from('skinner_trials')
            .select('expires_at')
            .eq('trial_token', token)
            .maybeSingle();

        if (tErr || !trial) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Invalid token' }) };
        if (new Date(trial.expires_at) < new Date()) {
            return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'expired' }) };
        }

        const { data: posts, error: pErr } = await supa
            .from('skinner_posts')
            .select('id,created_at,content,author,pinned,post_type')
            .eq('is_public', false)
            .order('pinned', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(20);

        if (pErr) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not fetch posts' }) };
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ posts: posts || [] }) };
    }

    const { data: posts, error } = await supa
        .from('skinner_posts')
        .select('id,created_at,content,author,pinned,post_type')
        .eq('is_public', true)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not fetch posts' }) };
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ posts: posts || [] }) };
};
