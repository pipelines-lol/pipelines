const mongoose = require('mongoose')
const Schema = mongoose.Schema

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: Number,
    prevCompanies: {
        type: Map,
        of: Number
    },
    postCompanies: {
        type: Map,
        of: Number
    },
    tenure: Number,
    Employees: [{ type: String }]

})


module.exports = mongoose.model('Company', companySchema)