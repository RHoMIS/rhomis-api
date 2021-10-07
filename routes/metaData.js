const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/verifyToken')

const projectData = require("../models/projectData")


router.get("/", auth, async (req, res) => {
    try {

        const result = await projectData.find({ projectID: req.body.projectID, formID: req.body.formID })

        res.send(result)

    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
