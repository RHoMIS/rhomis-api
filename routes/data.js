const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/checkAccess')

const data = require("../models/data");


router.post("/", auth, async (req, res) => {
    try {




        console.log(req.body.dataType)
        if (req.body.dataType !== undefined &
            req.body.projectID !== undefined &
            req.body.formID !== undefined) {



            // Check that the project ID and formID are accessible to this user
            // and check that this user has the correct permissions to access the data
            // i.e data collector or project manager
            // Project manager can access all forms
            // Data analyst can only access certain forms within a project
            const projectManagerIDs = req.user.information.user.roles.projectManager
            const dataAnalystIDs = req.user.information.user.roles.analyst
            console.log(projectManagerIDs)
            if (projectManagerIDs.includes(req.body.projectID) ||
                dataAnalystIDs.includes(req.body.formID)) {
                const result = await data.find({
                    projectID: req.body.projectID,
                    formID: req.body.formID,
                    dataType: req.body.dataType
                })
                console.log(result)
                return res.send(result[0].data)
                if (result.length > 1) {
                    throw "More than one project with form and project ID. Duplicate projects in DB"
                }
            }

            throw "Unauthorized";
        }


        //console.log(result)
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;