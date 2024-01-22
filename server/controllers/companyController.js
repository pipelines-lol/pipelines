const Company = require('../models/companyModel')
const mongoose = require('mongoose')

const createCompany = async (req, res) => {
    const name = req.body.name
    console.log("name: ", name)

    try {
        // Check if the company with the given name already exists
        const existingCompany = await Company.findOne({ name: name })
        console.log("existing company: ", existingCompany)

        if (existingCompany) {
            return res.status(400).json({ error: 'Company with the same name already exists.' })
        }

        // Create a new company instance
        const newCompany = new Company({ name })
        console.log("New company: ", newCompany)
           

        // Save the new company to the database
        const savedCompany = await newCompany.save()
        console.log("Saved Company: ", savedCompany)

        res.status(201).json(savedCompany)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create company.' });
    }

}

const getCompany = async (req, res) => {
    const { name } = req.params

    try {
        // Find the company by name in the database
        const company = await Company.findOne({ 'name': name })


         // Check if the company exists
        if (!company) {
            return res.status(404).json({ error: 'Company not found.' })
        }

        return res.status(200).json(company)
    } catch (err) {
        console.log(err)
        return res.status(400).json({error: "Failed to retrieve company"})
    }
}

const updateCompany = async(req, res) => {
    //update company on user registration
}

const deleteCompany = async(req, res) => {
    //delete company
}

module.exports = {
    createCompany,
    getCompany,
    updateCompany,
    deleteCompany
}