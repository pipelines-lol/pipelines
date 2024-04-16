const express = require("express");
const bodyParser = require("body-parser");
const {
  createCompany,
  getCompany,
  getCompanyByName,
  getCompanies,
  getEmployees,
  updateCompany,
  updateCompanies,
  deleteCompany,
} = require("../controllers/companyController");

const read = express.Router();
const write = express.Router();

//read a specific company
write.post("/create", bodyParser.json(), createCompany);

//get a specific company
read.get("/get/:id", getCompany);

// get a specific company by name
read.get("/getBy", getCompanyByName);

//get multiple companies based on a query
read.get("/get/companies/:query", getCompanies);

// get profiles of employees that work at company
read.get("/employees/:id", getEmployees);

//Update a specific company
// ! TEMP READ COMMAND
// TODO: change up backend to remove client changing of companies
read.patch("/update/:id", bodyParser.json(), updateCompany);

//Update a specific company
// ! TEMP READ COMMAND
// TODO: change up backend to remove client changing of companies
read.patch("/update", bodyParser.json(), updateCompanies);

//Delete a specific company
write.delete("/delete/:id", deleteCompany);

module.exports = {
  read,
  write,
};
