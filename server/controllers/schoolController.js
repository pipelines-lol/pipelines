const fetch = require("node-fetch");

const searchSchools = async (req, res) => {
  const query = req.query.name;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${query}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();

    // if there's a limit, trim the data array to the specified length.
    if (limit > 0) {
      data = data.slice(0, limit);
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  searchSchools,
};
