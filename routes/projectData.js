const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/checkAccess')

const projectData = require('../models/projectData')
const Form = require('../models/forms')
const Project = require('../models/projects')

const units_and_conversions = require("../models/unitsAndConversions")
const units_and_conversions_log = require("../models/unitsAndConversionsLog")

const log = require('../validation/log');
const Log = require('../models/Log')

const data = require("../models/data");

let config = require('config'); //we load the db location from the JSON files
const authURL = config.get('authURL')

const axios = require('axios')

const getSubmissionCounts = require("./centralAuth")


router.post("/", auth, async (req, res) => {

   



    if (!req.body.projectName) {
        return res.status(400).send("Need to send a project name in request")
    }
    if (!req.body.formName) {
        return res.status(400).send("Need to send a form name in request")
    }

    if (req.user.information.user.roles.projectManager.includes(req.body.projectName) === false &
        req.user.information.user.roles.analyst.includes(req.body.formName) === false
    ) {
        return res.status(400).send("Unauthorized")
    }

    try {

        var projectInfo = await projectData.findOne({ "formID": req.body.formName, "projectID": req.body.projectName })

        var response = JSON.parse(JSON.stringify(projectInfo))

        if (!response) return res.status(400).send("No project with those details found")
        return res.status(200).send(response)

    } catch (err) {
        log({
            file: './routes/processData.js',
            line: '50',
            info: {
                message:'Error trying to find project details',
                data:{
                    user_id: req.user._id,
                    error: err
                }
            },
            type: 'message'
        }, Log)
        return res.status(400).send(err)
    }
})


// Create a project from data submitted through api.
router.post("/create-external", auth, async (req,res) =>{

    const form = await Form.findOne({
        name: req.name,
        project: req.name
    })

    const project = await Project.findOne({
        name: req.name
    })

    if (!project){
         res.status(400).send("Project not found in database")
         return
    }

    if (!form){
        res.status(400).send("Form not found in database")
    }

    try{

        if (req.body.updateType=="dataSet"){
            const updatedData = await data.updateOne(
                {},
                {}
            )
            const updatedProjectData = await projectData.updateOne(
                {},
                {}
            )
        }
        if (req.body.updateType=="units"){

            const updatedData = await data.updateOne(
                {},
                {}
            )
            const updatedProjectData = await projectData.updateOne(
                {},
                {}
            )

        }



    }catch(err){
        res.status(400).send(err)
        return
    }


    
})

module.exports = router;