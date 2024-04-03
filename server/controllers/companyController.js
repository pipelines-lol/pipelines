const Company = require("../models/companyModel");
const Profile = require("../models/profileModel");
const router = require("../routes/profiles");
const mongoose = require("mongoose");

const createCompany = async (req, res) => {
  const name = req.body.name.toLowerCase();

  try {
    // Check if the company with the given name already exists
    const existingCompany = await Company.findOne({ name: name });

    if (existingCompany) {
      return res
        .status(400)
        .json({ error: "Company with the same name already exists." });
    }

    // Create a new company instance
    const newCompany = new Company({
      name: name,
      rating: 0,
      prevCompanies: {},
      postCompanies: {},
      tenure: 0,
      Employees: [],
      ratedEmployees: [],
      interns: [],
    });

    // Save the new company to the database
    const savedCompany = await newCompany.save();

    //* Logs
    console.log(`New company created: ${savedCompany.name}`);
    console.log(savedCompany);

    res.status(201).json(savedCompany);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create company." });
  }
};

const getCompany = async (req, res) => {
  const { name } = req.params;

  try {
    // Find the company by name in the database
    const lowercaseCompanyName = name.toLowerCase();
    const company = await Company.findOne({ name: lowercaseCompanyName });

    // Check if the company exists
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    return res.status(200).json(company);
  } catch (err) {
    return res.status(400).json({ error: "Failed to retrieve company" });
  }
};

const getCompanies = async (req, res) => {
  const { query } = req.params;

  try {
    // Create a regular expression to find documents that start with the query
    const regex = new RegExp("^" + query, "i"); // "i" for case-insensitive search

    // Find companies that match the regex
    const companies = await Company.find({ name: regex });

    res.status(200).json(companies);
  } catch (err) {
    return res.status(400).json({ error: "Failed to retrieve company " });
  }
};

const updateCompany = async (req, res) => {
  //update company on user registration
  const name = req.params.name;
  const {
    rating,
    prevCompanies,
    postCompanies,
    tenure,
    Employees,
    ratedEmployees,
    interns,
    removeRatedEmployees,
    removeInterns,
    prevRemoveCompanies,
    postRemoveCompanies,
    prevRemoveOtherCompanies,
    postRemoveOtherCompanies,
    removeRating,
    removeEmployees,
  } = req.body;
  const lowercaseCompanyName = name.toLowerCase();

  try {
    if (Employees && Employees.length > 0) {
      for (const employee of Employees) {
        const user = await Profile.findById(employee);

        if (!user) {
          res.status(404).json({ error: "Employee ID not found" });
        }
      }
    }

    if (!removeEmployees || !(removeEmployees.length > 0)) {
      const response = await Company.updateOne(
        { name: lowercaseCompanyName },
        {
          $inc: {
            rating: (rating ? rating : 0) - (removeRating ? removeRating : 0),
            tenure: tenure ? tenure : 0,
          },
          $addToSet: {
            Employees: { $each: Employees || [] }, // Appending the provided Employees list or an empty array if not provided
            ratedEmployees: { $each: ratedEmployees || [] },
            interns: { $each: interns || [] },
          },
        }
      );

      if (!response) {
        res.status(404).json({ error: "company not found" });
      }
    } else {
      const response = await Company.updateOne(
        { name: lowercaseCompanyName },
        {
          $inc: {
            rating: (rating ? rating : 0) - (removeRating ? removeRating : 0),
            tenure: tenure ? tenure : 0,
          },
          $pull: {
            Employees: { $in: removeEmployees },
            ratedEmployees: { $in: removeEmployees },
            interns: { $in: removeEmployees },
          },
        }
      );

      if (!response) {
        res.status(404).json({ error: "company not found" });
      }
    }

    if (removeRatedEmployees) {
      const response = await Company.updateOne(
        { name: lowercaseCompanyName },
        {
          $pull: { $in: removeRatedEmployees },
        }
      );

      if (!response) {
        res.status(404).json({ error: "company not found" });
      }
    }

    if (removeInterns) {
      const response = await Company.updateOne(
        { name: lowercaseCompanyName },
        {
          $pull: { $in: removeInterns },
        }
      );

      if (!response) {
        res.status(404).json({ error: "company not found" });
      }
    }

    //Increment list of previous companies
    if (prevCompanies && prevCompanies.length > 0) {
      for (const companyName of prevCompanies) {
        const updateData = {
          $inc: {},
        };

        // Construct the dynamic key within $inc
        updateData.$inc[`prevCompanies.${companyName.toLowerCase()}`] = 1;

        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          updateData
        );

        if (!response) {
          res
            .status(404)
            .json({ error: `Company not found for ${companyName}` });
          return;
        }
      }
    }

    //Increment list of postCompanies
    if (postCompanies && postCompanies.lenth > 0) {
      for (const companyName of postCompanies) {
        const updateData = {
          $inc: {},
        };

        // Construct the dynamic key within $inc
        updateData.$inc[`postCompanies.${companyName.toLowercase()}`] = 1;

        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          updateData
        );

        if (!response) {
          res
            .status(404)
            .json({ error: `Company not found for ${companyName}` });
          return;
        }
      }
    }

    // decrement list of removedCompanies
    if (postRemoveCompanies && postRemoveCompanies.length > 0) {
      for (const companyName of postRemoveCompanies) {
        const updateData = {
          $inc: {},
        };

        // Construct the dynamic key within inc
        updateData.$inc[`postCompanies.${companyName.toLowerCase()}`] = -1;

        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          updateData
        );

        if (!response) {
          res
            .status(404)
            .json({ error: `Company not found for ${companyName}` });
          return;
        }
      }
    }

    if (prevRemoveCompanies && prevRemoveCompanies.length > 0) {
      for (const companyName of prevRemoveCompanies) {
        const updateData = {
          $inc: {},
        };

        updateData.$inc[`prevCompanies.${companyName.toLowerCase()}`] = -1;

        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          updateData
        );

        if (!response) {
          res
            .status(404)
            .json({ error: `Company not found for ${companyName}` });
          return;
        }
      }
    }

    if (prevRemoveOtherCompanies && prevRemoveOtherCompanies.length > 0) {
      for (const companyName of prevRemoveOtherCompanies) {
        const updateData = {
          $inc: {},
        };

        updateData.$inc[`prevCompanies.${lowercaseCompanyName}`] = -1;
        const response = await Company.updateOne(
          { name: companyName.toLowerCase() },
          updateData
        );

        if (!response) {
          res
            .status(404)
            .json({ error: `Company not found for ${companyName}` });
          return;
        }
      }
    }

    if (postRemoveOtherCompanies && postRemoveOtherCompanies.length > 0) {
      for (const companyName of postRemoveOtherCompanies) {
        const updateData = {
          $inc: {},
        };

        updateData.$inc[`postCompanies.${lowercaseCompanyName}`] = -1;

        const response = await Company.updateOne(
          { name: companyName.toLowerCase() },
          updateData
        );

        if (!response) {
          res
            .status(404)
            .json({ error: `Company not found for ${companyName}` });
          return;
        }
      }
    }

    //* Logs
    console.log(`Company updated: ${name}`);
    // console.log() //TODO: log updated company data

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Not able to update company" });
  }
};

const updateCompanies = async (req, res) => {
  const { companies } = req.body;

  if (!companies)
    return res.status(200).json({ message: "No companies provided" });

  try {
    for (const company of companies) {
      const {
        name,
        rating,
        prevCompanies,
        postCompanies,
        tenure,
        Employees,
        ratedEmployees,
        interns,
        prevRemoveCompanies,
        postRemoveCompanies,
        prevRemoveOtherCompanies,
        postRemoveOtherCompanies,
        removeRating,
        removeEmployees,
        removeRatedEmployees,
      } = company;
      const lowercaseCompanyName = name.toLowerCase();

      if (Employees && Employees.length > 0) {
        for (const employee of Employees) {
          const user = await Profile.findById(employee);

          if (!user) {
            res.status(404).json({ error: "Employee ID not found" });
          }
        }
      }

      if (!removeEmployees || !(removeEmployees.length > 0)) {
        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          {
            $inc: {
              rating: (rating ? rating : 0) - (removeRating ? removeRating : 0),
              tenure: tenure ? tenure : 0,
            },
            $addToSet: {
              Employees: { $each: Employees || [] }, // Appending the provided Employees list or an empty array if not provided
              ratedEmployees: { $each: ratedEmployees || [] },
              interns: { $each: interns || [] },
            },
          }
        );

        if (!response) {
          res.status(404).json({ error: "company not found" });
        }
      } else {
        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          {
            $inc: {
              rating: (rating ? rating : 0) - (removeRating ? removeRating : 0),
              tenure: tenure ? tenure : 0,
            },
            $pull: {
              Employees: { $in: removeEmployees },
              ratedEmployees: { $in: removeEmployees },
              interns: { $in: removeEmployees },
            },
          }
        );

        if (!response) {
          res.status(404).json({ error: "company not found" });
        }
      }

      //remove rated employees
      if (removeRatedEmployees && removeRatedEmployees.length > 0) {
        const response = await Company.updateOne(
          { name: lowercaseCompanyName },
          { $pull: { ratedEmployees: { $in: removeRatedEmployees } } }
        );

        if (!response) {
          res.status(404).json({ error: "Company not found" });
          return;
        }
      }

      //Increment list of previous companies
      if (prevCompanies && prevCompanies.length > 0) {
        for (const companyName of prevCompanies) {
          const updateData = {
            $inc: {},
          };

          // Construct the dynamic key within $inc
          updateData.$inc[`prevCompanies.${companyName.toLowerCase()}`] = 1;

          const response = await Company.updateOne(
            { name: lowercaseCompanyName },
            updateData
          );

          if (!response) {
            res
              .status(404)
              .json({ error: `Company not found for ${companyName}` });
            return;
          }
        }
      }

      //Increment list of postCompanies
      if (postCompanies && postCompanies.length > 0) {
        for (const companyName of postCompanies) {
          const updateData = {
            $inc: {},
          };

          // Construct the dynamic key within $inc
          updateData.$inc[`postCompanies.${companyName.toLowerCase()}`] = 1;

          const response = await Company.updateOne(
            { name: lowercaseCompanyName },
            updateData
          );

          if (!response) {
            res
              .status(404)
              .json({ error: `Company not found for ${companyName}` });
            return;
          }
        }
      }

      // decrement list of removedCompanies
      if (postRemoveCompanies && postRemoveCompanies.length > 0) {
        for (const companyName of postRemoveCompanies) {
          const updateData = {
            $inc: {},
          };

          // Construct the dynamic key within $inc
          updateData.$inc[`postCompanies.${companyName.toLowerCase()}`] = -1;

          const response = await Company.updateOne(
            { name: lowercaseCompanyName },
            updateData
          );

          if (!response) {
            res
              .status(404)
              .json({ error: `Company not found for ${companyName}` });
            return;
          }
        }
      }

      // decrement list of previous companies
      if (prevRemoveCompanies && prevRemoveCompanies.length > 0) {
        for (const companyName of prevRemoveCompanies) {
          const updateData = {
            $inc: {},
          };

          // Construct the dynamic key within $inc
          updateData.$inc[`prevCompanies.${companyName.toLowerCase()}`] = -1;

          const response = await Company.updateOne(
            { name: lowercaseCompanyName },
            updateData
          );

          if (!response) {
            res
              .status(404)
              .json({ error: `Company not found for ${companyName}` });
            return;
          }
        }
      }

      if (prevRemoveOtherCompanies && prevRemoveOtherCompanies.length > 0) {
        for (const companyName of prevRemoveOtherCompanies) {
          const updateData = {
            $inc: {},
          };

          updateData.$inc[`prevCompanies.${lowercaseCompanyName}`] = -1;

          const response = await Company.updateOne(
            { name: companyName.toLowerCase() },
            updateData
          );

          if (!response) {
            res
              .status(404)
              .json({ error: `Company not found for ${companyName}` });
            return;
          }
        }
      }

      if (postRemoveOtherCompanies && postRemoveOtherCompanies.length > 0) {
        for (const companyName of postRemoveOtherCompanies) {
          const updateData = {
            $inc: {},
          };

          updateData.$inc[`postCompanies.${lowercaseCompanyName}`] = -1;

          const response = await Company.updateOne(
            { name: companyName.toLowerCase() },
            updateData
          );

          if (!response) {
            res
              .status(404)
              .json({ error: `Company not found for ${companyName}` });
            return;
          }
        }
      }
    }

    //* Logs
    console.log(`Companies updated: ${companies}`);
    // console.log() //TODO: log updated company data

    res.status(200).json({ message: "succesful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Not able to update company" });
  }
};

const deleteCompany = async (req, res) => {
  const name = req.params.name;
  const lowercaseCompanyName = name.toLowerCase();
  const company = await Company.findOneAndDelete({
    name: lowercaseCompanyName,
  });

  if (!company) {
    return res.status(404).json({ error: "No such company." });
  }

  //* Logs
  console.log(`Company deleted: ${name}`);
  console.log(company);

  res.status(200).json(company);
};

module.exports = {
  createCompany,
  getCompany,
  getCompanies,
  updateCompany,
  updateCompanies,
  deleteCompany,
};
