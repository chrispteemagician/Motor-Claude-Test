// Motor-Oid — Spanner Jack Vehicle Analysis
// Handles: text analysis, MOT history, images, AND audio

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

const SPANNER_JACK_CORE = `You are Spanner Jack, a straight-talking Bristol mechanic with 30 years under bonnets. You've seen every trick every dodgy dealer ever tried. You are fiercely protective of the person asking. You know every make and model's dirty secrets. You speak in plain English, no jargon without explanation.

YOUR MISSION: Protect this person's money and safety. That's it.

ANALYSE THE PROVIDED VEHICLE DATA and return your analysis in this EXACT format:

VERDICT: [GO FOR IT | PROCEED WITH CAUTION | WALK AWAY]

SUMMARY:
[2-3 sentences, plain English, the key reason for your verdict]

RED FLAGS:
- [each flag on its own line, be specific, quote the MOT language if relevant]
- [if none, say "No significant red flags found — but don't skip the pre-purchase inspection"]

GREEN FLAGS:
- [things that genuinely support buying this vehicle]
- [honest positives only]

ASK THEM THIS:
1. [exact question to ask/text to seller]
2. [another question]
(minimum 3, maximum 8)

CHECK AT THE VIEWING:
- [specific things to physically inspect]
- [ALWAYS include: cold start, listen for rattles, check all 4 tyre edges for inner wear, open and close every door, check under every carpet edge for rust/damp, check spare wheel well for water]

SPANNER JACK SAYS:
[One short, direct closing remark in Jack's voice — funny or firm depending on verdict]

---

CRITICAL RULES:
- Underseal on MOT = assume they're hiding rust. Say this clearly.
- "No rust" in seller description + corrosion in MOT = WALK AWAY or PROCEED WITH EXTREME CAUTION
- Structural corrosion failures = always flag as potential WALK AWAY
- A fail then pass next day = panic repair, not proper fix
- "Welding done for last MOT" = structural weakness was there, may still be
- Never be namby-pamby. This person's safety depends on your honesty.`;

const AUDIO_PROMPT = `You are Spanner Jack listening to an engine recording.
Analyse the audio for:
- Knocking (bottom end = serious, top end = possibly valves/tappets)
- Rattling on cold start (timing chain — SERIOUS on many modern engines)
- Ticking (often tappets, usually adjustable but check)
- Diesel rattle (normal on cold diesel, concerning if continues when warm)
- Hissing (vacuum leak, head gasket concern)
- Rumbling (wheel bearing or diff)
- Squealing (belt, brakes)
- Any unusual rhythm or pattern

Return in this format:
WHAT I HEAR: [description]
LIKELY CAUSE: [one or two most likely explanations]
SEVERITY: [Minor / Worth Investigating / Serious — Don't Buy Without Mechanic Check]
ASK THEM THIS: [specific question about this sound]
SPANNER JACK SAYS: [one-liner]`;

const PERSONA_ADDONS = {
    petrolhead: `\n\nPERSONA MODE — PETROL HEAD: Focus on engine health, timing chains, gearbox condition, potential issues for track/spirited driving, modifications done properly or bodged, running costs for performance variants. Note any signs of previous hard driving, track use, or boy-racer modifications that weren't done properly.`,
    daily: `\n\nPERSONA MODE — DAILY DRIVER: Focus on reliability, common faults for this make/model, running costs, likely upcoming bills, how many more miles it realistically has. Practical, no-nonsense. Is this a sensible buy for someone who just needs a reliable car?`,
    family: `\n\nPERSONA MODE — FAMILY FIRST: Focus on safety record, Euro NCAP rating if known, ISOFIX/child-fix points, boot space claims vs reality, tyre condition, seatbelt checks noted in MOT history. Any accident damage history is a major flag. Prioritise occupant safety above all.`,
    homeonwheels: `\n\nPERSONA MODE — HOME ON WHEELS (VAN): Focus on structural integrity — sill, chassis, roof, floor corrosion (this is critical for vans). Conversion suitability and existing conversion quality. Weight limits for the spec. Electrical system condition if converted. Roof seal integrity. Overcab bunk area if present. Wheel arch condition. Any signs of damp inside.`,
    electric: `\n\nPERSONA MODE — ELECTRIC EXPLORER: Focus on battery degradation indicators, real-world range vs claimed range, charging port condition (check for damage, compatibility), known model-specific battery issues, software/firmware update status, any battery warranty remaining, home charging setup requirements, thermal management history.`
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Invalid JSON' })
        };
    }

    const {
        sellerText,
        motHistory,
        images,
        audioData,
        audioMimeType,
        extraContext,
        persona = 'daily',
        analysisType = 'vehicle'
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'API key not configured' })
        };
    }

    try {
        // Sanitize free-text user inputs
        if (sellerText) {
            const s = sanitize(sellerText, 'sellerText');
            if (s.highRisk) {
                logThreat('motor-oid/analyze', 'sellerText', s.threats);
                return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Request blocked.' }) };
            }
        }
        if (extraContext) {
            const s = sanitize(extraContext, 'extraContext');
            if (s.highRisk) {
                logThreat('motor-oid/analyze', 'extraContext', s.threats);
                return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Request blocked.' }) };
            }
        }

        let systemPrompt;
        let parts = [];

        if (analysisType === 'audio') {
            systemPrompt = AUDIO_PROMPT + (PERSONA_ADDONS[persona] || PERSONA_ADDONS.daily);

            if (!audioData) {
                return {
                    statusCode: 400,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ error: 'No audio data provided' })
                };
            }

            const mimeType = audioMimeType || 'audio/webm';
            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: audioData
                }
            });

            if (extraContext) {
                parts.push({ text: `\n\nExtra context from the owner:\n${extraContext}` });
            }

        } else if (analysisType === 'quickcheck') {
            systemPrompt = SPANNER_JACK_CORE + (PERSONA_ADDONS[persona] || PERSONA_ADDONS.daily);

            const quickQuery = sellerText || '';
            parts.push({
                text: `QUICK CHECK REQUEST: The buyer wants to know about this make/model/vehicle:\n\n${quickQuery}\n\nGive them the known issues, what to check at viewing, and common faults. Be thorough but concise. Use the same structured format.`
            });

        } else {
            // Full vehicle analysis
            systemPrompt = SPANNER_JACK_CORE + (PERSONA_ADDONS[persona] || PERSONA_ADDONS.daily);

            let textContent = '';
            if (sellerText) textContent += `SELLER ADVERTISEMENT:\n${sellerText}\n\n`;
            if (motHistory) textContent += `MOT HISTORY (from check.mot.gov.uk):\n${motHistory}\n\n`;
            if (extraContext) textContent += `ADDITIONAL CONTEXT:\n${extraContext}\n\n`;

            if (textContent) {
                parts.push({ text: textContent });
            }

            if (images && images.length > 0) {
                parts.push({ text: `\n\nIMAGES PROVIDED (${images.length} photos). Analyse each for visible rust, accident damage, tyre condition, interior condition, any concerns visible:` });
                for (const img of images.slice(0, 6)) {
                    if (img.data && img.mimeType) {
                        logImageMeta('motor-oid', img.mimeType, img.data.length);
                        parts.push({
                            inline_data: {
                                mime_type: img.mimeType,
                                data: img.data
                            }
                        });
                    }
                }
            }

            if (!textContent && (!images || images.length === 0)) {
                return {
                    statusCode: 400,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ error: 'No vehicle data provided' })
                };
            }
        }

        const geminiBody = {
            system_instruction: { parts: [{ text: buildSecureSystemPrompt(systemPrompt) }] },
            contents: [{ parts }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } }
        };

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Referer': 'https://www.feelfamous.co.uk/' },
                body: JSON.stringify(geminiBody)
            }
        );

        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            console.error('Gemini error:', errText);
            return {
                statusCode: 502,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: 'Gemini API error', detail: errText })
            };
        }

        const geminiData = await geminiResponse.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!rawText) {
            return {
                statusCode: 502,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: 'Empty response from Gemini' })
            };
        }

        // Parse the structured response
        const parsed = parseSpannerJackResponse(rawText, analysisType);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                result: rawText,
                ...parsed
            })
        };

    } catch (err) {
        console.error('analyze-motor error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: 'Spanner Jack had a technical failure. Try again.',
                detail: err.message
            })
        };
    }
};

function parseSpannerJackResponse(text, analysisType) {
    if (analysisType === 'audio') {
        const whatIHear = extractSection(text, 'WHAT I HEAR:', ['LIKELY CAUSE:', 'SEVERITY:', 'ASK THEM THIS:', 'SPANNER JACK SAYS:']);
        const likelyCause = extractSection(text, 'LIKELY CAUSE:', ['SEVERITY:', 'ASK THEM THIS:', 'SPANNER JACK SAYS:']);
        const severity = extractSection(text, 'SEVERITY:', ['ASK THEM THIS:', 'SPANNER JACK SAYS:']);
        const askThem = extractSection(text, 'ASK THEM THIS:', ['SPANNER JACK SAYS:']);
        const jackSays = extractSection(text, 'SPANNER JACK SAYS:', []);

        return { whatIHear, likelyCause, severity, askThem, jackSays, analysisType: 'audio' };
    }

    const verdictRaw = extractSection(text, 'VERDICT:', ['SUMMARY:']);
    let verdict = 'PROCEED WITH CAUTION';
    if (verdictRaw.includes('GO FOR IT')) verdict = 'GO FOR IT';
    else if (verdictRaw.includes('WALK AWAY')) verdict = 'WALK AWAY';
    else if (verdictRaw.includes('PROCEED WITH CAUTION')) verdict = 'PROCEED WITH CAUTION';

    const summary = extractSection(text, 'SUMMARY:', ['RED FLAGS:', 'GREEN FLAGS:']);
    const redFlagsRaw = extractSection(text, 'RED FLAGS:', ['GREEN FLAGS:', 'ASK THEM THIS:']);
    const greenFlagsRaw = extractSection(text, 'GREEN FLAGS:', ['ASK THEM THIS:', 'CHECK AT THE VIEWING:']);
    const askThemRaw = extractSection(text, 'ASK THEM THIS:', ['CHECK AT THE VIEWING:', 'SPANNER JACK SAYS:']);
    const viewingRaw = extractSection(text, 'CHECK AT THE VIEWING:', ['SPANNER JACK SAYS:']);
    const jackSays = extractSection(text, 'SPANNER JACK SAYS:', []);

    return {
        verdict,
        summary: summary.trim(),
        redFlags: parseListItems(redFlagsRaw),
        greenFlags: parseListItems(greenFlagsRaw),
        questionsToAsk: parseListItems(askThemRaw),
        viewingChecklist: parseListItems(viewingRaw),
        jackSays: jackSays.trim(),
        analysisType: 'vehicle'
    };
}

function extractSection(text, startMarker, endMarkers) {
    const startIdx = text.indexOf(startMarker);
    if (startIdx === -1) return '';
    let content = text.slice(startIdx + startMarker.length);
    for (const end of endMarkers) {
        const endIdx = content.indexOf(end);
        if (endIdx !== -1) {
            content = content.slice(0, endIdx);
        }
    }
    return content.trim();
}

function parseListItems(raw) {
    if (!raw) return [];
    return raw
        .split('\n')
        .map(line => line.replace(/^[-*•\d.)\s]+/, '').trim())
        .filter(line => line.length > 0);
}
