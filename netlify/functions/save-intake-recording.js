// Intake voice recording upload — saves audio blob to Supabase Storage
// Called from intake pages after each recorded question
// Requires SUPABASE_SERVICE_ROLE_KEY env var in Netlify

const SUPABASE_URL = 'https://pdnjeynugptnavkdbmxh.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo';

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
        const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SERVICE_KEY) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Service key not configured' }) };
        }

        const { slug, questionIndex, mode, lang, audioBase64, durationSeconds, mimeType } = JSON.parse(event.body);

        if (!slug || audioBase64 === undefined) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'slug and audioBase64 required' }) };
        }

        // Decode base64 audio
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const ext = (mimeType || 'audio/webm').includes('mp4') ? 'mp4' : 'webm';
        const timestamp = Date.now();
        const label = mode === 'free' ? 'free' : `q${questionIndex}`;
        const filePath = `${slug}/${timestamp}-${label}.${ext}`;

        // Upload to Supabase Storage bucket: intake-recordings
        const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/intake-recordings/${filePath}`,
            {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_KEY.trim(),
                    'Authorization': `Bearer ${SERVICE_KEY.trim()}`,
                    'Content-Type': mimeType || 'audio/webm',
                    'x-upsert': 'true'
                },
                body: audioBuffer
            }
        );

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            const statusCode = uploadRes.status;
            console.error(`Storage upload failed (${statusCode}):`, err);
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Storage upload failed', supabaseStatus: statusCode, detail: err }) };
        }

        // Log the recording in intake_sessions table
        const logRes = await fetch(
            `${SUPABASE_URL}/rest/v1/intake_sessions`,
            {
                method: 'POST',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY.trim()}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    slug,
                    file_path: filePath,
                    question_index: questionIndex ?? null,
                    mode: mode || 'interview',
                    lang: lang || 'en',
                    duration_seconds: durationSeconds || null,
                    created_at: new Date().toISOString()
                })
            }
        );

        // Log failure is non-fatal — storage upload is what matters
        if (!logRes.ok) {
            console.warn('intake_sessions log failed (non-fatal):', await logRes.text());
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true, filePath })
        };

    } catch (err) {
        console.error('save-intake-recording error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
