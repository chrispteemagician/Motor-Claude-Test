-- Expo exhibitor directory — Spannabis 2026 + Mary Jane Berlin 2026
-- Run this in Supabase SQL editor: https://supabase.com/dashboard/project/pdnjeynugptnavkdbmxh/sql
--
-- Source: Ember (Gemini) research session, compiled from expo exhibitor lists.
-- CAVEAT: phone numbers, emails and countries below were AI-generated / researched,
-- NOT independently confirmed by Doc in person. Treat as a starting point — verify
-- before using for outreach, and flip `verified = true` once Doc confirms a contact.
--
-- Tiering (Doc's call, 1 July 2026):
--   premium — "best of the best" hardware/genetics brands, gold-standard reputation
--   value   — reliable mid-range workhorses, good value, solid customer service
--   listed  — everything else from the uncurated exhibitor dump, flat directory entry
--
-- Frontend note: a handful of these (Storz & Bickel, Sensi Seeds, Dutch Passion,
-- Royal Queen Seeds) are ALSO hardcoded in index.html's B2B array with Doc's own
-- meeting notes — that's fine, loadDynamicB2B() dedupes by name so the richer
-- hardcoded card wins on-screen. They're still inserted here so Ask Terp can see them.

ALTER TABLE b2b_businesses ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'listed';
ALTER TABLE b2b_businesses DROP CONSTRAINT IF EXISTS b2b_businesses_tier_check;
ALTER TABLE b2b_businesses ADD CONSTRAINT b2b_businesses_tier_check CHECK (tier IN ('premium', 'value', 'listed'));

INSERT INTO b2b_businesses (
    slug, name, category, country, city, website, contact_email,
    description, expo_ref, tier, active, claimed, verified
) VALUES

-- ============ PREMIUM — best of the best ============
('storz-bickel-premium', 'Storz & Bickel', 'hardware', 'germany', 'Tuttlingen', 'storz-bickel.com', NULL,
 'World-leading medical cannabis vaporizer manufacturer — Volcano, Mighty+, Crafty+, Plenty. German precision engineering, gold-standard customer support. Phone: +49 7461 96580.',
 'maryjane-berlin-26', 'premium', true, false, false),

('athena-ag', 'Athena Ag (Athena Pro)', 'cultivationtech', 'usa', NULL, 'athenag.com', NULL,
 'Commercial-scale cultivation fertiliser line built for high-volume growers. Known for consistency across large operations and strong technical support. Phone: +1 844-332-8436.',
 'spannabis-26', 'premium', true, false, false),

('sensi-seeds-premium', 'Sensi Seeds', 'seedbank', 'netherlands', 'Amsterdam', 'sensiseeds.com', NULL,
 'One of the oldest and most respected cannabis seed banks in the world — deep genetic library, long-standing reputation for quality and customer care. Phone: +31 20 626 2901.',
 'spannabis-26', 'premium', true, false, false),

('barneys-farm', 'Barney''s Farm', 'seedbank', 'netherlands', 'Amsterdam', 'barneysfarm.com', NULL,
 'Long-established Amsterdam breeder known for award-winning commercial genetics and reliable large-scale seed production. Phone: +31 20 411 7249.',
 'spannabis-26', 'premium', true, false, false),

('raw-hbi', 'RAW / HBI', 'accessories', 'usa', NULL, 'rawthentic.com', 'wholesale@hbiinternational.com',
 'Globally recognised natural rolling papers and accessories brand under HBI International — huge retailer trust and strong wholesale support.',
 'direct', 'premium', true, false, false),

-- ============ VALUE — mid-range workhorses ============
('royal-queen-seeds-db', 'Royal Queen Seeds', 'seedbank', 'netherlands', 'Amsterdam / Barcelona', 'royalqueenseeds.com', NULL,
 'Europe''s biggest entry-to-mid-tier seed bank — mass production keeps prices competitive, fast responsive support backed by a huge educational content library. Phone: +34 93 138 2023.',
 'spannabis-26', 'value', true, false, false),

('plagron', 'Plagron', 'cultivationtech', 'netherlands', NULL, 'plagron.com', NULL,
 'Dependable, easy-to-use nutrient and substrate lines — the default choice for mid-scale cultivators because it''s affordable and hard to get wrong. Phone: +31 495 631 559.',
 'spannabis-26 / maryjane-berlin-26', 'value', true, false, false),

('fastbuds', 'FastBuds', 'seedbank', 'spain', NULL, '2fast4buds.com', 'wholesale@2fast4buds.com',
 'Global standard for mid-range autoflower genetics — fast turnaround, reliable germination rates, strong bulk pricing.',
 'maryjane-berlin-26', 'value', true, false, false),

('dynavap', 'DynaVap', 'hardware', 'usa', NULL, 'dynavap.com', NULL,
 'Battery-free thermal extraction device — indestructible mechanical alternative to pricey e-vapes, huge consumer loyalty. Phone: +1 715-350-7030.',
 'maryjane-berlin-26', 'value', true, false, false),

('canna-nutrients', 'CANNA', 'cultivationtech', 'netherlands', NULL, 'canna.com', NULL,
 'Global baseline hydro/coco nutrient brand — not flashy, but trusted for predictable yields and a rock-solid distributor network. Phone: +31 162 431 440.',
 'spannabis-26 / maryjane-berlin-26', 'value', true, false, false),

('g-rollz', 'G-Rollz', 'accessories', 'netherlands', 'Amsterdam', 'g-rollz.com', 'info@g-rollz.com',
 'Affordable rolling papers, trays and accessories with trendy licensed art — strong retailer margins and quick customer service turnaround.',
 'spannabis-26 / maryjane-berlin-26', 'value', true, false, false),

-- ============ LISTED — with contact detail ============
('atami-bcuzz', 'ATAMI / B''cuzz', 'cultivationtech', 'netherlands', NULL, 'atami.com', NULL,
 'Biological liquid plant food range. Phone: +31 73 522 3256.', 'spannabis-26', 'listed', true, false, false),

('dutch-passion-db', 'Dutch Passion', 'seedbank', 'netherlands', 'Amsterdam', 'dutch-passion.com', NULL,
 'Legacy Dutch genetics and seed bank. Phone: +31 20 567 3900.', 'spannabis-26', 'listed', true, false, false),

('green-house-seeds', 'Green House Seeds', 'seedbank', 'netherlands', 'Amsterdam', 'greenhouse-seeds.com', NULL,
 'Award-winning strains, greenhouse-grown genetics. Phone: +31 20 626 2831.', 'spannabis-26', 'listed', true, false, false),

('ocb-republic', 'OCB / Republic', 'accessories', 'france', NULL, 'ocb.net', NULL,
 'Global rolling paper manufacturer. B2B contact via website portal only — no direct phone/email on file.',
 'spannabis-26', 'listed', true, false, false),

('puffco', 'Puffco', 'hardware', 'usa', NULL, 'puffco.com', NULL,
 'Premium concentrate vaporizer hardware. Phone: +1 844-478-3326.', 'spannabis-26', 'listed', true, false, false),

('silent-seeds', 'Silent Seeds', 'seedbank', 'spain', NULL, 'silent-seeds.com', 'info@silent-seeds.com',
 'Souvenir/CBD seed range aimed at the tourist and low-THC market.', 'spannabis-26', 'listed', true, false, false),

('biobizz', 'Biobizz Worldwide', 'cultivationtech', 'spain', NULL, 'biobizz.com', NULL,
 'Organic plant nutrients, large-scale manufacturing. Phone: +34 94 465 7951.', 'spannabis-26', 'listed', true, false, false),

('lumatek-lighting', 'Lumatek Lighting', 'cultivationtech', 'uk', NULL, 'lumatek-lighting.com', NULL,
 'Professional grow lighting (LED). Phone: +44 1245 426200.', 'spannabis-26', 'listed', true, false, false),

('boveda', 'Boveda Inc.', 'accessories', 'usa', NULL, 'bovedainc.com', NULL,
 '2-way humidity control packs for storage. Phone: +1 952-745-2200.', 'spannabis-26', 'listed', true, false, false),

('purize-filters', 'Purize Filters', 'accessories', 'germany', NULL, 'purize-filters.com', NULL,
 'Active charcoal cigarette/joint filters. Phone: +49 2204 984020.', 'maryjane-berlin-26', 'listed', true, false, false),

('graveda', 'Graveda', 'hardware', 'germany', NULL, 'graveda.de', 'info@graveda.de',
 'Affordable home rosin presses for solventless extraction.', 'maryjane-berlin-26', 'listed', true, false, false),

('sanity-group-vaay', 'Sanity Group / VAAY', 'medical', 'germany', 'Berlin', 'sanitygroup.com', NULL,
 'European medical cannabinoid products. Phone: +49 30 39820540.', 'maryjane-berlin-26', 'listed', true, false, false),

('demecan', 'Demecan', 'medical', 'germany', 'Berlin', 'demecan.de', NULL,
 'German medical cannabis cultivation and supply, GACP/GMP. Phone: +49 30 86320800.', 'maryjane-berlin-26', 'listed', true, false, false),

('aurora-europe', 'Aurora Europe', 'medical', 'germany', 'Berlin', 'auroramedical.de', NULL,
 'Pharmaceutical cannabis importation and distribution. Phone: +49 30 98321600.', 'maryjane-berlin-26', 'listed', true, false, false),

('420-pharma', '420 Pharma', 'medical', 'germany', 'Cologne', '420pharma.de', NULL,
 'GACP/GMP medical flower distribution. Phone: +49 221 6508810.', 'maryjane-berlin-26', 'listed', true, false, false),

-- ============ LISTED — Spannabis, uncurated (no contact detail found) ============
('partido-cannabico-luz-verde', 'Partido Cannábico Luz Verde', 'advocacy', 'spain', NULL, NULL, NULL,
 'Cannabis advocacy / political party. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('natural-suit', 'Natural Suit', 'other', 'spain', NULL, NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('naturis-lab-madrid', 'Naturis Lab Madrid SL', 'other', 'spain', 'Madrid', NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('blackfarmgenetics', 'BLACKFARMGENETICS', 'seedbank', 'spain', NULL, NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('hesi-plantenvoeding', 'Hesi Plantenvoeding', 'cultivationtech', 'netherlands', NULL, NULL, NULL,
 'Plant nutrients. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('hortitec', 'Hortitec', 'cultivationtech', 'spain', NULL, NULL, NULL,
 'Grow shop supplier/distributor. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('hydrofarm', 'Hydrofarm', 'cultivationtech', 'usa', NULL, NULL, NULL,
 'Hydroponic equipment distributor. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('mascotte', 'Mascotte', 'accessories', 'netherlands', NULL, NULL, NULL,
 'Rolling papers manufacturer. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('powerlux', 'Powerlux', 'cultivationtech', 'spain', NULL, NULL, NULL,
 'Grow lighting. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('shivamap', 'ShivaMap', 'other', 'spain', NULL, NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('simply-green-wholesale', 'Simply Green Wholesale', 'other', 'uk', NULL, NULL, NULL,
 'Wholesale distributor. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('sweet-seeds', 'Sweet Seeds', 'seedbank', 'spain', NULL, NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('terpene-belt-farms', 'Terpene Belt Farms', 'seedbank', 'usa', NULL, NULL, NULL,
 'Terpene-focused genetics. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('the-island-pharma', 'The Island Pharma', 'medical', 'spain', NULL, NULL, NULL,
 'Medical cannabis pharma. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('cannabeer', 'Cannabeer', 'other', 'spain', NULL, NULL, NULL,
 'Cannabis-infused beverage brand. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('genehtik-seeds', 'Genehtik Seeds', 'seedbank', 'spain', NULL, NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('bac-online', 'BAC Online', 'cultivationtech', 'netherlands', NULL, NULL, NULL,
 'Biological plant nutrients. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('planta-sur-distributed-goods', 'Planta Sur Distributed Goods', 'other', 'spain', NULL, NULL, NULL,
 'Distribution. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('smart-pot', 'Smart Pot', 'cultivationtech', 'usa', NULL, NULL, NULL,
 'Fabric grow pots. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('alien-hydroponics-systems', 'Alien Hydroponics Systems', 'cultivationtech', 'spain', NULL, NULL, NULL,
 'Hydroponic systems. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('eva-seeds', 'Eva Seeds', 'seedbank', 'spain', NULL, NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('ripper-seeds', 'Ripper Seeds', 'seedbank', 'spain', NULL, NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('top-crop-nutrients', 'Top Crop Nutrients', 'cultivationtech', 'spain', NULL, NULL, NULL,
 'Plant nutrients. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('00box', '00Box', 'other', 'spain', NULL, NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('gold-label-substrates', 'Gold Label Substrates', 'cultivationtech', 'netherlands', NULL, NULL, NULL,
 'Growing substrates. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('general-hydroponics-ghe', 'General Hydroponics (GHE)', 'cultivationtech', 'usa', NULL, NULL, NULL,
 'Hydroponic nutrients. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('humboldt-nutrients', 'Humboldt Nutrients', 'cultivationtech', 'usa', NULL, NULL, NULL,
 'Plant nutrients. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('sherbinskis', 'Sherbinskis', 'seedbank', 'usa', NULL, NULL, NULL,
 'California cannabis genetics/lifestyle brand. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('alchimia-grow-shop', 'Alchimia Grow Shop', 'other', 'spain', 'Barcelona', NULL, NULL,
 'Grow shop and online retailer. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('cannactiva', 'Cannactiva', 'medical', 'spain', NULL, NULL, NULL,
 'CBD/wellness products. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('innexo-bv', 'Innexo BV', 'cultivationtech', 'netherlands', NULL, NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('phytoflow-gmbh', 'PhytoFlow GmbH', 'cultivationtech', 'germany', NULL, NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('ion-plus-industries', 'ION+ Industries', 'cultivationtech', 'spain', NULL, NULL, NULL,
 'Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('trilogene-seeds', 'Trilogene Seeds', 'seedbank', 'usa', NULL, NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('canopy-growth-europe', 'Canopy Growth Europe', 'medical', 'germany', NULL, NULL, NULL,
 'European arm of Canopy Growth (Canada) medical cannabis. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('tsrgrow', 'TSRgrow', 'cultivationtech', 'usa', NULL, NULL, NULL,
 'Commercial grow lighting. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

('zippo-gmbh', 'Zippo GmbH', 'accessories', 'germany', NULL, NULL, NULL,
 'Lighters/accessories. Exhibitor at Spannabis — contact details unconfirmed.', 'spannabis-26', 'listed', true, false, false),

-- ============ LISTED — Mary Jane Berlin, uncurated (no contact detail found) ============
('phcann-international', 'PHCANN International', 'medical', 'germany', NULL, NULL, NULL,
 'Medical cannabis. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('organigram-global', 'Organigram Global', 'medical', 'canada', NULL, NULL, NULL,
 'Canadian licensed cannabis producer, European distribution. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('cannamedical-pharma', 'Cannamedical Pharma', 'medical', 'germany', 'Cologne', NULL, NULL,
 'Medical cannabis import/distribution. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('high-tide-inc', 'High Tide Inc.', 'shop', 'canada', NULL, NULL, NULL,
 'Cannabis retail group. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('iridescentmed', 'IridescentMed', 'medical', 'germany', NULL, NULL, NULL,
 'Medical cannabis. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('mary-jane-cones-na', 'Mary Jane Cones North America Inc.', 'accessories', 'usa', NULL, NULL, NULL,
 'Pre-roll cone manufacturer. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('sluggers-hit', 'Sluggers Hit', 'accessories', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('kenevirco', 'KenevirCo', 'medical', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('nz-trade-and-enterprise', 'New Zealand Trade and Enterprise', 'other', 'newzealand', NULL, NULL, NULL,
 'Government trade body promoting NZ cannabis exporters. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('puro-new-zealand', 'Puro New Zealand', 'medical', 'newzealand', NULL, NULL, NULL,
 'Medical cannabis producer. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('rua-bioscience', 'RUA Bioscience', 'medical', 'newzealand', NULL, NULL, NULL,
 'Medical cannabis producer. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('aho-farms', 'Aho Farms', 'medical', 'newzealand', NULL, NULL, NULL,
 'Medical cannabis cultivator. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('deemed-thailand', 'DeeMED Thailand', 'medical', 'thailand', NULL, NULL, NULL,
 'Thai medical cannabis. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('ppb-analytical', 'PPB Analytical Inc.', 'compliance', 'usa', NULL, NULL, NULL,
 'Cannabis lab testing/analytics. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('stoned-cerberus-ppv', 'STONED - Cerberus PPV Holding', 'other', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('arvaloo-gmbh', 'Arvaloo GmbH', 'other', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('dna-genetics', 'DNA Genetics', 'seedbank', 'netherlands', 'Amsterdam', NULL, NULL,
 'Long-established cannabis genetics breeder. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('champelli', 'Champelli', 'other', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('ziplock-co', 'Ziplock Co.', 'accessories', 'germany', NULL, NULL, NULL,
 'Storage bags/packaging. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('fat-beans', 'Fat Beans', 'other', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('humboldt-seed-organization', 'Humboldt Seed Organization', 'seedbank', 'spain', 'Barcelona', NULL, NULL,
 'Cannabis genetics breeder. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('caluma-hydroponics', 'Caluma Hydroponics', 'cultivationtech', 'germany', NULL, NULL, NULL,
 'Hydroponic systems. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('sweed-de', 'Sweed.de', 'shop', 'germany', NULL, NULL, NULL,
 'Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('vaporizer-markt', 'Vaporizer Markt', 'hardware', 'germany', NULL, NULL, NULL,
 'Vaporizer retailer. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false),

('chillhouse-wholesale', 'Chillhouse Wholesale', 'other', 'germany', NULL, NULL, NULL,
 'Wholesale distributor. Exhibitor at Mary Jane Berlin — contact details unconfirmed.', 'maryjane-berlin-26', 'listed', true, false, false)

ON CONFLICT (slug) DO NOTHING;
