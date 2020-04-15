module.exports = async (req, res) => {
  const { body } = req
  res.json(body);
}
