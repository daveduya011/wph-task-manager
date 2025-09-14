import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - List all tasks
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const tasks = await prisma.task.findMany()
    // Map the enums back to the interface format
    const mappedTasks = tasks.map(task => ({
      ...task,
      status: task.status.replace('_', ' '),
    }))
    return NextResponse.json(mappedTasks)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST - Create task
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, dueDate, priority, status } = body
    // Map status to enum
    const statusEnum = status.replace(' ', '_')
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        status: statusEnum
      }
    })
    // Map back
    const mappedTask = {
      ...task,
      status: task.status.replace('_', ' ')
    }
    return NextResponse.json(mappedTask, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
