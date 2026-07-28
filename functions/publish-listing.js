// Motor-Oid — publish a preview listing
// Operator shows seller the watermarked preview, seller agrees, operator taps Publish.
// Verifies publish_token, updates status → active, deducts one credit (graceful fail if SQL not yet run).

const { createClient } = require('@supabase/supabase-js');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

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

    const { slug, publish_token } = body;
    if (!slug || !publish_token) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'slug and publish_token required' }) };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the preview listing
    const { data, error } = await supabase
        .from('motor_listings')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'preview')
        .single();

    if (error || !data) {
        return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Preview listing not found' }) };
    }

    // Verify the publish token
    if (!data.vehicle?.publish_token || data.vehicle.publish_token !== publish_token) {
        return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid publish token' }) };
    }

    // Clean the vehicle JSON — remove internal tokens before going live
    const updatedVehicle = { ...data.vehicle };
    const operatorSlug = updatedVehicle.operator_slug || null;
    delete updatedVehicle.publish_token;
    delete updatedVehicle.operator_slug;

    // Publish the listing
    const { error: updateError } = await supabase
        .from('motor_listings')
        .update({ status: 'active', vehicle: updatedVehicle })
        .eq('slug', slug);

    if (updateError) {
        console.error('Publish update error:', updateError);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Failed to publish listing' }) };
    }

    // Deduct one credit from the operator — graceful fail (SQL may not be run yet)
    if (operatorSlug) {
        try {
            await supabase.rpc('deduct_credit', { p_operator_slug: operatorSlug });
        } catch (e) {
            console.warn('Credit deduction skipped (deduct_credit not yet available):', e.message);
        }
    }

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            success: true,
            url: `https://motor-oid.co.uk/listing/${slug}`,
        }),
    };
};
