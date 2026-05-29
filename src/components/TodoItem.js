import { TodoItemProps } from "../types/index";

export default function TodoItem({ todo, deleteTodo, toggleTimer, isActive, moveTask, openModal }) {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isDueSoon = () => {
    if (!todo.dueDate) return false;
    const diff = new Date(todo.dueDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 3600000;
  };

  return (
    <div className={`todo-item ${isDueSoon() ? 'due-soon-border' : ''}`} onClick={() => openModal(todo)}>
      <div className="todo-header">
        <span className={`tag tag-${todo.category}`}>{todo.category}</span>
        <div className="todo-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn-icon btn-delete" onClick={() => deleteTodo(todo.id)}>🗑️</button>
        </div>
      </div>

      <div className="todo-main">
        <span className={`todo-text ${todo.status === "done" ? "completed" : ""}`}>
          {todo.text}
        </span>
        <div style={{marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
          {todo.startDate && (
            <div className="due-date" style={{color: '#94a3b8'}}>
              🚀 {new Date(todo.startDate).toLocaleString('tr-TR', {hour: '2-digit', minute: '2-digit'})}
            </div>
          )}
          {todo.dueDate && (
            <div className={`due-date ${isDueSoon() ? 'due-soon' : ''}`}>
              🏁 {new Date(todo.dueDate).toLocaleString('tr-TR', {hour: '2-digit', minute: '2-digit'})}
            </div>
          )}
        </div>
      </div>

      <div className="todo-footer" onClick={(e) => e.stopPropagation()}>
        <div className="timer-container">
          <span>{formatTime(todo.totalTime || 0)}</span>
          {todo.status !== "done" && (
            <button 
              className={`btn-timer ${isActive ? 'active' : ''}`}
              onClick={() => toggleTimer(todo.id)}
            >
              {isActive ? "⏸️" : "▶️"}
            </button>
          )}
        </div>
        
        <div className="status-actions">
          {todo.status !== "todo" && (
            <button className="btn-icon" onClick={() => moveTask(todo.id, "todo")} title="Yapılacak'a taşı">↩️</button>
          )}
          {todo.status !== "doing" && todo.status !== "done" && (
            <button className="btn-icon" onClick={() => moveTask(todo.id, "doing")} title="Devam Eden'e taşı">🔄</button>
          )}
          {todo.status !== "done" && (
            <button className="btn-icon" onClick={() => moveTask(todo.id, "done")} title="Tamamla">✅</button>
          )}
        </div>
      </div>
    </div>
  );
}