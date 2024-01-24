const Company = require('../models/companyModel')
const Profile = require('../models/profileModel')
const router = require('../routes/profiles')
const mongoose = require('mongoose')


const createCompany = async (req, res) => {
    const name = req.body.name


    try {
        // Check if the company with the given name already exists
        const existingCompany = await Company.findOne({ name: name })

        if (existingCompany) {
            return res.status(400).json({ error: 'Company with the same name already exists.' })
        }

        // Create a new company instance
        const newCompany = new Company({
            name: name,
            rating: 0,
            prevCompanies: {},
            postCompanies: {},
            tenure: 0,
            Employees: []
        });
           

        // Save the new company to the database
        const savedCompany = await newCompany.save()

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
        console.err(err)
        return res.status(400).json({error: "Failed to retrieve company"})
    }
}

const updateCompany = async(req, res) => {
    //update company on user registration
    const name = req.params.name
    const {rating, prevCompanies, postCompanies, tenure, Employees} = req.body

    try {

        for (const employee of Employees) {
            const user = await Profile.findById(employee)

            if (!user) {
                res.status(404).json({error: 'Employee ID not found'})
            }
        }

        const response = await Company.updateOne(
            { name: name },
            {
                $inc: {
                    rating: rating ? rating : 0, // Incrementing the rating by 1
                    tenure: tenure ? tenure : 0, // Incrementing the tenure by 1
                },
                $addToSet: {
                    Employees: { $each: Employees || [] }, // Appending the provided Employees list or an empty array if not provided
                },
            },
        )
        
        if (!response) {
            res.status(404).json({error: 'company not found'})
        }
        
        //Increment list of previous companies
        for (const companyName of prevCompanies) {
            const updateData = {
                $inc: {},
            };
            
            // Construct the dynamic key within $inc
            updateData.$inc[`prevCompanies.${companyName}`] = 1;
        
            
            const response = await Company.updateOne(
                { name: name },
                updateData
            );
    
            if (!response) {
                res.status(404).json({ error: `Company not found for ${companyName}` });
                return;
            }
            
        }

        //Increment list of postCompanies
        for (const companyName of postCompanies) {
            const updateData = {
                $inc: {},
            };
            
            // Construct the dynamic key within $inc
            updateData.$inc[`postCompanies.${companyName}`] = 1;
        
            
            const response = await Company.updateOne(
                { name: name },
                updateData
            );
    
            if (!response) {
                res.status(404).json({ error: `Company not found for ${companyName}` });
                return;
            }
            
        }

        res.status(200).json(response)

    } catch(err) {
        console.error(err)
        res.status(500).json({error: 'Not able to update company'})
    }
}

const deleteCompany = async(req, res) => {
    const name = req.params.name

    const company = await Company.findOneAndDelete({ name: name })

    if (!company) {
        return res.status(404).json({error: 'No such company.'})
    }

    res.status(200).json(company)
}

module.exports = {
    createCompany,
    getCompany,
    updateCompany,
    deleteCompany
}