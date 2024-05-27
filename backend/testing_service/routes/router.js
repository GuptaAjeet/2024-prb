const express = require("express");
const router = express.Router();
const { verifyToken } = require("../app/middlware");

router.use("/", require("./web"));
router.use("/web", verifyToken, require("./web"));
router.use("/admin", verifyToken, require("./admin"));
router.use("/auth", require("./auth"));
router.use("/migration", verifyToken, require("./migration"));
router.use("/api", verifyToken, require("./api"));
// router.use('/api',verifyToken,require('./api'));

module.exports = router;
