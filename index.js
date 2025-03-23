const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const questionRoutes = require("./routes/questions");
const optionRoutes = require("./routes/options");

const app = express();
const port = process.env.PORT || 8000;

// MONGO_URI ko pehle check karo taaki confirm ho ki value load hui hai
console.log("MONGO_URI:", process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection Fix (Removed deprecated options)
mongoose
  .connect(process.env.MONGO_URI) // Removed useNewUrlParser and useUnifiedTopology
  .then(() => console.log("🚀 MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ DB connection error:", err.message); // More specific error message
    process.exit(1); // Agar DB connect nahi hota, toh app stop kar do
  });

app.get("/", (req, res) => res.send("Polling API Running!"));

app.use("/questions", questionRoutes);
app.use("/options", optionRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () =>
  console.log(`✅ Server running on http://localhost:${port}`)
);
