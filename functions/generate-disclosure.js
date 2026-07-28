// Motor-Oid — Honest Disclosure Generator
// Spanner Jack reads MOT data + seller defects → traffic light + disclosure text

const { SECURITY_HEADERS } = require('./gemini-secure-wrapper');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    ...SECURITY_HEADERS,
};

const SAFETY_KEYWORDS = ['brake', 'steering', 'engine', 'gearbox', 'clutch', 'suspension', 'unsafe', 'dangerous', 'airbag', 'seatbelt', 'tyre'];

function calcTrafficLight(motData, declaredDefects) {
    const tests = (motData && motData.motTests) || [];
    const latest = tests[0];
    const defectsText = (declaredDefects || '').toLowerCase();

    const hasSafetyDefect = SAFETY_KEYWORDS.some(k => defectsText.includes(k));

    if (latest && latest.testResult === 'FAILED') {
        return { light: 'red', reason: 'Most recent MOT was a failure. Issues fully disclosed.' };
    }
    if (hasSafetyDefect) {
        return { light: 'red', reason: 'Seller has disclosed safety-relevant issues. Disclosed at time of sale.' };
    }

    const latestDefects = (latest && latest.defects) || [];
    const hasFailItem = latestDefects.some(d => d.type === 'FAIL' || d.type === 'DANGEROUS');
    if (hasFailItem) {
        return { light: 'red', reason: 'MOT record includes unresolved failure items. Review full history.' };
    }

    const hasAdvisories = latestDefects.some(d => ['ADVISORY', 'MINOR', 'USER_ENTERED'].includes(d.type));
    const hasDeclaredDefects = (declaredDefects || '').trim().length > 0;

    let expiryWarning = false;
    if (latest && latest.expiryDate) {
        const daysLeft = (new Date(latest.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysLeft < 90) expiryWarning = true;
    }

    if (hasAdvisories || hasDeclaredDefects || expiryWarning) {
        const parts = [];
        if (hasAdvisories) parts.push('MOT advisories noted');
        if (hasDeclaredDefects) parts.push('seller has declared known issues');
        if (expiryWarning) parts.push('MOT expires within 90 days');
        return { light: 'amber', reason: parts.join('; ') + '. Disclosed at time of sale.' };
    }

    if (!latest) {
        return { light: 'amber', reason: 'No MOT data available — buyer should request certificate before purchase.' };
    }

    return { light: 'green', reason: 'MOT passed with no advisories. No defects declared by seller.' };
}

function buildPrompt(motData, declaredDefects, vehicle, trafficLight, trafficReason) {
    const tests = (motData && motData.motTests) || [];
    const latest = tests[0];
    const vehicleStr = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'this vehicle';

    let motSummary = 'No DVSA MOT data available.';
    if (latest) {
        const expiry = latest.expiryDate
            ? new Date(latest.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'unknown';
        const tested = new Date(latest.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const miles = latest.odometerValue ? parseInt(latest.odometerValue).toLocaleString() + ' miles' : 'mileage unknown';
        const defectNotes = (latest.defects || []).map(d => `${d.type}: ${d.text}`).join('; ') || 'none';
        motSummary = `Latest MOT: ${latest.testResult} on ${tested} at ${miles}. Valid until ${expiry}. Notes: ${defectNotes}. Total tests on record: ${tests.length}.`;
    }

    return `You are Spanner Jack — 30 years under bonnets in Bristol. Straight-talking, honest, protective of buyers.

Write ONE short honest disclosure paragraph (3–5 sentences) for a private car sale listing.

Vehicle: ${vehicleStr}
MOT data: ${motSummary}
Seller-declared defects: ${declaredDefects || 'None declared'}
Transparency rating: ${trafficLight.toUpperCase()} — ${trafficReason}

RULES:
- Include the phrase "disclosed at time of sale" naturally in the text
- Reference actual MOT facts if available (dates, mileage, advisories)
- Reference seller-declared defects honestly if any
- Tone: direct, factual, no fluff. This is a legal protection document, not marketing copy.
- End with one sentence about why honest disclosure benefits both seller and buyer.
- Return ONLY the paragraph. No labels, no JSON, no markdown.`;
}

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

    const { motData, declaredDefects, vehicle } = body;
    const { light, reason } = calcTrafficLight(motData, declaredDefects);
    const prompt = buildPrompt(motData, declaredDefects, vehicle || {}, light, reason);

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://www.feelfamous.co.uk/',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 1024, thinkingConfig: { thinkingBudget: 0 } },
                }),
            }
        );

        if (!geminiResponse.ok) {
            throw new Error(`Gemini error: ${geminiResponse.status}`);
        }

        const geminiData = await geminiResponse.json();
        const disclosureText = geminiData?.candidates?.[0]?.content?.parts?.find(p => p.text && !p.thought)?.text?.trim() || '';

        if (!disclosureText) throw new Error('Empty response from Gemini');

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ trafficLight: light, trafficReason: reason, disclosureText }),
        };

    } catch (err) {
        // Fallback disclosure if Gemini unavailable
        const v = vehicle || {};
        const vStr = [v.year, v.make, v.model].filter(Boolean).join(' ') || 'This vehicle';
        const fallback = `${vStr} is offered for sale with full seller disclosure. ${declaredDefects ? `The following has been declared at time of sale: ${declaredDefects}. ` : 'No defects have been declared by the seller. '}All known information has been disclosed at time of sale. An honest seller gives every buyer the confidence to buy with their eyes open.`;

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ trafficLight: light, trafficReason: reason, disclosureText: fallback }),
        };
    }
};
