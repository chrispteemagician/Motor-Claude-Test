// Motor-Oid — private sale valuation via Gemini
// Receives: { make, model, year, mileage, condition, service_history, selling_points, known_issues }
// Returns:  { vehicle_title, realistic_range, best_case_range, best_case_note, fix_tips, market_note, worth_listing }

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'API key not configured' }) };

    let body;
    try { body = JSON.parse(event.body); }
    catch (e) { return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

    const { make, model, year, mileage, condition, service_history, selling_points, known_issues } = body;
    if (!make || !model || !year) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'make, model and year required' }) };
    }

    const prompt = `You are Spanner Jack — a UK private car market expert with 30 years under bonnets in Bristol. Give a realistic private sale price estimate for the UK market. Be honest and specific.

Vehicle: ${year} ${make} ${model}
Mileage: ${mileage || 'not stated'}
Condition: ${condition || 'not stated'}
Service history: ${service_history || 'not stated'}
What's right with it (seller's words): ${selling_points || 'none stated'}
Known issues: ${known_issues || 'none stated'}

Return ONLY valid JSON — no markdown, no explanation:

{
  "vehicle_title": "${year} ${make} ${model}",
  "realistic_range": "£X,XXX–£X,XXX",
  "best_case_range": "£X,XXX–£X,XXX",
  "best_case_note": "One short sentence — what gets best case price",
  "fix_tips": [
    { "fix": "What to fix", "value_add": "How much this adds or saves on sale price" }
  ],
  "market_note": "One honest sentence on how this make/model/year sells in the UK right now",
  "worth_listing": true
}

RULES:
- realistic_range: what it will actually sell for privately in its current stated condition — be realistic, not optimistic
- best_case_range: factor in both the selling points the seller mentioned AND what cleaning/minor fixes would add. Higher than realistic if the positives are genuine.
- fix_tips: specific to issues mentioned or common known faults for this car. Max 3 tips. Empty array [] if none. Selling points are not tips — only include things to fix or improve.
- market_note: specific to this car, not generic. Mention demand, common buyer concerns, anything relevant.
- worth_listing: set false only if car is realistically scrap or under £300 value
- UK private sale prices only. Sterling (£).`;

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Referer': 'https://www.feelfamous.co.uk/' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 8192, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
                }),
            }
        );

        if (!res.ok) {
            const err = await res.text();
            return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Gemini failed', detail: err }) };
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.find(p => p.text && !p.thought)?.text || '';

        if (!rawText) return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Empty response from Gemini' }) };

        let result;
        try { result = JSON.parse(rawText); }
        catch (e) {
            const match = rawText.match(/\{[\s\S]*\}/);
            if (match) result = JSON.parse(match[0]);
            else return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Could not parse response' }) };
        }

        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(result) };

    } catch (err) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
    }
};
