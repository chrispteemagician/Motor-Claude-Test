// Motor-Oid — update an existing listing (price, contact, defects, disclosure)
// Auth: delete_token used as edit token (same token, already held by seller)
// Receives: { slug, token, price, contactPhone, contactEmail, defects, disclosureText }

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

    const { slug, token, price, contactPhone, contactEmail, defects, disclosureText } = body;
    if (!slug || !token) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'slug and token required' }) };

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: listing, error: fetchErr } = await supabase
        .from('motor_listings')
        .select('delete_token, vehicle')
        .eq('slug', slug)
        .single();

    if (fetchErr || !listing) return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Listing not found' }) };
    if (listing.delete_token !== token) return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid token' }) };

    const updates = {};
    if (price        !== undefined) updates.price         = price;
    if (contactPhone !== undefined) updates.contact_phone = contactPhone;
    if (contactEmail !== undefined) updates.contact_email = contactEmail;

    if (defects !== undefined || disclosureText !== undefined) {
        const vehicle = { ...(listing.vehicle || {}) };
        if (defects         !== undefined) vehicle.defects          = defects.split('\n').map(s => s.trim()).filter(Boolean);
        if (disclosureText  !== undefined) vehicle.disclosure_text  = disclosureText;
        updates.vehicle = vehicle;
    }

    const { error: updateErr } = await supabase
        .from('motor_listings')
        .update(updates)
        .eq('slug', slug);

    if (updateErr) return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Update failed', detail: updateErr.message }) };

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true }) };
};
