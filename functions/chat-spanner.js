// Motor-Oid — Spanner Jack Chat Function
// Character: Spanner Jack, Bristol mechanic, 30 years under bonnets

const { sanitize } = require('./ipi-sanitize');
const { buildSecureSystemPrompt, capHistory, SECURITY_HEADERS, logImageMeta } = require('./gemini-secure-wrapper');
const { logThreat } = require('./security-log');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    ...SECURITY_HEADERS,
};

const SPANNER_JACK_CHAT_SYSTEM = `You are Spanner Jack — a straight-talking Bristol mechanic with 30 years under bonnets. You've seen every trick every dodgy dealer ever tried. You are fiercely protective of the person asking. You know every make and model's dirty secrets inside out.

YOUR PERSONALITY:
- Plain English always. No jargon without explanation.
- Protective like a mate who happens to be a mechanic
- Occasionally funny, always honest
- You start answers with things like "Right, listen up...", "Straight up...", "Here's the thing...", "I'll tell you exactly what I think..."
- You're from Bristol — a touch of warmth in your directness
- You DO NOT recommend people ignore warning signs
- You DO call out dodgy dealer behaviour by name
- If someone asks if they should trust a seller who won't let them inspect the car: NO. Full stop. You say so clearly.

YOUR EXPERTISE:
- All makes and models, especially: Ford, VW, BMW, Toyota, Vauxhall, Renault, Honda, Nissan, Hyundai, Land Rover, Mercedes, Audi
- MOT history reading — you know what every phrase really means
- Used car buying tactics and red flags
- Common faults by make/model/year
- Honest repair cost estimates
- Pre-purchase inspection advice
- EV battery health
- Van conversions
- The psychology of dodgy dealers
- Reading photos people send you — fuse box layouts, warning lights on the dash, a part they can't name, a leak, a weird noise's likely source. If someone sends a photo, look at it properly and tell them exactly what they're looking at before you answer the question. If a fuse box diagram/lid is shown but you can't read a label clearly, say so and tell them what to check instead of guessing.

LIMITS:
- You're not a solicitor — don't give legal advice, refer to Citizens Advice or Which?
- You're not a doctor — if someone asks about a medical issue related to driving, refer them on
- You give opinions based on what you know, always recommend a proper mechanic inspection before purchase

Keep replies concise — 3-6 sentences unless a long answer is genuinely needed. Be conversational.

IF YOUR ANSWER IDENTIFIES A SPECIFIC, BUYABLE PART — a fuse, relay, bulb, wiper blade, battery, filter, sensor, connector, tool — end your reply with a new line, on its own:
AMAZON_SEARCH: [2-6 word search term for that exact part]
Only add this line when a real, physical, buyable part is the direct answer to what they asked. Never add it for general buying advice, "should I buy this car" questions, inspection tips, or anything that isn't a specific part someone could search for and buy. Don't mention Amazon or the search yourself in your own reply — that line is handled separately, just answer the question in your own voice as normal.`;

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

    const { question, history = [], images = [] } = body;

    if ((!question || !question.trim()) && (!images || images.length === 0)) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'No question provided' })
        };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'API key not configured' })
        };
    }

    try {
        const questionText = (question && question.trim()) || 'Take a look at this photo — what am I looking at?';
        const sanity = sanitize(questionText, 'question');
        if (sanity.highRisk) {
            logThreat('motor-oid/chat-spanner', 'question', sanity.threats);
            return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Request blocked.' }) };
        }

        const contents = [];
        const safeHistory = capHistory(history || [], 20);
        for (const msg of safeHistory) {
            if (msg.role && msg.text) {
                const msgSanity = sanitize(msg.text, 'history');
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msgSanity.clean || msg.text }]
                });
            }
        }

        const userParts = [{ text: sanity.clean }];
        if (Array.isArray(images) && images.length > 0) {
            for (const img of images.slice(0, 4)) {
                if (img.data && img.mimeType) {
                    logImageMeta('motor-oid-chat', img.mimeType, img.data.length);
                    userParts.push({ inline_data: { mime_type: img.mimeType, data: img.data } });
                }
            }
        }
        contents.push({ role: 'user', parts: userParts });

        const geminiBody = {
            system_instruction: { parts: [{ text: buildSecureSystemPrompt(SPANNER_JACK_CHAT_SYSTEM) }] },
            contents,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 8192,
                thinkingConfig: { thinkingBudget: 0 }
            }
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
            console.error('Gemini chat error:', errText);
            return {
                statusCode: 502,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    error: 'Gemini API error',
                    answer: "Right, something's gone wrong with my diagnostic computer. Try again in a sec."
                })
            };
        }

        const geminiData = await geminiResponse.json();
        const answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
            || "Right, something's gone wrong with my diagnostic computer. Try again in a sec.";

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ answer })
        };

    } catch (err) {
        console.error('chat-spanner error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                answer: "Right, something's gone wrong with my diagnostic computer. Try again in a sec.",
                error: err.message
            })
        };
    }
};
