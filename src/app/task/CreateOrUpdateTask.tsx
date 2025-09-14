'use client'

import { useRouter } from 'next/navigation'
import { use } from 'react'
import { useEffect } from 'react'
import TaskForm from '@/components/tasks/TaskForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Plus, Edit3 } from 'lucide-react'

export default function CreateOrUpdateTask({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const params = use(searchParams)
  const editId = params.edit ?? undefined
  const router = useRouter()

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

  const isEditing = !!editId
  const Icon = isEditing ? Edit3 : Plus

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Icon className="h-6 w-6" />
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <TaskForm editId={editId} />
      </CardContent>
    </Card>
  )
}
