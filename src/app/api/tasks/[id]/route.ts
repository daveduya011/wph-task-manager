import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/tasks/[id] - get task by id
export async function GET(req: NextRequest, ctx: RouteContext<'/api/tasks/[id]'>) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await ctx.params
    const task = await prisma.task.findUnique({
      where: { id: id }
    })
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    // Map status back
    const mappedTask = {
      ...task,
      status: task.status.replace('_', ' ')
    }
    return NextResponse.json(mappedTask)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - update task
export async function PUT(req: NextRequest, ctx: RouteContext<'/api/tasks/[id]'>) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { title, description, dueDate, priority, status } = body
    const { id } = await ctx.params
    // Map status to enum
    const statusEnum = status ? status.replace(' ', '_') : undefined
    const task = await prisma.task.update({
      where: { id: id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate }),
        ...(priority !== undefined && { priority }),
        ...(statusEnum && { status: statusEnum })
      }
    })
    // Map back
    const mappedTask = {
      ...task,
      status: task.status.replace('_', ' ')
    }
    return NextResponse.json(mappedTask)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - delete task
export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/tasks/[id]'>) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await ctx.params
    await prisma.task.delete({
      where: { id: id }
    })
    return NextResponse.json({ message: 'Task deleted' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
