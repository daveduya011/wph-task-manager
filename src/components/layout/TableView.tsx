import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Task, TaskStatus } from '@/types/task'
import { TASK_STATUSES } from '@/types/task'
import { Edit, Eye, Trash2 } from 'lucide-react'

interface TableViewProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: TaskStatus) => void
}

export default function TableView({
  tasks,
  onDelete,
  onUpdateStatus,
}: TableViewProps) {
  const router = useRouter()

  return (
    <>
      {TASK_STATUSES.map((status) => {
        const filteredTasks = tasks.filter((task) => task.status === status)
        return (
          <div key={status} className="mb-8">
            <h3 className="mb-4 text-xl font-bold">{status}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Priority
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Due Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-gray-500"
                    >
                      No tasks in {status.toLowerCase()}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {task.description}
                      </TableCell>
                      <TableCell
                        className={`hidden sm:table-cell ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}
                      >
                        {task.priority}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleString()
                          : 'None'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            onUpdateStatus(task.id, value as TaskStatus)
                          }
                        >
                          <SelectTrigger className="w-[100px] sm:w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/task/${task.id}`)}
                            title="View Task"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/task?edit=${task.id}`)}
                            title="Edit Task"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(task.id)}
                            title="Delete Task"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )
      })}
    </>
  )
}
