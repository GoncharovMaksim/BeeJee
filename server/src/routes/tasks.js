const express = require("express");
const { Op } = require("sequelize");
const Task = require("../models/Task");
const { createTaskSchema, updateTaskSchema } = require("../utils/validation");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /tasks?sortBy=userName|userEmail|isCompleted&order=asc|desc&page=1&pageSize=3
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const pageSize = Math.min(
      Math.max(parseInt(req.query.pageSize || "3", 10), 1),
      50
    );
    const allowedSort = {
      userName: "userName",
      userEmail: "userEmail",
      isCompleted: "isCompleted",
    };
    const sortBy = allowedSort[req.query.sortBy] || "id";
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const { count, rows } = await Task.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[sortBy, order]],
      attributes: [
        "id",
        "userName",
        "userEmail",
        "text",
        "isCompleted",
        "isEditedByAdmin",
        "createdAt",
      ],
    });

    return res.json({
      items: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
      sort: { sortBy, order },
    });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка загрузки задач" });
  }
});

// POST /tasks
router.post("/", async (req, res) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Ошибка валидации", errors: parsed.error.flatten() });
    }
    const { userName, userEmail, text } = parsed.data;
    const created = await Task.create({ userName, userEmail, text });
    return res.status(201).json({ item: created, message: "Задача создана" });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка создания задачи" });
  }
});

// PATCH /tasks/:id (admin)
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id))
      return res.status(400).json({ message: "Некорректный id" });

    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ message: "Ошибка валидации", errors: parsed.error.flatten() });

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: "Задача не найдена" });

    const updates = {};
    if (typeof parsed.data.isCompleted === "boolean") {
      updates.isCompleted = parsed.data.isCompleted;
    }
    if (
      typeof parsed.data.text === "string" &&
      parsed.data.text !== task.text
    ) {
      updates.text = parsed.data.text;
      updates.isEditedByAdmin = true;
    }
    await task.update(updates);
    return res.json({ item: task, message: "Задача обновлена" });
  } catch (e) {
    return res.status(500).json({ message: "Ошибка обновления задачи" });
  }
});

module.exports = router;
