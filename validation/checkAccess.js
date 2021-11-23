const axios = require('axios')
// Middle ware function (add to protected routes)

async function auth(req, res, next) {
    // Checking if a request has a token
    const token = req.header('Authorization')


    // If token doesn't exist, give access denied
    if (!token) return res.status(401).send('Access Denied');

    try {
        const userInformation = await axios({
            method: 'get',
            url: process.env.AUTHENTICATORURL + "/api/meta-data",
            headers: {
                'Authorization': token
            }
        })


        if (userInformation.data === undefined) {
            throw "Did not find information with the user";
        }



        req.user = {}
        req.user.information = userInformation.data
        console.log(req.user.information)
        next();

    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}
module.exports = auth;
