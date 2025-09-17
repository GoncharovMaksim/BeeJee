const { z } = require("zod");

const createTaskSchema = z.object({
  userName: z.string().trim().min(1, "Имя обязательно").max(100),
  userEmail: z.string().trim().email("Некорректный email").max(150),
  text: z.string().trim().min(1, "Текст обязателен").max(5000),
});

const updateTaskSchema = z.object({
  text: z.string().trim().min(1, "Текст обязателен").max(5000).optional(),
  isCompleted: z.boolean().optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
