'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTask, updateTask, getTaskById } from '@/lib/actions'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Task } from '@/types/task'
import { Check, Loader, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['To Do', 'In Progress', 'Completed']),
})

const TaskForm = ({ editId }: { editId?: string }) => {
  const [task, setTask] = useState<Task | null>(null)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'To Do',
    },
  })

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (editId) {
      const loadTask = async () => {
        try {
          const result = await getTaskById(editId)
          if (result.success && result.task) {
            setTask(result.task)
            form.reset({
              title: result.task.title,
              description: result.task.description || '',
              dueDate: result.task.dueDate || '',
              priority: result.task.priority,
              status: result.task.status,
            })
          }
        } catch (error) {
          console.error('Error loading task:', error)
        }
      }
      loadTask()
    }
  }, [editId, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast(editId ? 'Updating...' : 'Creating...', {
      icon: <Loader />,
    })

    startTransition(async () => {
      const result = await (editId
        ? updateTask(values, editId)
        : createTask(values))
      if (result.success) {
        router.push('/')
        toast.success(`Task ${editId ? 'Updated' : 'Created'}`, {
          icon: editId ? <Check /> : <Plus />,
        })
      } else {
        toast.error('Update failed', {
          description: result.error,
          icon: <X />,
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </Form>
  )
}

export default TaskForm
