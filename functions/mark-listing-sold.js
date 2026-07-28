// Motor-Oid — mark a listing as sold
// Auth: delete_token used as edit token (same token already held by the seller,
// same mechanism as update-listing.js). Flips status → 'sold', which removes it
// from browse.html's live search (that query filters .eq('status', 'active')).
// Receives: { slug, token }

const { createClient } = require('@supabase/supabase-js');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not configured' }) };

    let body;
    try { body = JSON.parse(event.body); }
    catch (e) { return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

    const { slug, token } = body;
    if (!slug || !token) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'slug and token required' }) };

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: listing, error: fetchErr } = await supabase
        .from('motor_listings')
        .select('delete_token, status')
        .eq('slug', slug)
        .single();

    if (fetchErr || !listing) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Listing not found' }) };
    if (listing.delete_token !== token) return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid token' }) };

    if (listing.status === 'sold') {
        // Already sold — idempotent success, nothing further to do.
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, already: true }) };
    }

    const { error: updateErr } = await supabase
        .from('motor_listings')
        .update({ status: 'sold' })
        .eq('slug', slug);

    if (updateErr) return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Update failed', detail: updateErr.message }) };

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true }) };
};
