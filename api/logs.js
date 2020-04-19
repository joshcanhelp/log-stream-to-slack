const got = require('got');

const { prepareSlackMsg } = require('../_helpers/slack');

module.exports = async (req, res) => {

  const { body } = req;

  if (!body || !Array.isArray(body)) {
    res.status(400);
    return res.end();
  }

  const failedLogs = body
    .filter((log) => 'f' === log.data.type[0] || /fail|limit/.test(log.data.type))
    .map((log) => prepareSlackMsg(log.data));

  const reqUrl = process.env.SLACK_HOOK_URL;
  const reqOpts = {
    method: 'POST',
    json: {
      attachments: failedLogs
    }
  }

  const response = await got(reqUrl, reqOpts);
  res.send(response.body);
}
