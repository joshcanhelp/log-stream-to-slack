module.exports = {
  post: (url, opts) => ({
    statusCode: 200,
    body: { url, opts },
  }),
};
