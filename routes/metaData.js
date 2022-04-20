const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/checkAccess')

const metaData = require("../models/metaData")
const Form = require("../models/forms")
const Project = require("../models/projects")

router.get("/", auth, async (req, res) => {
    try {

        const result = await metaData.find({ projectID: req.body.projectID, formID: req.body.formID })

        res.send(result)

    } catch (err) {
        res.json({ message: err });
    }
});

router.get("/form-data", auth, async (req, res) => {
    try {
        console.log(req.user._id)
        const result = await Project.find({ users: { $in: [req.user._id] } })
        console.log(result)
        res.send(result)

    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;
