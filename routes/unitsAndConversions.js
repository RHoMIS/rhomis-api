const express = require("express");
const router = express.Router();
const auth = require('../validation/checkAccess')
const { exec } = require("child_process")


const cors = require("cors");
router.use(cors());
router.options("*", cors());

const log = require('../validation/log');
const Log = require('../models/Log')


const Form = require('../models/forms')
const UnitsAndConversions = require("../models/unitsAndConversions")
const UnitsAndConversionsLog = require("../models/unitsAndConversionsLog")



let config = require('config'); //we load the db location from the JSON files
const dbName = config.get('dbConfig.name')

router.post('/',auth,async (req,res)=>{
    console.log(req.body)

    const date = new Date()

    try{
        let oldUnits = await UnitsAndConversions.findOne({
            conversionType: req.body.unitType,
            projectID: req.body.projectSelected,
            formID: req.body.formSelected
        }, {
            _id:0
        })
        
        oldUnits = JSON.parse(JSON.stringify(oldUnits))
        await new UnitsAndConversionsLog(oldUnits).save()
        
        console.log("oldUnits")


        let updatedUnits = await UnitsAndConversions.updateOne({
            conversionType: req.body.unitType,
            projectID: req.body.projectSelected,
            formID: req.body.formSelected
        }, {
            "$set":{
                data:req.body.unitsData
            }
        })

         console.log(req.body)
        // console.log(updatedUnits)

        return res.status(200).send("Units updated")

    }catch(err){
        console.log(err)
        return res.status(400).send(err)
    }

})

module.exports = router