// Task Types
export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskCategory = 'work' | 'personal' | 'urgent' | 'study';

export interface Todo {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  status: TaskStatus;
  category: TaskCategory;
  startDate: string;
  dueDate: string;
  totalTime: number;
  createdAt: string;
  subtasks: Subtask[];
  alarmNotified?: boolean;
}

export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  color: string;
}

// Form Types
export interface TodoFormState {
  text: string;
  category: TaskCategory;
  date: string;
  startHours: number;
  startMinutes: number;
  endHours: number;
  endMinutes: number;
  isListening: boolean;
}

// Modal Types
export interface TodoModalProps {
  task: Todo;
  onClose: () => void;
  onUpdate: (updates: Partial<Todo>) => void;
}

// Component Props
export interface KanbanBoardProps {
  todos: Todo[];
  moveTask: (id: number, newStatus: TaskStatus) => void;
  deleteTodo: (id: number) => void;
  toggleTimer: (id: number) => void;
  activeTodoId: number | null;
  openModal: (todo: Todo) => void;
}

export interface TodoItemProps {
  todo: Todo;
  deleteTodo: (id: number) => void;
  toggleTimer: (id: number) => void;
  isActive: boolean;
  moveTask: (id: number, newStatus: TaskStatus) => void;
  openModal: (todo: Todo) => void;
}

export interface TodoFormProps {
  addTodo: (text: string, dueDate: string, category: TaskCategory, startDate: string) => void;
}

// Analytics Types
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export interface TimeAnalytics {
  mostTimeTask: Todo | null;
  totalSeconds: number;
}
