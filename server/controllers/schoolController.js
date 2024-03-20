const fetch = require('node-fetch');

const searchSchools = async (req, res) => {
    const query = req.query.name;
    try {
        const response = await fetch(`http://universities.hipolabs.com/search?name=${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data); // Send the data back to the client over HTTPS
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

module.exports = {
    searchSchools
}