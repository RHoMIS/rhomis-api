const express = require("express");
const router = express.Router();

const cors = require("cors");
router.use(cors());
router.options("*", cors());

const auth = require('../validation/checkAccess')

const data = require("../models/data");


router.post("/", auth, async (req, res) => {
    try {

    } catch (err) {

    }
})

module.exports = router;