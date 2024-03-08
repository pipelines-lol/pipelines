const express = require("express");
const {
  createCompany,
  getCompany,
  getCompanies,
  updateCompany,
  updateCompanies,
  deleteCompany,
} = require("../controllers/companyController");
const router = express();
const bodyParser = require("body-parser");

//read a specific company
router.post("/create", bodyParser.json(), createCompany);

//get a specific company
router.get("/get/:name", getCompany);

//get multiple companies based on a query
router.get("/get/companies/:query", getCompanies);

//Update a specific company
router.patch("/update/:name", bodyParser.json(), updateCompany);

//Update a specific company
router.patch("/update", bodyParser.json(), updateCompanies);

//Delete a specific company
router.delete("/delete/:name", deleteCompany);

module.exports = router;
