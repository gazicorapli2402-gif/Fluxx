import React from "react";
import TodoItem from "./TodoItem";

const STATUSES = [
  { id: "todo", title: "Yapılacak", color: "#94a3b8" },
  { id: "doing", title: "Devam Eden", color: "#6366f1" },
  { id: "done", title: "Tamamlanan", color: "#10b981" }
];

export default function KanbanBoard({ todos, moveTask, deleteTodo, toggleTimer, activeTodoId, openModal }) {
  return (
    <div className="kanban-board">
      {STATUSES.map((status) => {
        const columnTasks = todos.filter((t) => t.status === status.id);
        return (
          <div key={status.id} className={`kanban-column column-${status.id}`}>
            <div className="column-header">
              <h3 style={{ color: status.color }}>{status.title}</h3>
              <span className="task-count">{columnTasks.length}</span>
            </div>
            <div className="todo-list">
              {columnTasks.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  deleteTodo={deleteTodo}
                  toggleTimer={toggleTimer}
                  isActive={activeTodoId === todo.id}
                  moveTask={moveTask}
                  openModal={openModal}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
