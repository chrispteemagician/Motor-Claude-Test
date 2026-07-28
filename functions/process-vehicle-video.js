// Motor-Oid The Walkround — analyse vehicle frames via Gemini
// Receives: { frames: [{timestamp, data (base64 JPEG)}], sellerNotes }
// Returns:  { vehicle, frameLabels, socialHooks, listingHeadline }

const { sanitize } = require('./ipi-sanitize');
const { SECURITY_HEADERS } = require('./gemini-secure-wrapper');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    ...SECURITY_HEADERS,
};

const ANALYSIS_PROMPT = `You are analysing frames from a 30-second vehicle walkround video to build a sale listing.

IMPORTANT — look carefully at every frame for text on paper or cards:
- WINDOW STICKERS: price cards or stickers on the glass. Read the asking price and any spec details.
- DEALER PRINTOUTS: specification sheets, often placed in the driver's door pocket, on the dashboard, or on the windscreen. These contain make, model, year, mileage, engine size, fuel, transmission, features, colour, registration, and asking price. This is high-value data — read every word.
- ANY VISIBLE TEXT on the vehicle or attached to it. If you can read it, extract it.

Return ONLY valid JSON — no markdown, no explanation — in this exact structure:

{
  "vehicle": {
    "make": "",
    "model": "",
    "year": "",
    "trim": "",
    "colour": "",
    "mileage": "",
    "fuel_type": "",
    "transmission": "",
    "body_type": "",
    "doors": "",
    "interior_colour": "",
    "tech_features": [],
    "condition": "Excellent / Good / Fair / Poor",
    "defects": [],
    "asking_price": "",
    "uncertain_fields": []
  },
  "frame_labels": [
    { "index": 0, "label": "Front 3/4 view", "include": true },
    { "index": 1, "label": "Driver side", "include": true }
  ],
  "social_hooks": [
    "Hook 1 — specific to this car, buyer-focused",
    "Hook 2",
    "Hook 3"
  ],
  "listing_headline": "2019 Ford Focus ST-Line — one owner, full service history"
}

RULES:
- asking_price: extract from window sticker or dealer printout if visible. Include £ symbol. Leave blank if not found.
- frame_labels: label every frame. Set include=false for blurry, duplicated, or unhelpful frames. Keep 6-10 of the best.
- defects: list actual damage, wear, or mechanical issues only. Do NOT list dirt, dust, mud, water marks, or any temporary surface condition — these are not defects. Buyers trust honest sellers.
- uncertain_fields: list anything you could not determine.
- social_hooks: short, honest, specific. Not generic used-car waffle.
- listing_headline: year + make + model + the single most compelling fact.`;

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { frames, sellerNotes } = body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'frames array required' }) };
    }

    if (sellerNotes) {
        const s = sanitize(sellerNotes, 'sellerNotes');
        if (s.highRisk) {
            return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Request blocked.' }) };
        }
    }

    try {
        const parts = [];

        // Add all frames as inline images
        for (const frame of frames.slice(0, 14)) {
            if (frame.data) {
                parts.push({
                    inline_data: { mime_type: 'image/jpeg', data: frame.data }
                });
            }
        }

        let prompt = ANALYSIS_PROMPT;
        if (sellerNotes) {
            prompt += `\n\nSELLER'S NOTES (use to fill gaps or confirm uncertain fields):\n${sellerNotes}`;
        }
        parts.push({ text: prompt });

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://www.feelfamous.co.uk/',
                },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 8192,
                        responseMimeType: 'application/json',
                        thinkingConfig: { thinkingBudget: 0 },
                    },
                }),
            }
        );

        if (!geminiResponse.ok) {
            const err = await geminiResponse.text();
            console.error('Gemini error:', err);
            return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Gemini analysis failed', detail: err }) };
        }

        const geminiData = await geminiResponse.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.find(p => p.text && !p.thought)?.text || '';

        if (!rawText) {
            return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Empty response from Gemini' }) };
        }

        let result;
        try {
            result = JSON.parse(rawText);
        } catch (e) {
            const match = rawText.match(/\{[\s\S]*\}/);
            if (match) {
                result = JSON.parse(match[0]);
            } else {
                return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Could not parse Gemini response' }) };
            }
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };

    } catch (err) {
        console.error('process-vehicle-video error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Processing failed — try again', detail: err.message }),
        };
    }
};
