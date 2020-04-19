module.exports.prepareSlackMsg = (logData) => {
  const errorDesc = logData.description || 'No description';

  return {
    fallback: `Auth0 error code "${logData.type}": ${errorDesc}`,
    color: '#ff0000',
    pretext: '🚨 Failure on Auth0 🚨',
    title: `Log entry with error code "${logData.type}"`,
    title_link: `https://manage.auth0.com/#/logs/${logData.log_id}`,
    text: `${errorDesc} at ${logData.date || Date.now()}`,
    fields: [
        {
            title: 'Client Name',
            value: logData.client_name || 'Dashboard'
        },
        {
            title: 'Client ID',
            value: logData.client_id || 'No Client ID'
        }
    ]
  };
};