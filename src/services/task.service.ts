import {Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority} from '../types/task.types.js'
import crypto from 'crypto'

const tasks: Task[] = [
    {
        id: '1',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the API',
        status: 'in-progress',
        priority: 'high',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        title: 'Review code changes',
        description: 'Review pull requests from team members',
        status: 'pending',
        priority: 'medium',
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z'
    },
    {
        id: '3',
        title: 'Fix bug in authentication',
        description: 'Resolve issue with JWT token expiration',
        status: 'completed',
        priority: 'high',
        createdAt: '2024-01-14T14:00:00Z',
        updatedAt: '2024-01-15T16:00:00Z'
    }
]

export const getTasks = (filters?: {
    createdAt?: string
    status?: TaskStatus
    priority?: TaskPriority
}): Task[] => {
    if (!filters || Object.keys(filters).length === 0) {
        return tasks
    }

    return tasks.filter(task => {
        if (filters.createdAt && task.createdAt !== filters.createdAt) {
            return false
        }
        if (filters.status && task.status !== filters.status) {
            return false
        }
        if (filters.priority && task.priority !== filters.priority) {
            return false
        }
        return true
    })
}

const findTaskIndex = (id: string): number => {
    return tasks.findIndex(task => task.id === id)
}

export const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id)
}

const buildTaskDescription = (description: string | undefined, existingDescription?: string): {
    description?: string
} => {
    if (description !== undefined) {
        return {description}
    }
    if (existingDescription !== undefined) {
        return {description: existingDescription}
    }
    return {}
}

export const createTask = (input: CreateTaskInput): Task => {
    const now = new Date().toISOString()
    const newTask: Task = {
        id: crypto.randomUUID(),
        title: input.title,
        ...buildTaskDescription(input.description),
        status: input.status || 'pending',
        priority: input.priority || 'medium',
        createdAt: now,
        updatedAt: now
    }
    tasks.push(newTask)
    return newTask
}

export const updateTask = (id: string, input: UpdateTaskInput): Task | undefined => {
    const taskIndex = findTaskIndex(id)
    if (taskIndex === -1) {
        return undefined
    }

    const existingTask = tasks[taskIndex]
    if (!existingTask) {
        return undefined
    }

    const updatedTask: Task = {
        id: existingTask.id,
        title: input.title ?? existingTask.title,
        ...buildTaskDescription(input.description, existingTask.description),
        status: input.status ?? existingTask.status,
        priority: input.priority ?? existingTask.priority,
        createdAt: existingTask.createdAt,
        updatedAt: new Date().toISOString()
    }
    tasks[taskIndex] = updatedTask
    return updatedTask
}

export const deleteTask = (id: string): boolean => {
    const taskIndex = findTaskIndex(id)
    if (taskIndex === -1) {
        return false
    }
    tasks.splice(taskIndex, 1)
    return true
}

