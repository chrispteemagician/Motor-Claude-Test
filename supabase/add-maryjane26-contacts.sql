-- Mary Jane Berlin 2026 — warm contacts added 14 June 2026
-- Run this in Supabase SQL editor: https://supabase.com/dashboard/project/pdnjeynugptnavkdbmxh/sql

INSERT INTO b2b_businesses (
    slug, name, category, country, city, website, contact_email,
    description, freebies, b2b_needs, b2b_offers,
    expo_ref, active, claimed, verified
) VALUES

-- 1. Imkerei Tamás Megyes — cannabis-themed artisan honey, Wendeburg-Rüper, Germany
-- WARM PAYING LEAD — agreed £99/mo Hamlet B2B at Mary Jane Berlin 14 June 2026
-- Model: products listed on Hamlet page with direct PayPal links, payments go to him, he ships
(
    'imkerei-megyes',
    'Imkerei Tamás Megyes',
    'wellness',
    'germany',
    'Wendeburg',
    'www.imkereimegyes.de',
    'info@imkereimegyes.de',
    'Artisan honey producer from Wendeburg-Rüper creating premium cannabis-strain-named honey varieties — Purple Haze (blackcurrant), Blue Dream (vanilla & tonka bean), Strawberry Cough (strawberry & tonka bean), Tonka Cinnamon Boom (cinnamon & tonka bean). Five years refining honey with freeze-dried fruits, spices, and tonka bean. Regional, handcrafted, limited edition. Perfect gifting and retail product for cannabis spaces. WARM LEAD: Agreed Hamlet B2B listing at Mary Jane Berlin 2026 — products listed with direct PayPal links, direct fulfilment.',
    '50g sample jars — Purple Haze, Blue Dream, Strawberry Cough, Tonka Cinnamon Boom',
    'Distribution partners, cannabis event retailers, dispensary gift shop stockists across Europe',
    'Premium artisan cannabis-themed honey products for retail, gifting, and brand collaborations. Limited edition runs. Phone: 05303 5083355 / 0151 54655212',
    'maryjane-berlin-26',
    true,
    true,
    false
),

-- 2. Exclusive Seeds Bank — premium seed bank, Terrassa / Barcelona, Spain
-- Contact: José Luis Moya (CEO) — pepe@exclusiveseedsbank.com / +34 688 442 465
(
    'exclusive-seeds-bank',
    'Exclusive Seeds Bank',
    'seeds',
    'spain',
    'Terrassa, Barcelona',
    'exclusiveseedsbank.com',
    'pepe@exclusiveseedsbank.com',
    'Premium cannabis seed bank based in Terrassa, Barcelona, Spain. Contact: José Luis Moya (CEO). Specialising in exclusive genetics. Social: @exclusiveseedsbank. Phone: +34 688 442 465 / +34 937128 487',
    NULL,
    'UK and European distribution partners, new genetics collaborations, CSC supply relationships',
    'Premium cannabis genetics and seeds for breeders, dispensaries, and cannabis social clubs. Address: Avd. Font i Sagué 7-3 Bis, 08227 Terrassa, Barcelona, Spain',
    'maryjane-berlin-26',
    true,
    true,
    false
),

-- 3. CardPlicity — transparent payment processing for cannabis businesses
(
    'cardplicity',
    'CardPlicity',
    'compliance',
    'usa',
    NULL,
    'www.cardplicity.com',
    NULL,
    'Transparent payment processing built specifically for high-risk, high-volume cannabis businesses. 100% transparent fees — no hidden charges, no mystery math, no non-qualified surprises. If the rate is X, the cost is X. Nothing buried, nothing padded. Free processing audit available. Most merchants think they pay around 4% per transaction — after junk fees, batch fees, and padded margins, the real number is often 6–9%. CardPlicity audits statements line by line and strips out the nonsense.',
    NULL,
    'Cannabis businesses frustrated by phantom payment fees who need compliant, honest processing',
    'Compliant payment processing for dispensaries, seed companies, clone sellers, and cannabis-adjacent businesses. Free processing audits. POS integrations, cashless solutions, invoice and card-not-present processing, transparent pricing.',
    'maryjane-berlin-26',
    true,
    true,
    false
)

ON CONFLICT (slug) DO NOTHING;
