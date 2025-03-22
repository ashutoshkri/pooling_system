const Question = require("../models/Question");
const Option = require("../models/Option");

exports.addVote = async (req, res) => {
  try {
    const option = await Option.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!option) return res.status(404).json({ error: "Option not found" });

    return res.status(200).json({
      message: "Vote added successfully",
      option,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteOption = async (req, res) => {
  try {
    const option = await Option.findById(req.params.id);
    if (!option) return res.status(404).json({ error: "Option not found" });

    if (option.votes > 0) {
      return res.status(400).json({ error: "Cannot delete option with votes" });
    }

    await Question.updateOne(
      { options: req.params.id },
      { $pull: { options: req.params.id } }
    );
    await Option.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Option deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
