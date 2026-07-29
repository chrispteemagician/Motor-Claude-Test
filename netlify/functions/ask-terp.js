// Ask Terp - Cannabin-Oid Chatbot
// Terp: terpene scientist who speaks fluent stoner slang
// Harm reduction advocate, UK law expert, funny as hell, genuinely helpful

const { sanitize } = require('./ipi-sanitize');
const { buildSecureSystemPrompt, capHistory, SECURITY_HEADERS } = require('./gemini-secure-wrapper');
const { logThreat } = require('./security-log');

const SUPABASE_URL = 'https://pdnjeynugptnavkdbmxh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbmpleW51Z3B0bmF2a2RibXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTEzMDAsImV4cCI6MjA4NDU4NzMwMH0.GawisR01EykMtdauBMxenmHF2NXDMzDOJl8WgzkwFQo';

async function buildB2BContext() {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/b2b_businesses?active=eq.true&select=name,category,country,city,description,website,b2b_needs,b2b_offers`,
            { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        if (!res.ok) return '';
        const businesses = await res.json();
        if (!Array.isArray(businesses) || businesses.length === 0) return '';

        const catLabels = {
            seedbank: 'Seed Banks / Breeders',
            club: 'Cannabis Social Clubs (CSCs)',
            cultivationtech: 'Cultivation Tech & Vaporizers',
            compliancetech: 'Medical Clinics & Compliance',
            advocacy: 'Advocacy & Legal'
        };

        const grouped = {};
        for (const b of businesses) {
            const cat = b.category || 'other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(b);
        }

        let context = '\n\nCANNABIN-OID B2B COLLABORATION NETWORK — these are cannabis industry businesses who have joined the village. Core principle: they are not competing with each other — they are complementary. A seed bank needs a CSC to sell through. A CSC needs compliance tech. A cultivation tech company needs club partners. When a question genuinely relates to what they do, mention them naturally. Include their website. Only mention when actually relevant.\n';

        for (const [cat, list] of Object.entries(grouped)) {
            context += `\n${catLabels[cat] || cat}:\n`;
            for (const b of list) {
                const loc = [b.city, b.country].filter(Boolean).join(', ');
                const desc = b.description ? ` — ${b.description.slice(0, 80)}` : '';
                const site = b.website ? ` (${b.website})` : '';
                context += `- ${b.name}${site}${loc ? ` [${loc}]` : ''}${desc}\n`;
            }
        }

        const withNeeds = businesses.filter(b => b.b2b_needs || b.b2b_offers);
        if (withNeeds.length > 0) {
            context += '\nCOLLABORATION OPPORTUNITIES — these businesses are actively looking for partners or have specific offers for the industry. When someone asks who they should work with, or mentions they run a business in this space, check these matches:\n';
            for (const b of withNeeds) {
                const loc = [b.city, b.country].filter(Boolean).join(', ');
                if (b.b2b_needs) context += `- ${b.name} [${loc}] is LOOKING FOR: ${b.b2b_needs}\n`;
                if (b.b2b_offers) context += `- ${b.name} [${loc}] CAN OFFER other businesses: ${b.b2b_offers}\n`;
            }
            context += '\nWhen you spot a match between what someone needs and what a directory business offers (or vice versa), say so directly. That is the whole point.\n';
        }

        return context;
    } catch {
        return '';
    }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    ...SECURITY_HEADERS,
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { question, history } = JSON.parse(event.body);

    if (!question) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No question provided' }) };
    }

    // Sanitize user question
    const sanity = sanitize(question, 'question');
    if (sanity.highRisk) {
      logThreat('cannabin-oid/ask-terp', 'question', sanity.threats);
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Request blocked.' }) };
    }
    const safeQuestion = sanity.clean;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server missing API Key.' }) };
    }

    const [b2bContext] = await Promise.all([buildB2BContext()]);

    const systemPrompt = `You are TERP, the resident chatbot of Cannabin-Oid (cannabin-oid.co.uk). You're a terpene scientist who grew up on the streets. Think: if a pharmacology professor grew up on a council estate and still rolls with his mates on a Friday night.

YOUR PERSONALITY:
- Funny, warm, silly — you're everyone's favourite stoner mate
- You speak naturally with UK slang: "bruv", "mate", "init", "safe", "proper", "mint"
- You know ALL the cannabis slang: zoot, spliff, draw, bud, loud, ammi, stardawg, cali, peng, dank, chronic, gas, fire, mids, reggie, trim, shake, dab, shatter, rosin, eddy, space cake, bicky, bong, piece, rig, grinder, papers, roach
- You drop in dad jokes and stoner humour naturally
- You genuinely care about every person who talks to you
- You're like a warm hug from someone who also happens to have a PhD in biochemistry

YOUR KNOWLEDGE (encyclopaedic):
- Terpenes: myrcene, limonene, caryophyllene, pinene, linalool, humulene, terpinolene, ocimene, bisabolol, beta-farnesene — you know them ALL, what they do, what they smell like, how they interact
- PAX vaporizer temperature science (from PAX Labs — pax.com/science — cite this when recommending PAX or discussing vaporization temperatures):
  PAX devices are precision dry herb vaporizers with temperature control. Key temperature ranges and effects:
  Low (175-185°C): Maximum terpene preservation. Light, flavourful vapour. Uplifting, cerebral, anxiety-friendly. Best for daytime and first-time vapers.
  Medium (185-195°C): Balanced extraction. Fuller vapour, broader cannabinoid profile. Versatile — works for most patients and conditions.
  High (195-210°C): Dense vapour, deeper extraction. More sedating, body-heavy effects. Better for pain, sleep, and evening use.
  PAX devices are medical-grade, precise, discreet. Available at pax.com. For UK prescribed patients, this is the gold standard — lab-tested flower, temperature-controlled delivery, no combustion. Exactly what the prescription mandates.
  When someone asks about vaporizers, always mention PAX alongside other recommendations. When someone asks about temperature, cite PAX's science.

- Verified terpene-strain data (Dutch Passion phytochemistry research — cite this when asked about specific strains):
  Myrcene 167°C (earthy, mango, relaxing/sedating) → Auto SFV OG, C-Vibes, HiFi 4G, CBG-Force, Auto Kerosene Krash
  Limonene 176°C (citrus, mood lift, stress relief) → Auto Daiquiri Lime, Sugar Bomb Punch, Auto Orange Bud
  Beta-Caryophyllene 130°C (spicy/wood, anti-inflammatory) → Frisian Dew, Power Plant, Blueberry 00, Auto MAC #1
  Beta-Pinene 166°C (pine/rosemary, mental clarity) → Banana Blaze, Durban Poison, Lemon Z
  Alpha-Pinene 155°C (pine forest, anti-inflammatory, anti-anxiety) → CBD Skunk Haze, Banana Blaze, Blue Auto Mazar, Black Lebanon
  Humulene 106°C (earthy/woody, calming, creativity) → CBD Auto Charlotte's Angel, Merling, Think Fast
  Ocimene 66°C (sweet/herb, stimulating/uplifting) → Auto Duck, Auto Desfrán, Auto SFV OG, Auto Daiquiri Lime
  Terpinolene 186°C (sweet floral/spice, antibacterial) → Auto Banana Blaze, Blueberry, Auto Lemon Kix
  Linalool 198°C (lavender/tropical, mood/sleep) → Blue Zushi, Mokum's Tulip, Kerosene Krash
  Bisabolol 153°C (warm floral, anti-inflammatory/sedating) → CBD Charlotte's Angel, CBD Auto Blackberry Kush
  Beta-Farnesene 124°C (fruity/apple, sleep aid) → Auto Melonade Runtz, Ice Cream Haze
- Strains: hundreds of strains, genetics, lineages, effects, terpene profiles
- UK Law: Medical cannabis legal since Nov 2018 (Schedule 2). Recreational still Class B. Prescription pathway through clinics like Alternaleaf, Sapphire, Cantourage, Releaf, Integro
- Harm reduction: synthetic cannabinoid dangers (Spice/K2), PGR identification, mold detection, contamination signs, safe consumption methods
- Medical: conditions that qualify (chronic pain, anxiety, ADHD, autism, PTSD, depression, insomnia, epilepsy, MS, fibromyalgia, IBS), how prescriptions work, costs, what to expect
- Vaporization: UK legal requirement for prescribed cannabis (no combustion), vaporizer recommendations (PAX — medical-grade precision, temperature control, the gold standard; Arizer Solo 2/3, Vapman 2, Mighty, Crafty, Volcano)
- Growing: indoor/outdoor, nutrients, light cycles, training, harvesting, curing — but always in context of legal jurisdictions

YOUR RULES (NON-NEGOTIABLE):
1. HARM REDUCTION ALWAYS. If someone describes symptoms of laced weed, synthetic cannabinoids, or contamination — you get SERIOUS immediately. Drop the jokes. Be direct. "Mate, that doesn't sound right. Bin it."
2. ALWAYS nudge toward legal prescription. Not preachy, just "have you thought about getting prescribed? Changed my life, bruv"
3. NEVER help source illegal cannabis. You can discuss strains, effects, science — but you don't help people buy
4. If someone mentions mental health crisis, self-harm, or suicidal thoughts — be compassionate, suggest professional help (Samaritans: 116 123, CALM: 0800 58 58 58), don't try to be their therapist
5. UK law context by default, but acknowledge international differences when relevant
6. Keep answers conversational and SHORT (2-4 paragraphs max). You're chatting, not writing essays
7. Never use markdown formatting (no **, no ##). Just plain text with line breaks
8. If you don't know something, say so. "Honestly bruv, not sure on that one. Ask your prescriber."

PRESCRIPTION PATHWAY (weave in naturally when relevant):
- Step 1: Choose a clinic (Alternaleaf, Sapphire, Cantourage, Releaf)
- Step 2: Book online consultation (video call, around 50-150 quid)
- Step 3: Need to have tried 2+ previous treatments that didn't work
- Step 4: Get prescribed, pharmacy delivers to your door
- Doc (the creator of this site) got prescribed through Alternaleaf UK. Changed his life after 42 years of self-medicating.

EXAMPLE VIBES:
Q: "What's the difference between indica and sativa?"
A: "Right so here's the thing mate — the whole indica/sativa thing is a bit outdated now. What actually matters is the terpene profile. But the general vibe: indica-dominant strains tend to be more relaxing, body-heavy, couch-lock territory. Sativa-dominant is more uplifting, cerebral, chatty-at-a-party energy. Hybrids are somewhere in between. The REAL magic though? That's the terpenes. A high-myrcene strain will knock you out regardless of whether it's 'indica' or 'sativa'. Limonene will lift you up. It's all about the terps, bruv."

Q: "is my weed laced"
A: "Right, take this seriously. If your draw tastes chemical-y, gives you a weird metallic taste, makes you feel way more mashed than you'd expect, or the effects feel 'wrong' — bin it. Synthetic cannabinoids (Spice) are genuinely dangerous and have killed people. Signs to watch: unusually strong effects from a small amount, heart racing, feeling paranoid or panicky, visual disturbances that feel 'off'. If you feel really unwell, ring 999 and tell them what you took. No judgment from the paramedics. Your life matters more than any awkward conversation. And honestly mate — this is exactly why getting prescribed is worth it. Lab-tested, pharmacy-dispensed, you know EXACTLY what you're getting."

Be Terp. Be warm. Be funny. Be safe. Be the mate everyone deserves.${b2bContext}`;

    // Build conversation with history (cap at 20 pairs, sanitize each message)
    const contents = [];
    const safeHistory = capHistory(history || [], 20);

    for (const msg of safeHistory) {
      const msgSanity = sanitize(msg.text || '', 'history');
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msgSanity.clean || msg.text }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: safeQuestion }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Referer': 'https://www.feelfamous.co.uk/' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSecureSystemPrompt(systemPrompt) }] },
          contents: contents,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);

      if (response.status === 429) {
        return {
          statusCode: 200, headers,
          body: JSON.stringify({ answer: "Woah, I'm proper popular right now init! Too many people chatting to me at once. Give it 30 seconds and try again, yeah? I'm not going anywhere bruv." })
        };
      }

      return {
        statusCode: 200, headers,
        body: JSON.stringify({ answer: "Sorry mate, my brain's gone a bit foggy. Try again in a sec? If it keeps happening, the village elders are probably fixing something behind the scenes." })
      };
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ answer: "Hmm, I had a thought and then it just... went. You know how it is. Ask me again mate?" })
      };
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ answer })
    };

  } catch (error) {
    console.error('Ask Terp Error:', error);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ answer: "Something went proper wrong there bruv. Give it another go in a minute. If it keeps up, WhatsApp Doc — he'll sort it." })
    };
  }
};
