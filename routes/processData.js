const express = require("express");
const router = express.Router();
const auth = require('../validation/verifyToken')
const { exec } = require("child_process")


const cors = require("cors");
router.use(cors());
router.options("*", cors());

const Form = require('../models/forms')


let config = require('config'); //we load the db location from the JSON files
const dbName = config.get('dbConfig.name')
//const rscriptPath = config.get('rConfig.rscript_path')
const rscriptPath = process.env.RSCRIPTPROCESSDATA;

router.post("/", auth, async (req, res) => {
    try {
        console.log(rscriptPath)
        if (!req.body.projectName) {
            res.send("Please send a project name for the data you would like to process")
            return
        }

        if (!req.body.formName) {
            res.send("Please send a form name for the data you would like to process")
            return
        }


        // Check form exists

        const form = await Form.findOne({
            name: req.body.formName,
            project: req.body.projectName
        })

        if (!form) return res.status(400).send("Could not find the form you were looking for")

        const exec_string = 'Rscript ' + rscriptPath + ' --projectName "' + req.body.projectName + '" --formName "' + req.body.formName + '" --formVersion "' + form.formVersion + '"' + ' --dataBase "' + dbName + '"'
        console.log(exec_string)
        await exec(exec_string, (error, stdout, stderr) => {
            if (stderr) {
                res.send(`stderr: ${stderr}`)
                console.log(stderr)
                return
            }
            if (error) {
                res.send(`error: ${error.message}`)
                return
            }


            res.send(`stdout: ${stdout}`)

        })

        //res.send("Data processed")
    } catch (err) {
        res.json({ message: err });
    }

})

module.exports = router;
