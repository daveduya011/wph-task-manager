import { useEffect, useState, useRef } from 'react'
import TaskList from '@/components/tasks/TaskList'
import { Task, TASK_STATUSES, TaskStatus } from '@/types/task'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CircleCheckBig, ListTodo, Loader, LucideIcon } from 'lucide-react'

interface TaskHandlers {
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: TaskStatus) => void
}

interface KanbanViewProps extends TaskHandlers {
  tasks: Task[]
}

export default function KanbanView({
  tasks,
  onDelete,
  onUpdateStatus,
}: KanbanViewProps) {
  const handlers: TaskHandlers = { onDelete, onUpdateStatus }
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)

  useEffect(() => {
    return monitorForElements({
      onDragStart({ source }) {
        setDraggingTaskId(source.data.taskId as string)
      },
      onDrop({ source, location }) {
        setDraggingTaskId(null)
        const destination = location.current.dropTargets[0]
        if (!destination) return

        const taskId = source.data.taskId as string

        if (destination.data.status) {
          // Column drop
          const newStatus = destination.data.status as TaskStatus
          const task = tasks.find((t) => t.id === taskId)
          if (task && task.status !== newStatus) {
            onUpdateStatus(taskId, newStatus)
          }
        }
      },
    })
  }, [tasks, onUpdateStatus])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const filteredTasks = tasks.filter((task) => task.status === status)
        return (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks}
            handlers={handlers}
            draggingTaskId={draggingTaskId}
          />
        )
      })}
    </div>
  )
}

function KanbanColumn({
  status,
  tasks,
  handlers,
  draggingTaskId,
}: {
  status: TaskStatus
  tasks: Task[]
  handlers: TaskHandlers
  draggingTaskId: string | null
}) {
  const statusIconMap: Record<TaskStatus, LucideIcon> = {
    'To Do': ListTodo,
    'In Progress': Loader,
    Completed: CircleCheckBig,
  }
  const IconComponent = statusIconMap[status]
  const ref = useRef<HTMLDivElement>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      getData: () => ({ status }),
      canDrop: ({ source }) => {
        const taskId = source.data.taskId as string
        const task = tasks.find((t) => t.id === taskId)
        return task ? task.status !== status : true
      },
      onDragEnter: () => {
        setIsHighlighted(true)
      },
      onDragLeave: () => {
        setIsHighlighted(false)
      },
      onDrop: () => {
        setIsHighlighted(false)
      },
    })
  }, [status, tasks])

  return (
    <div
      ref={ref}
      className={`rounded p-2 ${isHighlighted ? 'bg-primary/30' : ''}`}
    >
      <h2 className="mb-4 flex items-center gap-4 text-xl font-bold">
        <IconComponent />
        {status}
      </h2>
      <div className="bg-secondary p-2">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No tasks in {status.toLowerCase()}</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            {...handlers}
            draggingTaskId={draggingTaskId}
          />
        )}
      </div>
    </div>
  )
}
