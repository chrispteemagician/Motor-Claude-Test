// Motor-Oid — verify a Stripe Checkout session
// GET ?session_id=xxx → { paid: bool, product, amountTotal }
// For bundle_1/5/10: provisions operator with correct credit count, returns { success, operator, elder_upgrade }

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { provisionOperator } = require('./lib/provision-operator-core');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const sessionId = event.queryStringParameters?.session_id;
    if (!sessionId) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'session_id required' }) };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Stripe not configured' }) };
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paid = session.payment_status === 'paid';

        // Bundle path: provision operator with correct credit count
        if (session.metadata?.type?.startsWith('bundle_')) {
            if (!paid) {
                return {
                    statusCode: 200,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({ paid: false, type: session.metadata.type }),
                };
            }

            const credits = parseInt(session.metadata.credits, 10) || 5;
            const elder_upgrade = session.metadata.elder_upgrade === 'true';
            const bundleLabels = { bundle_1: '1 credit', bundle_5: '5 credits', bundle_10: '10 credits' };
            const note = `Spicy Hustler ${bundleLabels[session.metadata.type] || credits + ' credits'}${elder_upgrade ? ' — Elder upgrade included' : ''}`;

            const operator = await provisionOperator({
                operator_email: session.metadata.operator_email,
                operator_name: session.metadata.operator_name,
                credits,
                type: 'purchase',
                bundle_ref: session.payment_intent,
                note,
            });

            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify({
                    success: true,
                    elder_upgrade,
                    operator: {
                        hamlet_slug: operator.hamlet_slug,
                        credit_balance: operator.credit_balance,
                        hamlet_url: operator.hamlet_url,
                    },
                }),
            };
        }

        // Standard listing payment
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                paid,
                product: session.metadata?.product,
                amountTotal: session.amount_total,
                currency: session.currency,
            }),
        };
    } catch (err) {
        console.error('Stripe verify error:', err);
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ paid: false, error: err.message }),
        };
    }
};
