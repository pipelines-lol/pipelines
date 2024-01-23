const request = require('supertest')
const router = require('./routes/companies')
const Company = require('./models/companyModel')
const mongoose = require('mongoose')
const app = require('./index')


const api = request(router)

describe('POST calls', () => {
    test('create-company', async () => {
        //build a new item
        const newCompany = { name:'TestCompany' }
        const response = await api.post('/create').send(newCompany)
    
        const companies = await Company.find({})
        
        expect(companies[companies.length-1].name).toBe("TestCompany")
    })
})

describe('GET calls', () => {
    test('delete-company', async () => {
        const name = 'TestCompany';
        const response = await api.delete(`/delete/${name}`)

        console.log("Delete response", response.status)
    })
  
})


afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    app.listen()
    mongoose.connection.close()
    done()
})