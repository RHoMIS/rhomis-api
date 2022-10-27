const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require("../validation/checkAccess");

const data = require("../models/data");
const projectData = require("../models/projectData")
const units_and_conversions = require("../models/unitsAndConversions");

const log = require('../validation/log');
const Log = require('../models/Log')

const os = require("os");


router.post("/", auth, async (req, res) => {
  try {
    if (
      (req.body.dataType !== undefined) &
      (req.body.projectID !== undefined) &
      (req.body.formID !== undefined)
    ) {
      // Check that the project ID and formID are accessible to this user
      // and check that this user has the correct permissions to access the data
      // i.e data collector or project manager
      // Project manager can access all forms
      // Data analyst can only access certain forms within a project
      const projectManagerIDs = req.user.information.user.roles.projectManager;
      const dataAnalystIDs = req.user.information.user.roles.analyst;


      if (
        projectManagerIDs.includes(req.body.projectID) ||
        dataAnalystIDs.includes(req.body.formID)
      ) {

        let result = [];

        if (req.body.unit === true) {
          result = await units_and_conversions.find({
            projectID: req.body.projectID,
            formID: req.body.formID,
            conversionType: req.body.dataType,
          });
          result = result[0].data;
        }

        if (req.body.data === true) {
          result = await data.find(
            {
              projectID: req.body.projectID,
              formID: req.body.formID,
              dataType: req.body.dataType,
            },
            {
              _id: 0,
              projectID: 0,
              formID: 0,
              dataType: 0,
            }
          );

          result = result.map((row) => {
            return row.data;
          });
        }

        return res.status(200).send(result);
      }
      log({
        file: './routes/data.js',
        line: '78',
        info: {
            message:'Unauthorized',
            data:{
                user_id: req.user._id
            }
        },
        type: 'message'
    }, Log)

      throw "Unauthorized";
    }
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/all-data", auth, async (req, res) => {
  log({
    file: './routes/data.js',
    line: '96',
    info: {
        message:'Fetching all data',
        data:{
            user_id: req.user._id
        }
    },
    type: 'message'
}, Log)
  if (req.body.projectID === undefined) {
    res.status(400).send("Need to include project ID in request");
    return;
  }

  if (req.body.formID === undefined) {
    res.status(400).send("Need to include project ID in request");
  }

  // Check that the project ID and formID are accessible to this user
  // and check that this user has the correct permissions to access the data
  // i.e data collector or project manager
  // Project manager can access all forms
  // Data analyst can only access certain forms within a project

  const projectManagerIDs = req.user.information.user.roles.projectManager;
  const dataAnalystIDs = req.user.information.user.roles.analyst;


  if (
    projectManagerIDs.includes(req.body.projectID) ||
    dataAnalystIDs.includes(req.body.formID)
  ) {
    const home_dir = os.homedir();

    const dataset = await projectData.findOne({
        projectID: req.body.projectID,
        formID: req.body.formID
    })

    if (!dataset){
      
        res.status(400).send("Unable to find data associated with project")
        return
    }

    if (!dataset.zip_file_path){
        res.status(400).send("Unable to find data associated with project")
        return
    }

    let absolute_path =
    dataset.zip_file_path.replace(
        "~",
        home_dir
      );
    const relative_path = path.resolve(__dirname, absolute_path);

    let readStream = fs.createReadStream(relative_path);
    readStream.on("close", () => res.end());
    readStream.pipe(res);

    return;
  }
  
  return res.status(400).send("Unauthorized");
});

module.exports = router;
