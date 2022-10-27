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


        if (!req.body.projectName) {
            res.send("No project name provided")
            return
        }

        if (!req.body.formName) {
            res.send("No form name provided")
            return
        }


        // Check User has access
        const projectManagerIDs = req.user.information.user.roles.projectManager
        if (projectManagerIDs.includes(req.body.projectName) === false) {
            return res.status(400).send("Unauthorized")
        }

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
            console.log("stderr")
            console.log(stderr)
            
            console.log("stdout")
            console.log(stdout)

            console.log("error")
            console.log(error)
        
            if (error) {
                res.status(400).send(`Failed to process data: ${stdout}`)
                return
            }

            res.status(200).send(`Successfully Processed data: ${stdout}`)

        })

        //res.send("Data processed")
    } catch (err) {
        log({
            file: './routes/processData.js',
            line: '50',
            info: {
                message:'Could not process dataset',
                data:{
                    user_id: req.user._id,
                    error: err
                }
            },
            type: 'message'
        }, Log)
        res.status(400).send(error);
    }

})

module.exports = router;
