const got = require("got");

const { prepareSlackMsg } = require("../lib/utils");

module.exports = async (req, res) => {
  const { body, headers } = req;

  if (!body || !Array.isArray(body)) {
    res.status(400);
    return res.end();
  }

  if (headers.authorization !== process.env.AUTH0_LOG_STREAM_TOKEN) {
    res.status(401);
    return res.end();
  }

  const failedLogs = body.filter((log) => {
    return "f" === log.data.type[0] || /limit/.test(log.data.type);
  });

  if (failedLogs.length === 0) {
    res.status(204);
    return res.end();
  }

  const reqUrl = process.env.SLACK_WEBHOOK_URL;
  const reqOpts = {
    json: {
      attachments: failedLogs.map((log) => prepareSlackMsg(log)),
    },
  };

  const slackResponse = await got.post(reqUrl, reqOpts);

  res.status(slackResponse.statusCode);
  return res.end(slackResponse.body);
};
