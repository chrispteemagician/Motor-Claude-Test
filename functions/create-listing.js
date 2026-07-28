// Motor-Oid The Walkround — create a vehicle listing
// Receives: { vehicle, frames, videoUrl, videoStoragePath, price, contactPhone, contactEmail, socialHooks, listingHeadline }
// Returns:  { slug, url, deleteToken }

const { createClient } = require('@supabase/supabase-js');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

function generateSlug() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateToken() {
    return Array.from({ length: 24 }, () => Math.random().toString(36)[2] || '0').join('');
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Supabase not configured' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const {
        vehicle,
        frames,
        videoUrl,
        videoStoragePath,
        price,
        contactPhone,
        contactEmail,
        socialHooks,
        listingHeadline,
        disclosureText,
        trafficLight,
        w3wLocation,
        is_preview,
        operator_slug,
        lat,
        lng,
    } = body;

    if (!vehicle) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'vehicle data required' }) };
    }

    // Embed disclosure + location into vehicle JSON (no schema change needed)
    if (disclosureText) vehicle.disclosure_text = disclosureText;
    if (trafficLight)   vehicle.traffic_light   = trafficLight;
    if (w3wLocation)    vehicle.w3w_location    = w3wLocation;
    if (lat != null)    vehicle.lat             = lat;
    if (lng != null)    vehicle.lng             = lng;

    const slug = generateSlug();
    const deleteToken = generateToken();

    // Operator preview mode — embed publish token in vehicle JSON so no schema change needed
    const publishToken = is_preview ? generateToken() : null;
    if (publishToken) {
        vehicle.publish_token = publishToken;
        if (operator_slug) vehicle.operator_slug = operator_slug;
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase.from('motor_listings').insert({
            slug,
            delete_token: deleteToken,
            vehicle,
            frames: frames || [],
            video_url: videoUrl || null,
            video_storage_path: videoStoragePath || null,
            price: price || null,
            contact_phone: contactPhone || null,
            contact_email: contactEmail || null,
            social_hooks: socialHooks || [],
            listing_headline: listingHeadline || null,
            status: is_preview ? 'preview' : 'active',
        });

        if (error) {
            console.error('Supabase insert error:', error);
            return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Failed to save listing', detail: error.message }) };
        }

        const listingUrl = `https://motor-oid.co.uk/listing/${slug}`;

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                slug,
                url: listingUrl,
                deleteToken,
                ...(publishToken ? { publishToken } : {}),
            }),
        };

    } catch (err) {
        console.error('create-listing error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Failed to create listing', detail: err.message }),
        };
    }
};
