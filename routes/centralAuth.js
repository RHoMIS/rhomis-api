const axios = require('axios')

const Form = require("../models/forms")
const Project = require("../models/projects")

const log = require('../validation/log');
const Log = require('../models/Log')


async function getCentralAuthToken() {
    log({
        file: './routes/centralAuth.js',
        line: '11',
        info: {
            message:'Getting central token'
        },
        type: 'message'
    }, Log)
    try {

        const central_token = await axios({
            url: process.env.CENTRALURL + "/v1/sessions",
            method: "post",
            data: {
                email: process.env.CENTRALEMAIL,
                password: process.env.CENTRALPASSWORD
            }
        })

        if (central_token.data === undefined) throw "Could not obtain central auth token"
        if (central_token.data.token === undefined) throw "Could not obtain central auth token"

        return central_token.data.token
    } catch (err) {

        log({
            file: './routes/centralAuth.js',
            line: '11',
            info: {
                message:'Failed to get ODK central token',
                error: err
            },
            type: 'message'
        }, Log)
        return "Could not obtain central token, err:" + err
    }
}


async function getSubmissionCounts(props) {
    const project = await Project.findOne({ "name": props.projectName })
    const form = await Form.findOne({ "project": props.projectName, "name": props.formName })


    const url = BuildSubmissionURL({
        form: form,
        project: project
    })
    console.log(url)


    const token = await getCentralAuthToken()
    const centralResponse = await axios({
        method: "get",
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
        .catch(function (error) {
            log({
                file: './routes/centralAuth.js',
                line: '72',
                info: {
                    message:'Failed to get ODK submission counts',
                    error: error
                },
                type: 'message'
            }, Log)
            
            console.log(error)
            throw error
        })


    const number_of_submissions = centralResponse.data.length

    return number_of_submissions

}

function BuildSubmissionURL(props) {


    if (props.form.draft === false) {
        return process.env.CENTRALURL + '/v1/projects/' + props.project.centralID + '/forms/' + props.form.centralID + '/submissions'
    }

    if (props.form.draft = true) {
        return process.env.CENTRALURL + '/v1/projects/' + props.project.centralID + '/forms/' + props.form.centralID + '/draft/submissions'
    }
}

module.exports = getSubmissionCounts