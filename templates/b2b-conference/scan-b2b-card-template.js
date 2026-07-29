// {{SITE_NAME}} — B2B Business Card Scanner
// Generated from cannabin-oid template — Mary Jane Berlin 2026 pattern
// Point phone at a business card at {{CURRENT_EVENT}}. It fills the form. One tap.

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
        const { image } = JSON.parse(event.body);
        if (!image) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No image provided' }) };

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };

        // {{SCANNER_CONTEXT}} — Replace with industry-specific category descriptions
        // Example for cannabis: "seedbank = seed banks/breeders, club = CSCs/dispensaries, cultivationtech = grow tech/vaporizers, compliancetech = legal/clinics"
        const prompt = `You are a business card reader for a {{INDUSTRY_LABEL}} B2B directory.

This could be a business card, booth display, flyer, badge, lanyard, or any printed material from a {{INDUSTRY_LABEL}} expo.

Extract these fields:
- business_name: The company or organisation name
- category: One of exactly these values only: {{CATEGORY_VALUES_QUOTED}} — pick the closest match.
  {{CATEGORY_SCANNER_HINTS}}
- country: The country they are based in (full name, e.g. "Germany", "Spain", "UK")
- city: Their city or region
- contact: Their email address or phone number (prefer email if both present)
- website: Their website URL

Rules:
- If you cannot read a field clearly, use null
- Return ONLY valid JSON, nothing else
- For category, make your best guess — do not use null, always pick one of the values

{"business_name": "...", "category": "...", "country": "...", "city": "...", "contact": "...", "website": "..."}`;

        const maxRetries = 5;
        let response;
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { inline_data: { mime_type: 'image/jpeg', data: image } },
                                    { text: prompt }
                                ]
                            }],
                            generationConfig: { temperature: 0.1, maxOutputTokens: 512 }
                        })
                    }
                );

                if (response.ok) break;

                if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, Math.pow(2, attempt + 1) * 1000));
                    continue;
                }

                const errText = await response.text();
                console.error('Gemini scan error:', response.status, errText);
                return { statusCode: 500, headers, body: JSON.stringify({ error: 'Card scan failed' }) };

            } catch (fetchError) {
                lastError = fetchError;
                if (attempt < maxRetries) await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
            }
        }

        if (!response || !response.ok) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Card scan failed after retries', details: lastError?.message }) };
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.find(p => p.text && !p.thought)?.text
                  || data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) return { statusCode: 200, headers, body: JSON.stringify({ error: 'Could not read card' }) };

        let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        let result;
        try {
            result = JSON.parse(cleaned);
        } catch {
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match) result = JSON.parse(match[0]);
            else return { statusCode: 200, headers, body: JSON.stringify({ error: 'Could not parse card data' }) };
        }

        return {
            statusCode: 200, headers,
            body: JSON.stringify({
                business_name: result.business_name || null,
                category: result.category || null,
                country: result.country || null,
                city: result.city || null,
                contact: result.contact || null,
                website: result.website || null
            })
        };

    } catch (error) {
        console.error('Scan card error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Card scan failed', details: error.message }) };
    }
};
