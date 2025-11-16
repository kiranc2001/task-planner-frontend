export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string; // ISO string
  createdAt?: string;
}

export interface AiSuggestion {
  recommendations: string;
}

export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
}

export interface AuthForm {
  name?: string;
  email: string;
  password: string;
}
