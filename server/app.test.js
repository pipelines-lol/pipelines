const request = require('supertest')
const router = require('./routes/companies')
const Company = require('./models/companyModel')
const mongoose = require('mongoose')
const app = require('./index')

const api = request(router)

test('POST call', async () => {
    //build a new item
    const newCompany = { name: 'TestCompany' }
    const response = await api.post('/create').send(newCompany)

    console.log("response: ", response.status)

    const companies = await Company.find({})
    
    expect(companies[companies.length-1].name).toBe("TestCompany")
})

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    app.listen()
    mongoose.connection.close()
    done()
})