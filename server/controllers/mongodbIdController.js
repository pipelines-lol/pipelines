const mongoose = require('mongoose')

const checkMongodbId = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).json({ response: false })
    } else {
        return res.status(200).json({ response: true })
    }
}

module.exports = {
    checkMongodbId
}