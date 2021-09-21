const express = require("express");
const router = express.Router();
const auth = require('./verifyToken')


const cors = require("cors");
router.use(cors());
router.options("*", cors());

const cropData = require('../models/cropData')
const indicatorData = require('../models/indicatorData')
const livestockData = require('../models/livestockData')
const metaData = require('../models/metaData')
const processedData = require('../models/processedData')


router.delete("/", auth, async (req, res) => {
    try {
        console.log("Deleting project")
        console.log(req.body.projectName)
        if (!req.body.projectName) {
            res.send("Please send a project name for the data you would like to process")
            return
        }

        const deletedCropData = await cropData.deleteMany({ projectID: req.body.projectName })
        const deletedIndicatorData = await indicatorData.deleteMany({ projectID: req.body.projectName })
        const deletedLivestockData = await livestockData.deleteMany({ projectID: req.body.projectName })
        const deletedMetaData = await metaData.deleteMany({ projectID: req.body.projectName })
        const deletedProcessedData = await processedData.deleteMany({ projectID: req.body.projectName })
        const deletedProjectInformation = await projectInformation.deleteMany({ projectID: req.body.projectName })

        console.log(deletedCropData)

        res.send("Project Deleted")
        return
    } catch (err) {
        res.json({ message: err });
    }

})

module.exports = router;
