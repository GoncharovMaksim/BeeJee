const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const COOKIE_NAME = "token";

function requireAdmin(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "Требуется авторизация" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") throw new Error("not admin");
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Сессия истекла, войдите снова" });
  }
}

module.exports = { requireAdmin, JWT_SECRET, COOKIE_NAME };
