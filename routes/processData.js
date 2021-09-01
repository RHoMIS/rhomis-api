const express = require("express");
const router = express.Router();
const auth = require('./verifyToken')
const { exec } = require("child_process")


const cors = require("cors");
router.use(cors());
router.options("*", cors());


let config = require('config'); //we load the db location from the JSON files
const rscriptPath = config.get('rConfig.rscript_path')


router.post("/", auth, async (req, res) => {
    try {
        console.log(rscriptPath)

        const exec_string = 'Rscript ' + rscriptPath + ' --arg1 test_node_arg_1 --arg2 test_node_arg_2 --dir "~/"'
        await exec(exec_string, (error, stdout, stderr) => {
            if (error) {
                res.send(`error: ${error.message}`)
                return
            }

            if (stderr) {
                res.send(`stderr: ${stderr}`)
                console.log(stderr)
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