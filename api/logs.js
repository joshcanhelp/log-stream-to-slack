const got = require('got');

const { prepareSlackMsg } = require('../lib/utils');

module.exports = async (req, res) => {

  const { body, headers } = req;

  if (!body || !Array.isArray(body)) {
    res.status(400);
    return res.end();
  }

  if (headers.authorization !== process.env.SLACK_FUNCTION_TOKEN) {
    res.status(401);
    return res.end();
  }

  console.log(body);

  const failedLogs = body.filter((log) => {
    'f' === log.data.type[0] || /fail|limit/.test(log.data.type);
  });

  if (!failedLogs.length) {
    res.status(204);
    return res.end();
  }

  const reqUrl = process.env.SLACK_HOOK_URL;
  const reqOpts = {
    method: 'POST',
    json: {
      attachments: failedLogs.map(prepareSlackMsg)
    }
  };

  const slackResponse = await got(reqUrl, reqOpts);
  res.status(slackResponse.statusCode);
  return res.end(slackResponse.body);
};
