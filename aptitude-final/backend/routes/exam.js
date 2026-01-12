const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * SET TIMER
 * expects: { duration: number }
 */
router.post("/exam/set-timer", (req, res) => {
  const { duration } = req.body;

  if (!duration || isNaN(duration)) {
    return res.status(400).json({ message: "Invalid duration" });
  }

  // ensure single row exists
  db.query(
    "INSERT INTO settings (id, exam_timer) VALUES (1, ?) ON DUPLICATE KEY UPDATE exam_timer = ?",
    [duration, duration],
    (err) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "DB error" });
      }

      res.json({ message: "Timer updated successfully" });
    }
  );
});

/**
 * RESET TIMER
 */
router.post("/exam/reset-timer", (req, res) => {
  db.query(
    "UPDATE settings SET exam_timer = 30 WHERE id = 1",
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Timer reset to 30" });
    }
  );
});

module.exports = router;

