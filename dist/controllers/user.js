"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entities/User");
const data_source_1 = require("../data-source");
class UserController {
    constructor() {
        this.getUserById = async (req, res) => {
            const { id } = req.params;
            try {
                const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { id },
                });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: "Error fetching user", error });
            }
        };
        this.getAllUsers = async (req, res) => {
            try {
                const users = await data_source_1.AppDataSource.getRepository(User_1.User).find();
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json({ message: "Error fetching users", error });
            }
        };
        this.updateUser = async (req, res) => {
            const { id } = req.params;
            const { name, email, password, role } = req.body;
            try {
                const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { id },
                });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                user.name = name || user.name;
                user.email = email || user.email;
                user.password = password || user.password;
                user.role = role || user.role;
                const updatedUser = await data_source_1.AppDataSource.getRepository(User_1.User).save(user);
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating user", error });
            }
        };
        this.deleteUser = async (req, res) => {
            const { id } = req.params;
            try {
                const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { id },
                });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                await data_source_1.AppDataSource.getRepository(User_1.User).remove(user);
                return res.status(200).json({ message: "User deleted successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: "Error deleting user", error });
            }
        };
    }
}
exports.default = new UserController();
