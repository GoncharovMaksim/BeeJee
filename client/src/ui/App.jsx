import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, logout } from "../store/slices/authSlice";
import TaskList from "./TaskList";
import NewTaskForm from "./NewTaskForm";
import Login from "./Login";

export default function App() {
  const dispatch = useDispatch();
  const authenticated = useSelector((s) => s.auth.authenticated);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <div className="container">
      <header className="header">
        <h1>ToDo BeeJee</h1>
        <div>
          {authenticated ? (
            <button onClick={() => dispatch(logout())}>Выйти (админ)</button>
          ) : (
            <Login />
          )}
        </div>
      </header>
      <NewTaskForm />
      <TaskList />
    </div>
  );
}
