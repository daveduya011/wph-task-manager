'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Task, TaskStatus } from '@/types/task'
import {
  Columns,
  Table as TableIcon,
  Plus,
  Trash,
  Check,
  Loader,
  X,
} from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import KanbanView from '@/components/layout/KanbanView'
import TableView from '@/components/layout/TableView'
import { Button } from '@/components/ui/button'

import {
  getTasks,
  getLayoutPreference,
  setLayoutPreference,
  updateTask,
  deleteTask,
} from '@/lib/actions'
import { toast } from 'sonner'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [layout, setLayout] = useState('kanban')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const session = useSession()
  const [isPending, startTransition] = useTransition()

  // Load initial data
  useEffect(() => {
    if (!session?.data?.user) return

    const loadData = async () => {
      setIsLoading(true)
      try {
        const tasksResult = await getTasks()
        if (tasksResult.success) {
          setTasks(tasksResult.tasks)
        }

        // Fetch layout preference - 'table' or 'kanban'
        const layoutResult = await getLayoutPreference()
        if (layoutResult.success) {
          setLayout(layoutResult.layout)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [session])

  const onDelete = (id: string) => {
    toast('Deleting...', {
      icon: <Trash />,
    })
    startTransition(async () => {
      const deleteResult = await deleteTask(id)
      if (deleteResult.success) {
        setTasks(tasks.filter((t) => t.id !== id))
        toast.success('Task Deleted', {
          icon: <Check />,
        })
      } else {
        toast.error('Delete failed', {
          icon: <X />,
        })
      }
    })
  }

  const onUpdateStatus = (id: string, status: TaskStatus) => {
    toast('Updating...', {
      icon: <Loader />,
    })
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)))
    startTransition(async () => {
      const updateResult = await updateTask({ status }, id)
      if (updateResult.success) {
        toast.success('Task Updated', {
          icon: <Check />,
        })
      } else {
        toast.success('Update Failed', {
          icon: <X />,
        })
      }
    })
  }

  return (
    <main className="container mx-auto p-4">
      <Button
        onClick={() => router.push('/task')}
        className="fixed right-4 bottom-4 z-30 h-14 w-14 rounded-full shadow-lg md:hidden"
        size="lg"
        aria-label="Create new task"
      >
        <Plus className="h-6 w-6" />
      </Button>
      {tasks.length > 0 && (
        <div className="mb-4 flex justify-end gap-2">
          <Button
            variant={layout === 'kanban' ? 'default' : 'outline'}
            onClick={() => {
              setLayout('kanban')
              startTransition(async () => {
                await setLayoutPreference('kanban')
              })
            }}
            title="Kanban View"
            disabled={isPending}
          >
            <Columns className="h-4 w-4" />
            <span className="xs:inline hidden">Kanban</span>
          </Button>
          <Button
            variant={layout === 'table' ? 'default' : 'outline'}
            onClick={() => {
              setLayout('table')
              startTransition(async () => {
                await setLayoutPreference('table')
              })
            }}
            title="Table View"
            disabled={isPending}
          >
            <TableIcon className="h-4 w-4" />
            <span className="xs:inline hidden">Table</span>
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="px-4 py-8 text-center sm:py-12">
          <div className="text-gray-500">Loading tasks...</div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="px-4 py-8 text-center sm:py-12">
          <h2 className="mb-4 text-xl font-bold text-gray-700 sm:text-2xl">
            No tasks yet
          </h2>
          <p className="mb-6 text-sm text-gray-500 sm:text-base">
            Get started by creating your first task!
          </p>
          <Button size="lg" onClick={() => router.push('/task')}>
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      ) : layout === 'kanban' ? (
        <KanbanView
          tasks={tasks}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      ) : (
        <TableView
          tasks={tasks}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </main>
  )
}
