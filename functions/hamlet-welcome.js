// Motor-Oid — Garage Hamlet Welcome Email
// Fires when someone builds their garage in the village

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
    const { email, name, hamlet } = JSON.parse(event.body);
    if (!email) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('No Resend API key — skipping email');
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email skipped (no API key)' }) };
    }

    const firstName = name ? name.split(' ')[0] : 'friend';
    const garageUrl = `https://motor-oid.co.uk/hamlet/${hamlet}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Garage is Open — Motor-Oid Village</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f0f0f; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 1px solid #2d2d2d;">

    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #f97316;">
      <div style="font-size: 52px; margin-bottom: 10px;">🔧</div>
      <h1 style="color: #f97316; margin: 0; font-size: 28px; font-weight: 800;">Your Garage is Open, ${firstName}!</h1>
      <p style="color: rgba(249,115,22,0.65); margin: 10px 0 0 0; font-size: 16px;">Motor-Oid Village — The Garage Village</p>
    </div>

    <div style="padding: 32px 30px;">
      <p style="color: #e2e8f0; font-size: 17px; line-height: 1.7;">
        Spanner Jack has noted your garage. Your corner of the village is live — your motors, your knowledge, your story.
      </p>

      <div style="background: rgba(249,115,22,0.08); border-radius: 14px; padding: 22px; margin: 24px 0; border-left: 4px solid #f97316;">
        <h3 style="color: #f97316; margin: 0 0 12px 0; font-size: 17px;">What you can do from your garage:</h3>
        <ul style="color: #94a3b8; margin: 0; padding-left: 20px; line-height: 2;">
          <li>Analyse any used car with Spanner Jack's full knowledge</li>
          <li>Use Engine Ears — let Jack listen to any engine</li>
          <li>Share your garage link with anyone buying a car</li>
          <li>Add your own motors, story, and recommendations</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${garageUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea6910 100%); color: #000; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px;">
          View Your Garage →
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 15px; line-height: 1.7;">
        Your edit link was shown on the confirmation screen — bookmark it. That's how you customise your garage. If you lost it, reply to this email and we'll sort it.
      </p>

      <hr style="border: none; border-top: 1px solid rgba(249,115,22,0.15); margin: 28px 0;">

      <p style="color: rgba(249,115,22,0.5); font-size: 14px; text-align: center; line-height: 1.7;">
        Support the village on <a href="https://www.patreon.com/chrisptee" style="color: #f97316;">Patreon from £3/mo</a> to unlock Engine Ears &amp; more.<br>
        Your support keeps Spanner Jack under the bonnets.
      </p>
    </div>

    <div style="background: #080808; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(249,115,22,0.1);">
      <p style="color: rgba(249,115,22,0.6); margin: 0; font-size: 15px; font-style: italic;">
        "Protect your money. Protect your family. Know what you're buying."
      </p>
      <p style="color: rgba(249,115,22,0.3); margin: 12px 0 0 0; font-size: 12px;">
        Motor-Oid Village · Part of <a href="https://feelfamous.co.uk" style="color: #f97316;">FeelFamous</a><br>
        Questions? Reply to this email or WhatsApp: <a href="https://wa.me/447976884254" style="color: #f97316;">07976 884254</a>
      </p>
    </div>

  </div>
</body>
</html>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Motor-Oid <welcome@motor-oid.co.uk>',
        to: email,
        subject: `Your garage is open, ${firstName}! 🔧`,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend error:', response.status, errorText);
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email queued' }) };
    }

    const result = await response.json();
    console.log('Motor-Oid garage welcome sent:', result.id, 'to:', email);
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email sent', id: result.id }) };

  } catch (error) {
    console.error('hamlet-welcome error:', error);
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email queued', error: error.message }) };
  }
};
