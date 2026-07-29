// The Exchange — buy/sell surplus + ask-for-help board
// Posting is gated: only businesses already claimed = true in b2b_businesses
// (onboarded/paying, same signal used across this app) can post. Checked here,
// not just in the frontend, so the gate can't be skipped with a raw fetch call.
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
        const { business_slug, post_type, title, description, category, contact_override } = JSON.parse(event.body);

        if (!business_slug || !post_type || !title) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'business_slug, post_type, and title are required' }) };
        }
        if (!['for_sale', 'wanted', 'help_request'].includes(post_type)) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'post_type must be for_sale, wanted, or help_request' }) };
        }

        const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SERVICE_KEY) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Service key not configured — check Netlify env vars' }) };
        }

        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo';
        const apiKey = ANON_KEY;
        const authKey = SERVICE_KEY.trim();

        // Premium gate: business must already exist and be claimed (onboarded/paying)
        const lookupRes = await fetch(
            `${SUPABASE_URL}/rest/v1/b2b_businesses?slug=eq.${encodeURIComponent(business_slug)}&select=slug,name,claimed,active`,
            { headers: { 'apikey': apiKey, 'Authorization': `Bearer ${authKey}` } }
        );
        const matches = await lookupRes.json();
        const business = Array.isArray(matches) ? matches[0] : null;

        if (!business || !business.active) {
            return { statusCode: 404, headers, body: JSON.stringify({ error: 'Business not found in the B2B directory' }) };
        }
        if (!business.claimed) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'The Exchange is a premium perk for onboarded businesses — WhatsApp Doc to claim your profile first.' }) };
        }

        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/b2b_exchange`, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Authorization': `Bearer ${authKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                business_slug,
                business_name: business.name,
                post_type,
                title: title.trim(),
                description: description?.trim() || null,
                category: category?.trim() || null,
                contact_override: contact_override?.trim() || null,
                active: true,
                resolved: false
            })
        });

        if (!insertRes.ok) {
            const errText = await insertRes.text();
            console.error('Supabase insert error:', insertRes.status, errText);
            return { statusCode: 500, headers, body: JSON.stringify({ error: `DB error ${insertRes.status}`, detail: errText }) };
        }

        const record = await insertRes.json();
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, record: record[0] }) };

    } catch (error) {
        console.error('create-exchange-post error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Post creation failed', detail: error.message }) };
    }
};
