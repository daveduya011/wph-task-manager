import React from 'react'
import TaskCard from './TaskCard'
import { Task, TaskStatus } from '@/types/task'

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: TaskStatus) => void
  draggingTaskId: string | null
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onUpdateStatus,
  draggingTaskId,
}) => {
  const visibleTasks = tasks.filter((t) => t.id !== draggingTaskId)
  const items = []

  for (let i = 0; i <= visibleTasks.length; i++) {
    if (i < visibleTasks.length) {
      items.push(
        <TaskCard
          key={visibleTasks[i].id}
          task={visibleTasks[i]}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />,
      )
    }
  }

  return <div className="space-y-2">{items}</div>
}

export default TaskList
