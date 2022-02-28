function mailResponse(ok, message) {
    return new Response(
        JSON.stringify({ ok, message }),
        {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        }
    )
}

export async function onRequestPost(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const requestData = await request.json();
    const from = requestData.from || '';
    const message = requestData.message || '';
    if (from == '' || message == '') {
        return mailResponse(false, 'Please put your email address and a message!');
    }

    const payload = {
        personalizations: [{
            to: [{
                email: 'website@hawkridges.co.uk'
            }]
        }],
        from: {
            email: 'website@hawkridges.co.uk'
        },
        subject: 'A message was left on the website.',
        content: [{
            type: 'text/plain',
            value: `From: ${from}\nMessage:\n${message}`
        }]
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        return mailResponse(false, 'Error sending!');
    }

    return mailResponse(true, 'Sent!');
}
