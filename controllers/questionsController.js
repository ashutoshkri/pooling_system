const Question = require("../models/Question");
const Option = require("../models/Option");

exports.createQuestion = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const question = await Question.create({ title });
    return res.status(201).json({ question });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.addOption = async (req, res) => {
  try {
    const { text } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ error: "Question not found" });
    if (!text)
      return res.status(400).json({ error: "Option text is required" });

    // Create the new option with the question field
    let newOption = await Option.create({
      text,
      votes: 0,
      question: req.params.id, // Set the question field to the question ID
      link_to_vote: "", // Temporarily set to empty; we'll update it after creation
    });

    // Update the link_to_vote with the correct option ID
    newOption.link_to_vote = `http://localhost:8000/options/${newOption._id}/add_vote`;
    await newOption.save();

    // Add the new option to the question's options array
    question.options.push(newOption._id);
    await question.save();

    return res.status(201).json({ message: "Option added", option: newOption });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("options");
    if (!question) return res.status(404).json({ error: "Question not found" });

    const hasVotes = question.options.some((option) => option.votes > 0);
    if (hasVotes) {
      return res
        .status(400)
        .json({ error: "Cannot delete question with votes" });
    }

    await Option.deleteMany({ _id: { $in: question.options } });
    await question.deleteOne();

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.viewQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("options")
      .lean();

    if (!question) return res.status(404).json({ error: "Question not found" });

    return res.status(200).json(question);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
