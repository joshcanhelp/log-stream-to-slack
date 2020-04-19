const got = require('got');

module.exports.sendToSlack = (logData) => {
  const errorDesc = logData.description || 'No description';
  const errorDate = logData.date || Date.now();

  // const reqUrl = 'https://webhook.site/16150b9f-2987-4b74-bd2c-aa5d90d2e2b5';
  const reqUrl = 'https://hooks.slack.com/services/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';
  const reqOpts = {
    method: 'POST',
    json: {
      attachments: [
        {
            fallback: `Auth0 error code "${logData.type}": ${errorDesc}`,
            color: '#ff0000',
            pretext: '🚨 Failure on Auth0 🚨',
            title: `Log entry with error code "${logData.type}"`,
            title_link: `https://manage.auth0.com/#/logs/${logData.log_id}`,
            text: errorDesc,
            fields: [
                {
                    title: 'Client Name',
                    value: logData.client_name || 'Dashboard'
                },
                {
                    title: 'Client ID',
                    value: logData.client_id || 'No Client ID'
                }
            ],
            footer: 'Auth0 API',
            footer_icon: 'https://cdn.auth0.com/website/press/resources/auth0-glyph.svg',
            ts: Math.round((new Date(errorDate)).getTime()/1000)
        }
      ]
    }
  };

  (async () => {
    const response = await got(reqUrl, reqOpts);
    console.log(response.body);
  })();
};