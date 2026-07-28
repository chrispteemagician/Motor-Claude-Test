// Motor-Oid — Stripe Checkout Session creator
// POST { product: 'member_listing' | 'nonmember_listing' } → { url }
// POST { type: 'bundle_1' | 'bundle_5' | 'bundle_10', operator_email, operator_name } → { url }

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

const BASE_URL = 'https://motor-oid.co.uk';

// Private seller listing products (single vehicle, pay per listing)
const PRODUCTS = {
    member_listing: {
        name: 'Motor-Oid — Vehicle Listing (Member Rate)',
        description: 'One honest vehicle listing. AI disclosure, MOT history card, QR code for the windscreen, downloadable page.',
        amount: 1500, // £15
        successPath: '/sell.html?stripe_success=1&session_id={CHECKOUT_SESSION_ID}',
        cancelPath: '/sell.html?stripe_cancelled=1',
    },
    nonmember_listing: {
        name: 'Motor-Oid — Vehicle Listing',
        description: 'One honest vehicle listing. AI disclosure, MOT history card, QR code for the windscreen, downloadable page.',
        amount: 2500, // £25
        successPath: '/sell.html?stripe_success=1&session_id={CHECKOUT_SESSION_ID}',
        cancelPath: '/sell.html?stripe_cancelled=1',
    },
};

// Spicy Hustler operator credit bundles
// bundle_1  → 1 credit, £5 — try it, no commitment
// bundle_5  → 5 credits, £5/each — hustler pack
// bundle_10 → 10 credits, £5/each — earner pack
const OPERATOR_BUNDLES = {
    bundle_1: {
        name: 'Motor-Oid — 1 Listing Credit (First Fiver)',
        description: '1 vehicle listing credit. Charge sellers £10–£25. Your first fiver in the pocket.',
        amount: 500, // £5
        credits: 1,
        elder_upgrade: false,
        successPath: '/operators/dashboard.html?session_id={CHECKOUT_SESSION_ID}',
        cancelPath: '/operators/join.html',
    },
    bundle_5: {
        name: 'Motor-Oid — 5 Listing Credits (Hustler)',
        description: '5 vehicle listing credits. £5/credit. Charge sellers £10–£25/vehicle. Keep £5–£20/vehicle.',
        amount: 2500, // £25
        credits: 5,
        elder_upgrade: false,
        successPath: '/operators/dashboard.html?session_id={CHECKOUT_SESSION_ID}',
        cancelPath: '/operators/join.html',
    },
    bundle_10: {
        name: 'Motor-Oid — 10 Listing Credits (Earner)',
        description: '10 vehicle listing credits. £5/credit. Charge sellers £10–£25/vehicle. Keep up to £200.',
        amount: 5000, // £50
        credits: 10,
        elder_upgrade: false,
        successPath: '/operators/dashboard.html?session_id={CHECKOUT_SESSION_ID}',
        cancelPath: '/operators/join.html',
    },
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'POST only' }) };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Stripe not configured' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    // Bundle path: Spicy Hustler operator credit packs
    if (body.type && body.type.startsWith('bundle_')) {
        const bundle = OPERATOR_BUNDLES[body.type];
        if (!bundle) {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unknown bundle. Use bundle_1, bundle_5, or bundle_10.' }) };
        }
        if (!body.operator_email || !body.operator_name) {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'operator_email and operator_name required for bundle' }) };
        }
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: bundle.name,
                            description: bundle.description,
                            images: ['https://motor-oid.co.uk/logo.jpg'],
                        },
                        unit_amount: bundle.amount,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: BASE_URL + bundle.successPath,
                cancel_url: BASE_URL + bundle.cancelPath,
                metadata: {
                    type: body.type,
                    credits: String(bundle.credits),
                    elder_upgrade: String(bundle.elder_upgrade),
                    operator_email: body.operator_email,
                    operator_name: body.operator_name,
                },
            });
            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify({ url: session.url }),
            };
        } catch (err) {
            console.error('Stripe bundle checkout error:', err);
            return {
                statusCode: 500,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: 'Failed to create bundle checkout session', detail: err.message }),
            };
        }
    }

    // Listing path: member_listing / nonmember_listing
    const product = PRODUCTS[body.product];
    if (!product) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unknown product. Use "member_listing", "nonmember_listing", or bundle type "bundle_1", "bundle_5", "bundle_10".' }) };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: ['https://motor-oid.co.uk/logo.jpg'],
                    },
                    unit_amount: product.amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: BASE_URL + product.successPath,
            cancel_url: BASE_URL + product.cancelPath,
            metadata: { product: body.product },
        });

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ url: session.url }),
        };
    } catch (err) {
        console.error('Stripe checkout error:', err);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: 'Failed to create checkout session', detail: err.message }),
        };
    }
};
