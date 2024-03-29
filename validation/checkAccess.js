const axios = require('axios')

const projectData = require("../models/projectData")
const Form = require("../models/forms")
const Project = require("../models/projects")


// Middle ware function (add to protected routes)

async function SyncWithAuthenticator(props) {

    // Saving Project
    try {



        const projects = props.projects

        for (let project_index = 0; project_index < projects.length; project_index++) {
            let project = projects[project_index]
            await Project.updateOne(
                {
                    "_id": project._id
                }, //query
                project, // New Data
                { upsert: true },
                function (err, doc) {
                    if (err) {
                        console.log(err)
                        return err
                    };

                    return "Success";
                }//error handler
            )

        }


        const forms = props.forms

        for (let form_index = 0; form_index < forms.length; form_index++) {
            let form = forms[form_index]

            await Form.updateOne(
                {
                    "_id": form._id
                }, //query
                form, // New Data
                { upsert: true },
                function (err, doc) {
                    if (err) {
                        console.log(err)
                        return err
                    };
                    return "Success";
                }//error handler
            )


            await projectData.updateOne(
                {
                    "projectID": form.project,
                    "formID": form.name
                }, //query
                {
                    "projectID": form.project,
                    "formID": form.name
                }, // New Data
                { upsert: true },
                function (err, doc) {
                    if (err) {
                        console.log(err)
                        return err
                    };
                    return "Success";
                }//error handler
            )
        }




        return (true)

    } catch (err) {
        return false
    }



}



















async function auth(req, res, next) {
    // Checking if a request has a token
    const token = req.header('Authorization')

    console.log(req.body)
    // If token doesn't exist, give access denied
    if (!token) return res.status(401).send('Access Denied');

    try {
        const userInformation = await axios({
            method: 'post',
            url: process.env.AUTHENTICATORURL + "/api/meta-data",
            headers: {
                'Authorization': token
            }
        })
        console.log("User Information")



        if (userInformation.data === undefined) {
            throw "Did not find information with the user";
        }

        await SyncWithAuthenticator(userInformation.data)

        req.user = {}
        req.user.information = userInformation.data
        next();

    } catch (err) {
        console.log(err)
        res.status(400).send(err.response.data)
    }
}
module.exports = auth;
