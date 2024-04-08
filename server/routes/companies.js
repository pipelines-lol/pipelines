const express = require("express");
const bodyParser = require("body-parser");
const {
  createCompany,
  getCompany,
  getCompanies,
  updateCompany,
  updateCompanies,
  deleteCompany,
} = require("../controllers/companyController");

const read = express.Router();
const write = express.Router();

//read a specific company
write.post("/create", bodyParser.json(), createCompany);

//get a specific company
read.get("/get/:name", getCompany);

//get multiple companies based on a query
read.get("/get/companies/:query", getCompanies);

//Update a specific company
// ! TEMP READ COMMAND
// TODO: change up backend to remove client changing of companies
read.patch("/update/:id", bodyParser.json(), updateCompany);

//Update a specific company
// ! TEMP READ COMMAND
// TODO: change up backend to remove client changing of companies
read.patch("/update", bodyParser.json(), updateCompanies);

//Delete a specific company
write.delete("/delete/:name", deleteCompany);

module.exports = {
  read,
  write,
};
