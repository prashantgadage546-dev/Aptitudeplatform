const express = require("express");
const router = express.Router();
const db = require("../db");

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = results[0];

      if (password !== user.password)
        return res.status(401).json({ message: "Invalid credentials" });

      return res.json({
        message: "Login success",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
});

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length > 0)
        return res.status(409).json({ message: "User already exists" });

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, password, role || "student"],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Insert failed" });

          return res.json({
            message: "Register success",
            user: {
              id: result.insertId,
              name,
              email,
              role: role || "student",
            },
          });
        }
      );
    }
  );
});

module.exports = router;

