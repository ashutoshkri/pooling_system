const express = require("express");
const router = express.Router();
const optionsController = require("../controllers/optionsController");

router.post("/:id/add_vote", optionsController.addVote);
router.delete("/:id", optionsController.deleteOption);

module.exports = router;
