'use server'

import { Task } from '@/types/task'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { fetchApi } from './fetch-api';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
// Server actions
export async function createTask(data: Omit<Task, 'id'>) {
  try {
    const response = await fetchApi(`${baseUrl}/api/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error)
    }

    const result = await response.json()

    revalidatePath('/tasks') // Assuming there's a tasks page

    return { success: true, task: result }
  } catch (error: unknown) {
    console.error('Error creating task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

export async function updateTask(data: Partial<Task>, id: string) {
  try {
    const response = await fetchApi(`${baseUrl}/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error)
    }

    const result = await response.json()

    revalidatePath('/tasks')

    return { success: true, task: result }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Server functions for data fetching and user preferences
export async function getTasks() {
  try {
    const response = await fetchApi(`${baseUrl}/api/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error)
    }

    const tasks = await response.json()
    return { success: true, tasks }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred', tasks: [] }
  }
}

export async function getTaskById(id: string) {
  try {
    const response = await fetchApi(`${baseUrl}/api/tasks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Task not found', task: null }
      }
      const result = await response.json()
      throw new Error(result.error)
    }

    const task = await response.json()
    return { success: true, task }
  } catch (error) {
    console.error('Error fetching task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred', task: null }
  }
}

export async function getLayoutPreference() {
  try {
    const cookieStore = await cookies()
    const layout = cookieStore.get('layout')?.value || 'kanban'
    return { success: true, layout }
  } catch (error) {
    console.error('Error getting layout preference:', error)
    return { success: false, error: 'Failed to get layout preference', layout: 'kanban' }
  }
}

export async function setLayoutPreference(layout: string) {
  try {
    const cookieStore = await cookies()
    cookieStore.set('layout', layout, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return { success: true }
  } catch (error) {
    console.error('Error setting layout preference:', error)
    return { success: false, error: 'Failed to set layout preference' }
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await fetchApi(`${baseUrl}/api/tasks/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error)
    }

    revalidatePath('/tasks')

    return { success: true }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}
