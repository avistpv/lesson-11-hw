import {NextFunction, Request, Response} from 'express'
import {getTasks, getTaskById, createTask, updateTask, deleteTask} from '../services/task.service.js'
import AppError from '../errors.js'
import {TaskFilters} from '../types/task.types.js'

function validateTaskId(id: string | undefined, next: NextFunction): id is string {
    if (!id) {
        next(new AppError('Task ID is required', 400))
        return false
    }
    return true
}

function handleTaskNotFound<T>(result: T | undefined | boolean, next: NextFunction): result is T {
    if (!result) {
        next(new AppError('Task not found', 404))
        return false
    }
    return true
}

export const getAllTasks = (
    req: Request<{}, {}, {}, TaskFilters>,
    res: Response,
    next: NextFunction
) => {
    try {
        const filters: TaskFilters = {...req.query}
        const tasks = getTasks(filters)
        res.json(tasks)
    } catch (error) {
        next(error)
    }
}

export const getTask = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if (!validateTaskId(id, next)) {
            return
        }
        const task = getTaskById(id)

        if (!handleTaskNotFound(task, next)) {
            return
        }

        res.json(task)
    } catch (error) {
        next(error)
    }
}

export const createTaskHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, description, status, priority} = req.body

        const newTask = createTask({
            title,
            description,
            status,
            priority
        })

        res.status(201).json(newTask)
    } catch (error) {
        next(error)
    }
}

export const updateTaskHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if (!validateTaskId(id, next)) {
            return
        }
        const {title, description, status, priority} = req.body

        const updatedTask = updateTask(id, {
            title,
            description,
            status,
            priority
        })

        if (!handleTaskNotFound(updatedTask, next)) {
            return
        }

        res.json(updatedTask)
    } catch (error) {
        next(error)
    }
}

export const deleteTaskHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if (!validateTaskId(id, next)) {
            return
        }
        const deleted = deleteTask(id)

        if (!handleTaskNotFound(deleted, next)) {
            return
        }

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
