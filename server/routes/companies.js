const express = require('express')
const { createCompany, getCompany, updateCompany, deleteCompany } = require('../controllers/companyController')
const router = express()
const bodyParser = require('body-parser')

//read a specific company
router.post('/create', bodyParser.json(), createCompany)

//get a specific company
router.get('/get/:name', getCompany)

//Update a specific company
router.put('/update/:name', bodyParser.json(), updateCompany)

//Delete a specific company
router.delete('/delete/:name', deleteCompany)

module.exports = router;