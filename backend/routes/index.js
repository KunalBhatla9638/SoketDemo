const express = require("express")
const {welcome, testingSocketIO} = require('../controllers/UserControllers')

const router = express();

router.get("/", welcome)
router.get("/test", testingSocketIO)

module.exports = router;