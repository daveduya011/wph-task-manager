'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Task } from '@/types/task'
import { getTaskById, deleteTask } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  X,
  Edit,
  Trash2,
  Flag,
  Calendar,
  CheckCircle,
  Circle,
  XCircle,
  Trash,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

const TaskDetailsPage = () => {
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const { id } = params
  const router = useRouter()

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true)
      try {
        const result = await getTaskById(id as string)
        if (result.success) {
          setTask(result.task)
        } else {
          setTask(null)
        }
      } catch (error) {
        console.error('Error loading task:', error)
        setTask(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadTask()
    }
  }, [id])

  const handleDelete = async () => {
    toast('Deleting...', {
      icon: <Trash />,
    })
    try {
      await deleteTask(id as string)
      toast.success('Task Deleted', {
        icon: <Check />,
      })
      router.push('/')
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.push('/')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  if (isLoading) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-center">Loading task...</div>
      </main>
    )
  }

  if (!task) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-center text-red-600">Task not found</div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto flex max-w-2xl justify-center p-4">
      <Card className="w-full shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <div className="bg-secondary p-4">
            {task.description && (
              <div>
                <p className="text-gray-700">{task.description}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Flag
                  className={`h-4 w-4 ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}
                />
                <span className="text-sm">Priority: {task.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Due Date:{' '}
                  {task.dueDate
                    ? new Date(task.dueDate).toDateString()
                    : 'None'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {task.status === 'Completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : task.status === 'In Progress' ? (
                  <Circle className="h-4 w-4 text-yellow-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`rounded-full px-2 py-1 text-sm font-semibold ${
                    task.status === 'To Do'
                      ? 'bg-red-200 text-red-800'
                      : task.status === 'In Progress'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-green-200 text-green-800'
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/task?edit=${id}`)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default TaskDetailsPage
