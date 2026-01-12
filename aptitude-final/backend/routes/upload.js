const express = require("express");
const router = express.Router();

const multer = require("multer");
const xlsx = require("xlsx");
const db = require("../db");

// multer config (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload/excel", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ message: "Empty Excel file" });
    }

    const values = data.map(q => [
      q.question,
      q.optionA,
      q.optionB,
      q.optionC,
      q.optionD,
      q.correctOption
    ]);

    const sql = `
      INSERT INTO questions
      (question, optionA, optionB, optionC, optionD, correctOption)
      VALUES ?
    `;

    db.query(sql, [values], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Questions uploaded successfully" });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "File processing error" });
  }
});

module.exports = router;
