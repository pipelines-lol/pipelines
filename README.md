# Pipelines

## LinkedIn Pipeline and Profile Management

This project is a web application that provides functionality to manage pipelines and profiles on LinkedIn. It leverages MongoDB as the database, Nodejs and Expressjs for the backend, and Reactjs for the frontend.

## Features

1. **Get Pipelines**: Retrieve a list of pipelines.

2. **Get Pipelines By Company**: Fetch pipelines & users associated with a specific company.

3. **Get Random Pipelines**: Get a random set of pipelines.

4. **Remove Experience on LinkedIn**: Remove existing experience entries on pipelines' LinkedIn profiles.

5. **Add LinkedIn Experience**: Add new experience entries to pipelines' Linkedin profiles.

6. **Get Profiles**: Retrieve a list of user profiles and their LinkedIn companies & potential experience from pipelines.lol.

7. **Delete Profiles**: Remove user profiles and their LinkedIn profiles from the pipelines.lol webpage.

8. **Update Profiles**: Modify existing user profiles.

## Technologies Used

- **MongoDB**: A NoSQL database used to store and retrieve pipeline and profile data.

- **Express.js**: A Node.js web application framework used for building the backend API.

- **React**: A JavaScript library for building user interfaces, used for the frontend development.

- **Node.js**: A JavaScript runtime for server-side JavaScript execution.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pipelines-lol/pipelines.git
   cd pipelines-lol
2. Install dependencies:

   ```bash
   npm install
3. Set up MongoDB:

- Ensure you have a running MongoDB instance.
- Configure the database connection in server/config/db.js.

4. Configure your .env
   
- Set up your configured LinkedIn API Keys and MongoDB connection key
  
5. Start the application:

   ```bash
   npm start
This command will start both the backend and frontend servers.

## Usage
Access the application at http://localhost:3000 in your web browser.
Use the provided API endpoints for managing pipelines and profiles.

## API Endpoints

- GET /api/pipelines: Get all pipelines.
- GET /api/pipelines/company/:companyId: Get pipelines by company.
- GET /api/pipelines/random: Get random pipelines.
- DELETE /api/linkedin/experience/:profileId/:experienceId: Remove experience on LinkedIn.
- POST /api/linkedin/experience/:profileId: Add LinkedIn experience.
- GET /api/profiles: Get all profiles.
- DELETE /api/profiles/:profileId: Delete a profile.
- PUT /api/profiles/:profileId: Update a profile.
- Add more endpoints as you like

## Contributing
Feel free to contribute to this project by opening issues or creating pull requests. Make sure to follow the code of conduct.
