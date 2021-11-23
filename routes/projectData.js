const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/checkAccess')

const projectData = require('../models/projectData')

const data = require("../models/data");


router.post("/", auth, async (req, res) => {

    console.log("Reached project Data endpoint")
    // res.send(req.user.information)

    if (req.user.information.user.roles.projectManager.includes(req.body.projectName) === false &
        req.user.information.user.roles.analyst.includes(req.body.formName) === false
    ) {
        return res.status(400).send("Unauthorized")
    }

    try {

        const projectInfo = await projectData.findOne({ "formID": req.body.formName, "projectID": req.body.projectName })

        if (!projectInfo) return res.status(400).send("No project with those details found")

        return res.status(200).send(projectInfo)

    } catch (err) {
        return res.status(400).send(err)


    }
})

module.exports = router;