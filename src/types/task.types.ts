export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
    id: string
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    createdAt: string
    updatedAt: string
}

export type TaskInputBase = {
    title: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
}

export type UpdateTaskInput = Partial<TaskInputBase>

export type TaskFilters = {
    createdAt?: string
    status?: TaskStatus
    priority?: TaskPriority
}
