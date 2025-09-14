import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Task, TaskStatus } from '@/types/task'
import { Edit, Trash2 } from 'lucide-react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: TaskStatus) => void
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onUpdateStatus,
}) => {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({ taskId: task.id }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [task.id])

  return (
    <div ref={ref} className="cursor-pointer">
      <Card
        className={`${dragging ? 'opacity-50' : 'hover:bg-background'}`}
        onClick={() => router.push(`/task/${task.id}`)}
      >
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 line-clamp-3 text-gray-700">{task.description}</p>
          <p
            className={`mb-1 text-sm ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}
          >
            Priority: {task.priority}
          </p>
          <p className="mb-2 text-sm text-gray-600">
            Due Date:{' '}
            {task.dueDate ? new Date(task.dueDate).toDateString() : 'None'}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Select
            value={task.status}
            onValueChange={(value) =>
              onUpdateStatus(task.id, value as TaskStatus)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                router.push(`/task?edit=${task.id}`)
                e.stopPropagation()
              }}
              title="Edit Task"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                onDelete(task.id)
                e.stopPropagation()
              }}
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TaskCard
