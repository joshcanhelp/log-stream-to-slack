const got = require('got');

const { prepareSlackMsg } = require('../_helpers/slack');

module.exports = async (req, res) => {

  const { body, headers } = req;

  if (!body || !Array.isArray(body) || !headers.authorization) {
    res.status(400);
    return res.end('BAD REQUEST');
  }

  console.log(headers);
  console.log(process.env);

  if (headers.authorization !== process.env.SLACK_FUNCTION_TOKEN) {
    res.status(401);
    return res.end('NOT AUTHORIZED');
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
