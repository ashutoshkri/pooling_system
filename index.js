const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const questionRoutes = require("./routes/questions");
const optionRoutes = require("./routes/options");

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);

app.get("/", (req, res) => res.send("Polling API Running!"));

app.use("/questions", questionRoutes);
app.use("/options", optionRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
