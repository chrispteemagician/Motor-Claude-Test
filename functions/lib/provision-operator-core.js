// Motor-Oid — shared operator provisioning logic
// Used by verify-checkout.js (Stripe webhook path) and provision-operator.js (admin path)

const { createClient } = require('@supabase/supabase-js');

function makeHamletSlug(name) {
    const base = (name || 'operator')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);
    const hex = Math.random().toString(16).slice(2, 6);
    return `${base}-${hex}`;
}

// provisionOperator — upserts motor_operators, appends credit_ledger row
// Returns operator record with hamlet_url attached
async function provisionOperator({ operator_email, operator_name, credits, type, note, bundle_ref, kindness_advance }) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if operator already exists (by email)
    const { data: existing } = await supabase
        .from('motor_operators')
        .select('*')
        .eq('email', operator_email)
        .maybeSingle();

    const hamlet_slug = existing?.hamlet_slug || makeHamletSlug(operator_name);
    const credit_balance = (existing?.credit_balance || 0) + credits;
    const ka_current = existing?.kindness_advance || 0;

    const operatorData = {
        email: operator_email,
        display_name: operator_name,
        hamlet_slug,
        credit_balance,
        hamlet_provisioned: true,
        ...(kindness_advance ? { kindness_advance: ka_current + credits } : {}),
    };

    const { data: operator, error: upsertError } = await supabase
        .from('motor_operators')
        .upsert(operatorData, { onConflict: 'email' })
        .select()
        .single();

    if (upsertError) throw new Error(upsertError.message);

    const { error: ledgerError } = await supabase
        .from('motor_credit_ledger')
        .insert({
            operator_id: operator.id,
            type,
            amount: credits,
            bundle_ref: bundle_ref || null,
            note: note || null,
        });

    if (ledgerError) throw new Error(ledgerError.message);

    return {
        ...operator,
        hamlet_url: `https://motor-oid.co.uk/hamlet/${hamlet_slug}/`,
    };
}

module.exports = { provisionOperator };
