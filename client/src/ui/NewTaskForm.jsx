import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../store/slices/tasksSlice";

export default function NewTaskForm() {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccess("");
    try {
      const res = await dispatch(createTask({ userName, userEmail, text }));
      if (res.error) {
        setErrors(res.payload?.errors || { formErrors: ["Ошибка"] });
        return;
      }
      setUserName("");
      setUserEmail("");
      setText("");
      setSuccess("Задача успешно добавлена");
    } catch {}
  };

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <h3>Новая задача</h3>
      <div className="field">
        <label>Имя</label>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        {errors?.fieldErrors?.userName && (
          <div className="error">{errors.fieldErrors.userName.join(", ")}</div>
        )}
      </div>
      <div className="field">
        <label>Email</label>
        <input
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        {errors?.fieldErrors?.userEmail && (
          <div className="error">{errors.fieldErrors.userEmail.join(", ")}</div>
        )}
      </div>
      <div className="field">
        <label>Текст</label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {errors?.fieldErrors?.text && (
          <div className="error">{errors.fieldErrors.text.join(", ")}</div>
        )}
      </div>
      {errors?.formErrors && (
        <div className="error">
          {errors.formErrors?.join(", ") || "Проверьте поля"}
        </div>
      )}
      {success && <div className="success">{success}</div>}
      <button type="submit">Сохранить</button>
    </form>
  );
}
