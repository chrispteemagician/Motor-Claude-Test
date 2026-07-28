// Motor-Oid — CB Radio Photo Analysis
// Receives: { frames: [{ data: base64, mimeType: string }] }
// Returns:  { make, model, type, band, modes, channels, condition, accessories, price_estimate, description, is_uk_cb, compliance_note, listing_headline }

const { sanitize } = require('./ipi-sanitize');
const { buildSecureSystemPrompt, logImageMeta, SECURITY_HEADERS } = require('./gemini-secure-wrapper');
const { logThreat } = require('./security-log');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    ...SECURITY_HEADERS,
};

const SYSTEM_PROMPT = `You are a radio equipment expert specialising in CB radio, amateur radio, and vintage communications equipment. You identify radios accurately and honestly from photos. You know what standard UK-spec equipment looks like vs modified or non-compliant kit.

You MUST return ONLY a valid JSON object with NO markdown, NO code fences, NO extra text.

Return exactly this structure:
{
  "make": "brand name, e.g. Midland / President / Cobra / Uniden",
  "model": "model name/number",
  "type": "mobile | base | handheld | transceiver | scanner | unknown",
  "band": "27MHz CB | amateur HF | amateur VHF/UHF | PMR446 | marine | airband | other",
  "modes": "modes supported e.g. FM | AM/FM | AM/FM/SSB",
  "channels": "number of channels if visible, else null",
  "condition": "Excellent | Good | Fair | Poor",
  "accessories": "list what is visible in the photos — mic, bracket, cable, box, manual, antenna, etc. Say 'radio only' if nothing extra visible",
  "price_estimate": "realistic UK second-hand price range e.g. £30-50",
  "description": "2-3 honest sentences describing the radio and its condition based on what you can see",
  "is_uk_cb": true or false — true if this appears to be a standard 27MHz CB radio legal under UK Ofcom licence exemption,
  "compliance_note": "brief note — e.g. 'Standard UK 27MHz FM CB radio, licence-free under Ofcom' or 'This appears to be a UK CB radio. Check for any modifications before listing.'",
  "listing_headline": "concise listing title e.g. 'Midland Alan 100+ Mobile CB Radio — Good Condition'"
}

CRITICAL RULES:
- If you cannot identify the make/model, say "Unknown" — do not guess
- If the radio looks modified (extra knobs, opened case, visible wiring, power amp, non-standard connectors), set is_uk_cb to false and note it in compliance_note
- UK 27MHz CB is 40-channel FM (and sometimes AM). Standard brands: Midland, President, Cobra, Albrecht, Uniden, TTi, K-PO, Intek, CRT
- Ham radio transceivers are NOT CB radios — identify them correctly
- PMR446 handhelds are NOT CB radios — identify them correctly
- Be honest about condition — scratches, chips, missing knobs, yellowing all affect value`;

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { frames, sellerNotes } = body;

    if (!frames || frames.length === 0) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'At least one photo required' }) };
    }

    if (sellerNotes) {
        const s = sanitize(sellerNotes, 'sellerNotes');
        if (s.highRisk) {
            logThreat('motor-oid/analyze-cb', 'sellerNotes', s.threats);
            return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Request blocked.' }) };
        }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    try {
        const parts = [];

        parts.push({ text: `Analyse ${frames.length} photo(s) of this radio equipment and return the JSON as instructed.` });

        for (const frame of frames.slice(0, 6)) {
            if (!frame.data) continue;
            logImageMeta(frame.data, 'analyze-cb-radio');
            const mimeMatch = ('data:' + (frame.mimeType || 'image/jpeg')).match(/image\/[\w+.-]+/);
            const mimeType = mimeMatch ? mimeMatch[0] : 'image/jpeg';
            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: frame.data.replace(/^data:image\/[\w+.-]+;base64,/, ''),
                }
            });
        }

        if (sellerNotes) {
            parts.push({ text: `\n\nSeller notes: ${sellerNotes}` });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: buildSecureSystemPrompt(SYSTEM_PROMPT) }] },
                    contents: [{ parts }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } },
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error('Gemini error:', errText);
            return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'AI analysis failed', detail: errText }) };
        }

        const geminiData = await response.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.find(p => p.text && !p.thought)?.text || '';

        let result;
        try {
            const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
            result = JSON.parse(cleaned);
        } catch (e) {
            console.error('JSON parse failed:', rawText);
            return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Could not parse AI response', raw: rawText.slice(0, 500) }) };
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };

    } catch (err) {
        console.error('analyze-cb-radio error:', err);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
