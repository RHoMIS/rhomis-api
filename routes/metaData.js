const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('./verifyToken')

const metaData = require("../models/metaData")


router.get("/", auth, async (req, res) => {
    try {

        const result = await metaData.find({})

        res.send(result)

    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;