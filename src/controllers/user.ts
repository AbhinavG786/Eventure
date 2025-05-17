import express from "express"
import {User} from "../entities/User"
import {UserRole} from "../entities/enum/userRole"
import { AppDataSource } from "../data-source"

class UserController {
    getUserById = async (req: express.Request, res: express.Response) => {
        const { id } = req.params
        try {
            const user = await AppDataSource.getRepository(User).findOne({
                where: { id },
            })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json({ message: "Error fetching user", error })
        }
    }
    getAllUsers = async (req: express.Request, res: express.Response) => {
        try {
            const users = await AppDataSource.getRepository(User).find()
            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json({ message: "Error fetching users", error })
        }
    }
    updateUser = async (req: express.Request, res: express.Response) => {
        const { id } = req.params
        const { name, email, password, role } = req.body
        try {
            const user = await AppDataSource.getRepository(User).findOne({
                where: { id },
            })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            user.name = name || user.name
            user.email = email || user.email
            user.password = password || user.password
            user.role = role || user.role

            const updatedUser = await AppDataSource.getRepository(User).save(user)
            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).json({ message: "Error updating user", error })
        }
    }
    deleteUser = async (req: express.Request, res: express.Response) => {
        const { id } = req.params
        try {
            const user = await AppDataSource.getRepository(User).findOne({
                where: { id },
            })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            await AppDataSource.getRepository(User).remove(user)
            return res.status(200).json({ message: "User deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: "Error deleting user", error })
        }
    }

}

export default new UserController()