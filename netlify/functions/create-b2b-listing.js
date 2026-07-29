// B2B Conference Mode — instant listing creation in Supabase
// Called from b2b-conference.html — no WhatsApp, no 24h delay
// Requires SUPABASE_SERVICE_ROLE_KEY env var in Netlify

const SUPABASE_URL = 'https://pdnjeynugptnavkdbmxh.supabase.co';

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
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Service key not configured — check Netlify env vars' }) };
        }

        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo';

        // apikey header = anon key (API gateway auth)
        // Authorization Bearer = service key (bypasses RLS for writes)
        const apiKey = ANON_KEY;
        const authKey = SERVICE_KEY.trim();

        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const checkRes = await fetch(
            `${SUPABASE_URL}/rest/v1/b2b_businesses?slug=eq.${encodeURIComponent(baseSlug)}&select=slug`,
            { headers: { 'apikey': apiKey, 'Authorization': `Bearer ${authKey}` } }
        );
        const existing = await checkRes.json();
        const slug = Array.isArray(existing) && existing.length > 0 ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/b2b_businesses`, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Authorization': `Bearer ${authKey}`,
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
                expo_ref: expo_ref || 'maryjane26',
                active: true,
                claimed: true,
                verified: false
            })
        });

        if (!insertRes.ok) {
            const errText = await insertRes.text();
            console.error('Supabase insert error:', insertRes.status, errText);
            return { statusCode: 500, headers, body: JSON.stringify({ error: `DB error ${insertRes.status}`, detail: errText }) };
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
