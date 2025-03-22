const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");

router.post("/create", questionsController.createQuestion);
router.post("/:id/options/create", questionsController.addOption);
router.delete("/:id", questionsController.deleteQuestion);
router.get("/:id", questionsController.viewQuestion);

module.exports = router;
