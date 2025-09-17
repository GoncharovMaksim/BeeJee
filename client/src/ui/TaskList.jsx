import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  fetchTasks,
  setPage,
  setSort,
  updateTask,
} from "../store/slices/tasksSlice";

function SortHeader({ label, field, current, onChange }) {
  const active = current.sortBy === field;
  const nextOrder = active && current.order === "ASC" ? "desc" : "asc";
  return (
    <button
      className={active ? "active" : ""}
      onClick={() => onChange(field, nextOrder)}
    >
      {label} {active ? (current.order === "ASC" ? "▲" : "▼") : ""}
    </button>
  );
}

export default function TaskList() {
  const dispatch = useDispatch();
  const { items, pagination, sort, loading } = useSelector((s) => s.tasks);
  const authenticated = useSelector((s) => s.auth.authenticated);

  useEffect(() => {
    dispatch(
      fetchTasks({
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy: sort.sortBy,
        order: sort.order,
      })
    );
  }, [dispatch, pagination.page, pagination.pageSize, sort.sortBy, sort.order]);

  const changeSort = (field, order) =>
    dispatch(setSort({ sortBy: field, order: order.toUpperCase() }));

  return (
    <div className="card">
      <h3>Список задач</h3>
      <div className="toolbar">
        <SortHeader
          label="Имя"
          field="userName"
          current={sort}
          onChange={changeSort}
        />
        <SortHeader
          label="Email"
          field="userEmail"
          current={sort}
          onChange={changeSort}
        />
        <SortHeader
          label="Статус"
          field="isCompleted"
          current={sort}
          onChange={changeSort}
        />
      </div>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <table className="tasks">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Текст</th>
              <th>Статус</th>
              {authenticated && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>{t.userName}</td>
                <td>{t.userEmail}</td>
                <td>{t.text}</td>
                <td>
                  {t.isCompleted ? "выполнено" : "новая"}
                  {t.isEditedByAdmin
                    ? " • отредактировано администратором"
                    : ""}
                </td>
                {authenticated && (
                  <td>
                    <div className="actions">
                      <button
                        onClick={() =>
                          dispatch(
                            updateTask({
                              id: t.id,
                              updates: { isCompleted: !t.isCompleted },
                            })
                          )
                        }
                      >
                        {t.isCompleted
                          ? "Снять отметку"
                          : "Отметить выполненной"}
                      </button>
                      <button
                        onClick={() => {
                          const newText = window.prompt(
                            "Новый текст задачи",
                            t.text
                          );
                          if (
                            newText != null &&
                            newText.trim() &&
                            newText.trim() !== t.text
                          ) {
                            dispatch(
                              updateTask({
                                id: t.id,
                                updates: { text: newText.trim() },
                              })
                            );
                          }
                        }}
                      >
                        Редактировать
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => dispatch(setPage(pagination.page - 1))}
        >
          Назад
        </button>
        <span>
          {pagination.page} / {pagination.totalPages || 1}
        </span>
        <button
          disabled={pagination.page >= (pagination.totalPages || 1)}
          onClick={() => dispatch(setPage(pagination.page + 1))}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
