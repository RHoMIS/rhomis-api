const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/verifyToken')

const data = require("../models/data");


router.post("/", auth, async (req, res) => {
    try {
        console.log(req.body.dataType)
        if (req.body.dataType !== undefined &
            req.body.projectID !== undefined &
            req.body.formID !== undefined) {

            const result = await data.find({
                projectID: req.body.projectID,
                formID: req.body.formID,
                dataType: req.body.dataType
            })
            console.log(result)
            if (result.length > 1) {
                throw "More than one project with form and project ID. Duplicate projects in DB"
            }
            res.send(result[0].data)
        }


        //console.log(result)
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;