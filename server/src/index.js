const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

async function start() {
  await sequelize.sync();
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API listening on ${port}`));
}

start();
