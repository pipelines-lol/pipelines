const checkCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided." });
  }
  if (code !== process.env.EARLY_ACCESS_CODE) {
    return res.status(400).json({ error: "Incorrect code." });
  }

  res.status(200).json({ code });
};

module.exports = {
  checkCode,
};
