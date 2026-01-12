const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const examRoutes = require("./routes/exam");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", examRoutes);   // ✅ THIS WAS MISSING

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = 7001;
app.listen(PORT, () => {
  console.log("API running on port", PORT);
});

