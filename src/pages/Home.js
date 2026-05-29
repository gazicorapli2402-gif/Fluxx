import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm";
import KanbanBoard from "../components/KanbanBoard";
import TodoModal from "../components/TodoModal";
import { Todo, TaskStats, TimeAnalytics } from "../types/index";

export default function Home() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (activeTodoId && todos.find(t => t.id === activeTodoId)?.status !== "done") {
      interval = setInterval(() => {
        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === activeTodoId ? { ...t, totalTime: (t.totalTime || 0) + 1 } : t
          )
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTodoId, todos]);

  // Notification Permission Request
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Alarm Effect
  useEffect(() => {
    const alarmInterval = setInterval(() => {
      const now = new Date();
      todos.forEach((todo) => {
        if (todo.dueDate && todo.status !== "done") {
          const due = new Date(todo.dueDate);
          const diff = due.getTime() - now.getTime();
          if (diff > 0 && diff < 60000 && !todo.alarmNotified) {
             // Browser Notification
             if (Notification.permission === "granted") {
               new Notification("Flux Hatırlatıcı", {
                 body: `Görev Zamanı: ${todo.text}`,
                 icon: "/logo192.png" // Standard CRA icon path
               });
             } else {
               alert(`GÖREV ZAMANI: ${todo.text}`);
             }
             
             setTodos(prev => prev.map(t => t.id === todo.id ? {...t, alarmNotified: true} : t));
          }
        }
      });
    }, 30000);
    return () => clearInterval(alarmInterval);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, dueDate, category, startDate) => {
    if (!text.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        description: "",
        completed: false,
        status: "todo",
        category: category || "personal",
        startDate: startDate || new Date().toISOString(),
        dueDate,
        totalTime: 0,
        createdAt: new Date().toISOString(),
        subtasks: []
      },
    ]);
  };

  const deleteTodo = (id) => {
    if (activeTodoId === id) setActiveTodoId(null);
    setTodos(todos.filter((t) => t.id !== id));
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const moveTask = (id, newStatus) => {
    if (newStatus === "done" && activeTodoId === id) setActiveTodoId(null);
    setTodos(todos.map((t) => (t.id === id ? { ...t, status: newStatus, completed: newStatus === "done" } : t)));
  };

  const toggleTimer = (id) => {
    if (activeTodoId === id) {
      setActiveTodoId(null);
    } else {
      const task = todos.find(t => t.id === id);
      if (task.status !== "done") setActiveTodoId(id);
    }
  };

  // Analytics
  const mostTimeTask = [...todos].sort((a, b) => (b.totalTime || 0) - (a.totalTime || 0))[0];
  const totalSeconds = todos.reduce((acc, curr) => acc + (curr.totalTime || 0), 0);

  // Filtering
  const filteredTodos = todos.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      <h2>Flux Workspace</h2>
      
      <div className="app-controls">
        <input 
          className="search-input" 
          placeholder="Görev ara..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">Tüm Kategoriler</option>
          <option value="work">İş</option>
          <option value="personal">Kişisel</option>
          <option value="urgent">Acil</option>
          <option value="study">Ders</option>
        </select>
      </div>

      <TodoForm addTodo={addTodo} />
      
      <KanbanBoard 
        todos={filteredTodos}
        moveTask={moveTask}
        deleteTodo={deleteTodo}
        toggleTimer={toggleTimer}
        activeTodoId={activeTodoId}
        openModal={setSelectedTask}
      />
      
      {selectedTask && (
        <TodoModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updates) => updateTodo(selectedTask.id, updates)}
        />
      )}

      {todos.length > 0 && (
        <div className="analytics-section">
          <div className="analytics-card" style={{display: 'flex', justifyContent: 'center', gap: '30px', padding: '12px 30px'}}>
            <div className="stat-item">Toplam Görev: <strong>{todos.length}</strong></div>
            <div className="stat-item">Tamamlanan: <strong>{todos.filter(t => t.status === 'done').length}</strong></div>
            <div className="stat-item">Devam Eden: <strong>{todos.filter(t => t.status === 'doing').length}</strong></div>
            <div className="stat-item">Yapılacak: <strong>{todos.filter(t => t.status === 'todo').length}</strong></div>
          </div>
          
          <div className="analytics-card" style={{marginTop: '15px'}}>
            <div className="analytics-title">📊 Zaman Analizi</div>
            {mostTimeTask && mostTimeTask.totalTime > 0 ? (
              <div className="most-time-task">
                En çok vakit alan: {mostTimeTask.text} 
                <span style={{color: '#818cf8', marginLeft: '10px'}}>
                  ({Math.floor(mostTimeTask.totalTime / 60)} dk)
                </span>
              </div>
            ) : (
              <div className="most-time-task">Henüz vakit kaydı yok.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}