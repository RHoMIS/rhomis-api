const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const metaData = require("../models/metaData")


router.get("/", async (req, res) => {
    try {

        const result = await metaData.find({})
        res.send(result)



    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;