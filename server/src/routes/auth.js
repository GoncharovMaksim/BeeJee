const express = require("express");
const jwt = require("jsonwebtoken");
const { COOKIE_NAME, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ message: "Имя и пароль обязательны" });

  if (username !== "admin" || password !== "123")
    return res.status(401).json({ message: "Неверные реквизиты доступа" });

  const token = jwt.sign({ role: "admin", name: "admin" }, JWT_SECRET, {
    expiresIn: "2h",
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 2 * 60 * 60 * 1000,
  });
  return res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ ok: true });
});

router.get("/me", (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.json({ authenticated: false });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true, user: { role: payload.role } });
  } catch (e) {
    return res.json({ authenticated: false });
  }
});

module.exports = router;
