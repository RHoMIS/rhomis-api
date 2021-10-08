const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/verifyToken')

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

router.post("/project", auth, async (req, res) => {
    try {
        const savedProject = await new Project(req.body).save()

        return res.status(200).send(savedProject)
    } catch (err) {
        return res.status(400).send(err)
    }
}

)

router.post("/form", auth, async (req, res) => {
    try {
        const savedForm = await new Form(req.body).save()

        const updated_project = await Project.updateOne(
            { name: req.body.project },
            { $push: { forms: req.body.name } });

        return res.status(200).send(savedForm)
    } catch (err) {
        return res.status(400).send(err)
    }
}

)


module.exports = router;
