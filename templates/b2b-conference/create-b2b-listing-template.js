// {{SITE_NAME}} — B2B Listing Creator
// Generated from cannabin-oid template — Mary Jane Berlin 2026 pattern
// Instant Supabase write — no WhatsApp, no delay, live immediately

const SUPABASE_URL = 'https://pdnjeynugptnavkdbmxh.supabase.co';
const SUPABASE_TABLE = '{{SUPABASE_TABLE}}'; // e.g. 'magic_b2b', 'sail_b2b', 'b2b_businesses'

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    try {
        const { name, category, country, city, website, contact_email, description, freebies, b2b_needs, b2b_offers, expo_ref } = JSON.parse(event.body);

        if (!name || !category || !country) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'name, category, and country are required' }) };
        }

        const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SERVICE_KEY) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Service key not configured' }) };
        }

        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const checkRes = await fetch(
            `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?slug=eq.${encodeURIComponent(baseSlug)}&select=slug`,
            { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
        );
        const existing = await checkRes.json();
        const slug = existing.length > 0 ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
            method: 'POST',
            headers: {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                slug,
                name: name.trim(),
                category,
                country: country.toLowerCase().trim(),
                city: city?.trim() || null,
                website: website?.trim() || null,
                contact_email: contact_email?.trim() || null,
                description: description?.trim() || null,
                freebies: freebies?.trim() || null,
                b2b_needs: b2b_needs?.trim() || null,
                b2b_offers: b2b_offers?.trim() || null,
                expo_ref: expo_ref || '{{EVENT_REF}}',
                active: true,
                claimed: true,
                verified: false
            })
        });

        if (!insertRes.ok) {
            const errText = await insertRes.text();
            console.error('Supabase insert error:', insertRes.status, errText);
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database insert failed', detail: errText }) };
        }

        const record = await insertRes.json();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, slug, record: record[0] })
        };

    } catch (error) {
        console.error('create-b2b-listing error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Listing creation failed', detail: error.message }) };
    }
};
