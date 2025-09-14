export type TaskStatus = 'To Do' | 'In Progress' | 'Completed'

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  status: TaskStatus
}

export const TASK_STATUSES: readonly TaskStatus[] = [
  'To Do',
  'In Progress',
  'Completed',
] as const
