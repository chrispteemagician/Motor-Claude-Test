// Returns preview listings belonging to an operator
// GET /.netlify/functions/get-pending-previews?operator_slug=xxx

const { createClient } = require('@supabase/supabase-js');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const operator_slug = (event.queryStringParameters || {}).operator_slug || '';
    if (!operator_slug) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'operator_slug required' }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Supabase not configured' }) };
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('motor_listings')
            .select('slug, vehicle, listing_headline, created_at')
            .eq('status', 'preview')
            .filter('vehicle->>operator_slug', 'eq', operator_slug)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Supabase error:', error);
            return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Query failed', detail: error.message }) };
        }

        // NOTE: publish_token is deliberately NOT included here.
        // This endpoint takes an unauthenticated operator_slug (a public dealer name)
        // with no ownership check, so it must never hand back the token that grants
        // publish rights on that operator's preview listings. The operator already
        // receives the publish link (with token) directly in their own browser at
        // preview-creation time (see sell.html / create-listing.js) — that is the
        // only legitimate delivery channel for publish_token.
        const previews = (data || []).map(row => ({
            slug: row.slug,
            title: row.listing_headline || row.vehicle?.vehicle_title || 'Untitled',
            created_at: row.created_at,
        }));

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ previews }),
        };

    } catch (err) {
        console.error('get-pending-previews error:', err);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Failed', detail: err.message }) };
    }
};
