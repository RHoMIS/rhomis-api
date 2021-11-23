const express = require("express");
const router = express.Router();
const auth = require('../validation/checkAccess')


const cors = require("cors");
router.use(cors());
router.options("*", cors());

const data = require('../models/data')
const Project = require('../models/projects')
const Form = require('../models/forms')

router.delete("/", auth, async (req, res) => {
    try {
        console.log("Deleting project")
        console.log(req.body.projectName)




        if (!req.body.projectName) {
            res.send("Please send a project name for the data you would like to process")
            return
        }

        const projectManagerIDs = req.user.information.user.roles.projectManager
        const dataAnalystIDs = req.user.information.user.roles.analyst
        if (projectManagerIDs.includes(req.body.projectName)) {

            const deletedData = await data.deleteMany({ projectID: req.body.projectName })

            const deleteProject = await Project.deleteMany({ name: req.body.projectName })
            const deleteForm = await Form.deleteMany({ project: req.body.projectName })
            return res.send("Project Deleted")
        }
        throw "Unauthorized"
    } catch (err) {
        res.json({ message: err });
    }

})

module.exports = router;
