const qs = require('querystring')
const axios = require('axios')

// having the envs here spits an error for some reason....
// const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
// const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
// const SCOPE = process.env.LINKEDIN_SCOPE
// const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI

const Authorization = () => {
    const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
    const SCOPE = process.env.LINKEDIN_SCOPE
    const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI

    return encodeURI(`https://linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`)
}

const Redirect = async (code) => {
    const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
    const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
    const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI

    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code: code
    }

    const { data } = await axios ({
        url: `https://linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`,
        method: 'POST',
        headers: {
            'Content-Type': 'x-www-form-urlencoded'
        }
    }).then ((response) => {
        return response;
    }).catch ((error) => {
        return error;
    })

    return data;
}

module.exports = {
    Authorization,
    Redirect
}