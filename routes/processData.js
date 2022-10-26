const express = require("express");
const router = express.Router();
const auth = require('../validation/checkAccess')
const { exec } = require("child_process")


const log = require('../validation/log');
const Log = require('../models/Log')

const cors = require("cors");
router.use(cors());
router.options("*", cors());


const Form = require('../models/forms')


let config = require('config'); //we load the db location from the JSON files
const dbName = config.get('dbConfig.name')
//const rscriptPath = config.get('rConfig.rscript_path')
const rscriptPath = process.env.RSCRIPTPROCESSDATA;
const central_url = process.env.CENTRALURL;
const central_email = process.env.CENTRALEMAIL;
const central_password = process.env.CENTRALPASSWORD;

router.post("/", auth, async (req, res) => {
    try {

        console.log("Reached the processing endpoint")

        if (!req.body.projectName) {
            res.send("Please send a project name for the data you would like to process")
            return
        }

        if (!req.body.formName) {
            res.send("Please send a form name for the data you would like to process")
            return
        }


        // Check User has access

        const projectManagerIDs = req.user.information.user.roles.projectManager
        if (projectManagerIDs.includes(req.body.projectName) === false) {
            return res.status(400).send("Unauthorized")
        }


        console.log("Checking form exists")

        console.log(req.body)
        // const form = await Form.findOne({
        //     name: req.body.formName,
        //     project: req.body.projectName
        // })

        // if (!form) return res.status(400).send("Could not find the form you were looking for")
        // 
        console.log(" Checking whether it is a draft")
        let status = "finalized"
    


        let exec_string = 'Rscript ' +
            rscriptPath +
            ' --commandType "' +
            req.body.commandType +
            '" --projectName "' +
            req.body.projectName +
            '" --formName "' +
            req.body.formName +
            '" --formVersion "' +
            req.body.formVersion +
            '"' +
            ' --dataBase "' +
            dbName +
            '" --status "' +
            status +
            '" ' +
            '--centralURL "' +
            central_url +
            '" ' +
            '--centralEmail "' +
            central_email +
            '" ' +
            '--centralPassword "' +
            central_password +
            '" '

        if (req.body.commandType === "generate") {
            exec_string = exec_string + '--numberOfResponses "' + 5 + '"'
        }

        console.log(exec_string)
        await exec(exec_string, (error, stdout, stderr) => {
            if (stderr) {
                res.status(400).send(`stderr: ${stderr}`)
                console.log(stderr)
                return
            }
            if (error) {
                res.status(400).send(`error: ${error.message}`)
                return
            }

            console.log("finished")
            console.log(stdout)

            res.status(200).send(`stdout: ${stdout}`)

        })

        //res.send("Data processed")
    } catch (err) {
        res.json({ message: err });
    }

})

module.exports = router;
