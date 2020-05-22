module.exports = {

  prepareSlackMsg: (log) => {
    const logData = log.data || {};
    const errorDesc = logData.description || 'No description';
    const errorTitle = `Auth0 log: ${errorDesc} [${logData.type}]`;

    const message = {
      fallback: errorTitle,
      title: errorTitle,
      color: '#ff0000'
    };

    if (logData.log_id) {
      message.title_link = `https://manage.auth0.com/#/logs/${logData.log_id}`;
    }

    if (logData.client_id) {
      message.fields = [
        {
          title: 'Client',
          value: `${logData.client_name || 'None'} [${logData.client_id}]`
        }
      ];
    }

    return message;
  }
};