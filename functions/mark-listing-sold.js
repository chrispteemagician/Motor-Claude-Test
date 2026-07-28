// Motor-Oid — mark a listing as sold
// Auth: delete_token used as the seller's auth token — same token already generated at
// creation and already used as the edit token in update-listing.js/edit.html. No new
// token mechanism here, this just wires up the one that already existed (see CLAUDE.md
// Phase Status: "Mark as sold / remove listing (delete token already generated, not wired)").
// Receives: { slug, token }
//
// Effect: flips status -> 'sold'. That's enough to drop it out of live search —
// browse.html only queries `.eq('status', 'active')`, and listing.html's own fetch is
// `.in('status', ['active', 'preview'])`, so a sold listing stops resolving there too and
// falls through to the existing "This car may have been sold or the listing removed"
// error state. No new column needed; sold_at is stashed in the vehicle jsonb, same
// pattern update-listing.js already uses for defects/disclosure_text.

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
        .select('delete_token, status, vehicle')
        .eq('slug', slug)
        .single();

    if (fetchErr || !listing) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Listing not found' }) };
    if (listing.delete_token !== token) return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid token' }) };

    // Idempotent — if it's already sold, tell the caller that rather than erroring.
    if (listing.status === 'sold') {
        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, already: true }) };
    }

    const vehicle = { ...(listing.vehicle || {}), sold_at: new Date().toISOString() };

    const { error: updateErr } = await supabase
        .from('motor_listings')
        .update({ status: 'sold', vehicle })
        .eq('slug', slug);

    if (updateErr) return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Update failed', detail: updateErr.message }) };

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true }) };
};
