const { sendToSlack } = require('../_helpers/slack');

module.exports = (req, res) => {

  res.end();

  const { body } = req;

  if (!body || !Array.isArray(body)) {
    res.status(400);
    return res.end();
  }

  body.forEach((log) => {
    const logType = log.data && log.data.type;
    if ('f' === logType[0] || logType.indexOf('fail') || logType.indexOf('limit')) {
      sendToSlack(log.data);
    }
  });

  return res.end();
}
