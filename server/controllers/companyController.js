const Company = require("../models/companyModel");
const Profile = require("../models/profileModel");
const utils = require("../utils/generalUtils");
const math = require("mathjs");

const createCompany = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "No company name given." });
  }

  const { displayName, logo, description } = req.body;
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
      displayName: displayName,
      logo: logo || "",
      description: description || "",
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

  // special case because of getCompanies
  // call looks like: /api/company/get/companies/
  if (name === "companies" || name === "companies/") {
    const companies = await Company.find({});
    return res.status(200).json(companies);
  }

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
  const { id } = req.params;
  const companyArray = req.body;
  const company = companyArray[0];
  const pipeline = companyArray[1];
  const oldSchool = companyArray[2];

  if (!companyArray) return res.status(200).json({ message: "success" });

  try {
    const updateData = {
      $inc: {},
      $addToSet: {},
      $pull: {},
    };
    if (company.remove) {
      //update Company tally
      updateData.$inc[`schoolTally.${oldSchool}`] = -1;
      //Set update rating
      updateData.$inc["rating"] = company.rating * -1;

      //Set update Tenure
      let difference = 0;
      if (!company.indefinite) {
        const differenceMs =
          new Date(company.endDate) - new Date(company.startDate); // calc diff in ms
        // Convert the difference to days
        difference = math.round(differenceMs / (1000 * 60 * 60 * 24));
      } else if (
        company.isIndefinite &&
        new Date(company.startDate) < new Date()
      ) {
        // Calculate the difference in milliseconds
        const differenceMs = math.abs(date2 - date1);
        // Convert the difference to days
        difference = math.round(differenceMs / (1000 * 60 * 60 * 24));
      }
      // Add employees
      updateData.$inc["tenure"] = difference * -1;
      updateData.$pull["Employees"] = company.userId;
      updateData.$pull["interns"] = company.userId;
      updateData.$pull["ratedEmployees"] = company.userId;

      //update pipelines accordingly
      const prevCompanies = pipeline
        .slice(0, company.index)
        .map((item) => item.companyName);

      const postCompanies = pipeline
        .slice(company.index)
        .map((item) => item.companyName);

      //Iterate through and update each prior company accordingly
      for (let i = 0; i < prevCompanies.length; i++) {
        const updateName = prevCompanies[i];
        updateData.$inc[`prevCompanies.${updateName}`] = -1;

        // remove self from other company
        const response = await Company.updateOne(
          { name: updateName },
          { $inc: { [`postCompanies.${company.name}`]: -1 } }
        );

        // Notify when there's an issue updating a company
        if (!response) console.log(`Error updating ${updateName}`);
      }

      //Iterate through and update each next company accordingly
      for (let i = 0; i < postCompanies.length; i++) {
        const updateName = postCompanies[i];
        updateData.$inc[`postCompanies.${updateName}`] = -1;

        // remove self from other company
        const response = await Company.updateOne(
          { name: updateName },
          { $inc: { [`prevCompanies.${company.name}`]: -1 } }
        );

        // Notify when there's an issue updating a company
        if (!response) console.log(`Error updating ${updateName}`);
      }
    } else {
      //update school tally data
      updateData.$inc[`schoolTally.${oldSchool}`] = 1;
      //Set update rating
      updateData.$inc["rating"] = company.rating;

      //Set update Tenure
      let difference = 0;
      if (!company.indefinite) {
        const differenceMs =
          new Date(company.endDate) - new Date(company.startDate); // calc diff in ms
        // Convert the difference to days
        difference = math.round(differenceMs / (1000 * 60 * 60 * 24));
      } else if (
        company.isIndefinite &&
        new Date(company.startDate) < new Date()
      ) {
        // Calculate the difference in milliseconds
        const differenceMs = math.abs(date2 - date1);
        // Convert the difference to days
        difference = math.round(differenceMs / (1000 * 60 * 60 * 24));
      }
      // Add employees
      updateData.$inc["tenure"] = difference;
      updateData.$addToSet["Employees"] = company.userId;
      updateData.$addToSet["interns"] = company.userId;
      updateData.$addToSet["ratedEmployees"] = company.userId;

      //update pipelines
      //update pipelines accordingly
      const prevCompanies = pipeline
        .slice(0, company.index)
        .map((item) => item.companyName);

      const postCompanies = pipeline
        .slice(company.index + 1)
        .map((item) => item.companyName);

      //Iterate through and update each prior company accordingly
      for (let i = 0; i < prevCompanies.length; i++) {
        const updateName = prevCompanies[i];
        updateData.$inc[`prevCompanies.${updateName}`] = 1;

        // remove self from other company
        const response = await Company.updateOne(
          { name: updateName },
          { $inc: { [`postCompanies.${company.name}`]: 1 } }
        );

        // Notify when there's an issue updating a company
        if (!response) console.log(`Error updating ${updateName}`);
      }

      //Iterate through and update each next company accordingly
      for (let i = 0; i < postCompanies.length; i++) {
        const updateName = postCompanies[i];
        updateData.$inc[`postCompanies.${updateName}`] = 1;

        // remove self from other company
        const response = await Company.updateOne(
          { name: updateName },
          { $inc: { [`prevCompanies.${company.name}`]: 1 } }
        );

        // Notify when there's an issue updating a company
        if (!response) console.log(`Error updating ${updateName}`);
      }
    }

    const response = await Company.updateOne({ _id: id }, updateData);
    if (!response) res.status(401).json({ message: "Error Updating Company" });
    console.log(
      `${company.name} updated
      Added interns: ${updateData.$addToSet["interns"]}
      removed interns: ${updateData.$pull["interns"]}
      added employees: ${updateData.$addToSet["Employees"]}
      Removed Employees: ${updateData.$pull["Employees"]}
      added raters: ${updateData.$addToSet["ratedEmployees"]}
      removed raters: ${updateData.$pull["ratedEmployees"]}
      rating change ${updateData.$inc["rating"]}
      tenure change ${updateData.$inc["tenure"]}\n`
    );
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).send("Error updating company");
  }
};

const updateCompanies = async (req, res) => {
  const companyArray = req.body;

  if (!companyArray)
    return res.status(200).json({ message: "No companies provided" });

  let foundOrUpdated = false; // Variable to track if any companies were found or updated

  try {
    const companies = companyArray[0]; // New Pipeline
    const origCompanies = companyArray[1]; // Old Pipeline
    const newSchool = companyArray[2][0];
    const oldSchool = companyArray[2][1];
    console.log("New School: ", newSchool);
    console.log("Old School: ", oldSchool);

    const user = await Profile.findById(companies[0].userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i]; //store current company

      //Find the original state of the company using binary search
      let found = -1;
      let searchArr = origCompanies.map((comp) => comp.tempId2);
      found = utils.binarySearch(searchArr, company.tempId2);

      //Initialize update data
      const updateData = {
        $inc: {},
        $addToSet: {},
        $pull: {},
      };

      if (found !== -1) {
        //if the school changed update the data accordingly
        if (oldSchool && newSchool && oldSchool !== newSchool) {
          updateData.$inc[`schoolTally.${newSchool}`] = 1;
          updateData.$inc[`schoolTally.${oldSchool}`] = -1;
        } else if (newSchool && !oldSchool) {
          updateData.$inc[`schoolTally.${newSchool}`] = 1;
        } else if (!newSchool && oldSchool) {
          updateData.$inc[`schoolTally.${oldSchool}`] = -1;
        }

        //2. calculate tenure and add it to updateData correspondingly
        let newDifference = 0;
        let origDifference = 0;
        //2a. calculate new tenure
        if (!company.indefinite) {
          const differenceMs =
            new Date(company.endDate) - new Date(company.startDate); // calc diff in ms
          // Convert the difference to days
          newDifference = math.round(differenceMs / (1000 * 60 * 60 * 24));
        } else if (
          company.isIndefinite &&
          new Date(company.startDate) < new Date()
        ) {
          // Calculate the difference in milliseconds
          const differenceMs = math.abs(date2 - date1);

          // Convert the difference to days
          newDifference = math.round(differenceMs / (1000 * 60 * 60 * 24));
        }

        //2b. calculate old tenure
        if (!origCompanies[found].indefinite) {
          const origDate1 = new Date(origCompanies[found].startDate);
          const origDate2 = new Date(origCompanies[found].endDate);

          const origDifferenceMs = origDate2 - origDate1;

          origDifference = origDifferenceMs / (1000 * 60 * 60 * 24);
        } else if (
          company.isIndefinite &&
          new Date(company.startDate) < new Date()
        ) {
          const origDate1 = new Date(origCompanies[found].startDate);
          const origDate2 = new Date(); //Get new date
          const origMs = origDate2 - origDate1;
          origDifference = math.round(origMs / (1000 * 60 * 60 * 24));
        }

        //2c. calculate the new total tenure and add to update data
        const totalTenure = newDifference - origDifference;
        updateData.$inc["tenure"] = totalTenure;

        //3. calculate correct rating and add it to the update data
        const totalRating = company.rating - origCompanies[found].rating;
        updateData.$inc["rating"] = totalRating;

        //4. Add employees
        //4a. Decipher between interns and full time workers
        const containsIntern = company.title.includes("intern");
        if (containsIntern) {
          updateData.$addToSet["interns"] = company.userId;
        } else {
          updateData.$addToSet["Employees"] = company.userId;
        }

        //4b. Check to add ratedEmployees
        if (company.rating > 0)
          updateData.$addToSet["ratedEmployees"] = company.userId;

        //5. Pull from required employee fields
        //5a. decipher which employee fields to pull from
        const origLowerTitle = origCompanies[found].title.toLowerCase();
        const origContainsIntern = origLowerTitle.includes("intern");

        if (!containsIntern && origContainsIntern) {
          updateData.$pull["interns"] = company.userId;
        } else if (containsIntern && !origContainsIntern) {
          updateData.$pull["Employees"] = company.userId;
        }

        //5b. pull from rated employee fields if needed
        if (company.rating === 0 && origCompanies[found].rating > 0) {
          updateData.$pull["ratedEmployees"] = company.userId;
        }

        //6. Increment and decrement required pipeline fields
        //6a.Get New Pipeline
        const newPrevCompanies = companies.slice(0, i).map((item) => item.name);

        const newPostCompanies = companies
          .slice(i + 1)
          .map((item) => item.name);

        //6b.Get Old pipeline
        const origPrevCompanies = origCompanies
          .slice(0, found)
          .map((item) => item.companyName);

        const origPostCompanies = origCompanies
          .slice(found + 1)
          .map((item) => item.companyName);

        //6c. Decide which previous companies need to be incremented
        for (let i = 0; i < newPrevCompanies.length; i++) {
          const newCompanyName = newPrevCompanies[i];
          if (!origPrevCompanies.includes(newCompanyName)) {
            updateData.$inc[`prevCompanies.${newCompanyName}`] = 1;
          }
        }

        //Decide which next companies need to be incremented
        for (let i = 0; i < newPostCompanies.length; i++) {
          const newCompanyName = newPostCompanies[i];
          if (!origPostCompanies.includes(newCompanyName)) {
            updateData.$inc[`postCompanies.${newCompanyName}`] = 1;
          }
        }

        //6d. Decide which prev comanies need to be decremented
        for (let i = 0; i < origPrevCompanies.length; i++) {
          const newCompanyName = origPrevCompanies[i];
          if (!newPrevCompanies.includes(newCompanyName)) {
            updateData.$inc[`prevCompanies.${newCompanyName}`] = -1;
          }
        }

        // Decide which next comanies need to be decremented
        for (let i = 0; i < origPostCompanies.length; i++) {
          const newCompanyName = origPostCompanies[i];
          if (!newPostCompanies.includes(newCompanyName)) {
            updateData.$inc[`postCompanies.${newCompanyName}`] = -1;
          }
        }
      } else {
        //Update school tally
        updateData.$inc[`schoolTally.${newSchool}`] = 1;
        //add rating
        updateData.$inc["rating"] = company.rating;
        //2. Calculate tenure
        let difference = 0;
        //2a. calculate new tenure
        if (!company.indefinite) {
          const differenceMs =
            new Date(company.endDate) - new Date(company.startDate); // calc diff in ms
          // Convert the difference to days
          difference = math.round(differenceMs / (1000 * 60 * 60 * 24));
        } else if (
          company.isIndefinite &&
          new Date(company.startDate) < new Date()
        ) {
          // Calculate the difference in milliseconds
          const differenceMs = math.abs(date2 - date1);
          // Convert the difference to days
          difference = math.round(differenceMs / (1000 * 60 * 60 * 24));
        }
        //2b. set Update Data tenure
        updateData.$inc["tenure"] = difference;
        //3. update employees
        //3a. decipher which employee field to add
        const containsIntern = company.title.includes("intern");
        if (containsIntern) {
          updateData.$addToSet["interns"] = company.userId;
        } else {
          updateData.$addToSet["Employees"] = company.userId;
        }

        //3b. Check to add ratedEmployees
        if (company.rating > 0)
          updateData.$addToSet["ratedEmployees"] = company.userId;

        //4 add pipelines
        //4a. get pipelines
        const prevCompanies = companies.slice(0, i).map((item) => item.name);
        const postCompanies = companies.slice(i + 1).map((item) => item.name);

        //4b. Increment previous companies
        for (let i = 0; i < prevCompanies.length; i++) {
          const newCompanyName = prevCompanies[i];
          updateData.$inc[`prevCompanies.${newCompanyName}`] = 1;
        }

        //4c. Increment next companies
        for (let i = 0; i < postCompanies.length; i++) {
          const newCompanyName = postCompanies[i];
          updateData.$inc[`postCompanies.${newCompanyName}`] = 1;
        }
      }
      const response = await Company.updateOne(
        { _id: company.companyId },
        updateData
      );

      if (!response) res.status(401).json({ message: "No company found" });

      console.log(
        `${company.name} updated
        Added interns: ${updateData.$addToSet["interns"]}
        removed interns: ${updateData.$pull["interns"]}
        added employees: ${updateData.$addToSet["Employees"]}
        Removed Employees: ${updateData.$pull["Employees"]}
        added raters: ${updateData.$addToSet["ratedEmployees"]}
        removed raters: ${updateData.$pull["ratedEmployees"]}
        rating change ${updateData.$inc["rating"]}
        tenure change ${updateData.$inc["tenure"]}\n`
      );

      foundOrUpdated = true;
    }

    // Send a response after the loop has completed
    if (foundOrUpdated) {
      return res.status(200).json({ message: "Successfully updated company" });
    } else {
      return res.status(401).json({ message: "No company found or updated" });
    }
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
