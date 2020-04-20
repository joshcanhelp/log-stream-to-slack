const got = require('got');

const { prepareSlackMsg } = require('../_helpers/slack');

module.exports = async (req, res) => {

  const { body, headers } = req;

  if (!body || !Array.isArray(body) || !headers.authorization) {
    res.status(400);
    return res.end('BAD REQUEST');
  }

  if (headers.authorization !== process.env.SLACK_FUNCTION_TOKEN) {
    res.status(401);
    return res.end('NOT AUTHORIZED');
  }

  const failedLogs = body
    .filter((log) => 'f' === log.data.type[0] || /fail|limit/.test(log.data.type))
    .map((log) => prepareSlackMsg(log.data));

  if (!failedLogs.length) {
    res.status(200);
    return res.end();
  }

  const reqUrl = process.env.SLACK_HOOK_URL;
  const reqOpts = {
    method: 'POST',
    json: {
      attachments: failedLogs
    }
  }

  const slackResponse = await got(reqUrl, reqOpts);
  res.status(slackResponse.statusCode);
  res.end(slackResponse.body);
}
