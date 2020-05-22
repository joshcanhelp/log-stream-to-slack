module.exports = {

  /**
   * Convert an Auth0 log streaming event into a Slask message attachment.
   * For formatting, see https://api.slack.com/docs/messages/builder
   *
   * @param {object} log Auth0 log event.
   *
   * @return Slack attachment object.
   */
  prepareSlackMsg: (log) => {
    const logData = log.data || {};
    const errorDesc = logData.description || 'No description';
    const errorTitle = `${errorDesc} [type: ${logData.type}]`;

    const message = {
      pretext: '*Auth0 log alert*',
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
          value: `${logData.client_name || 'None'}\n\`${logData.client_id}\``
        }
      ];
    }

    return message;
  }
};