const request = require('supertest')
const router = require('./routes/companies')
const Company = require('./models/companyModel')
const mongoose = require('mongoose')
const server = require('./index')
const app = require('./index')


const api = request(router)

describe('Company tests', () => {
    describe('POST calls', () => {
        test('create-company', async () => {
            //build a new item
            const newCompany = { name:'TestCompany' }
            const response = await api.post('/create').send(newCompany)
        
            const companies = await Company.find({})
            
            expect(companies[companies.length-1].name).toBe("TestCompany")
        })
    
        test('update-company', async () => {
            const name  = 'TestCompany'
            const newCompany = { 
                rating: 5, 
                tenure: 4, 
                Employees: ['12345321', '123412341'], 
                prevCompanies: ['Okta', 'Doordash'], 
                postCompanies: ['Amazon', 'Google', 'Reddit']
            }
    
            const response = await api.put(`/update/${name}`).send(newCompany)
            expect(response.ok).toBeTruthy()
            console.log("response: ", response.status)
    
            data = await response.body
            console.log("data", data)
        })

        test('delete-company', async () => {
            const name = 'TestCompany';
            const response = await api.delete(`/delete/${name}`)
    
            console.log("Delete response", response.status)
        })
    })
    
    describe('GET calls', () => {
    
        test('get-company', async () => {
            const name = 'TestCompany';
            const response = await api.get(`/get/${name}`);
        
            // Check if the response status is okay (status code 200-299)
            expect(response.ok).toBeTruthy();
        
            // Parse the JSON in the response
            const jsonData = await response.body;
        
            console.log("Get response", response.status);
            console.log("Response JSON: ", jsonData);
        
            // Now you can assert or perform further checks on the extracted JSON data
            expect(jsonData).toHaveProperty('name');
            expect(jsonData.name).toBe('TestCompany');
            // Add more assertions based on your JSON structure
        });
      
    })
})


afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})