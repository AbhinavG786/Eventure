"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const userRole_1 = require("../entities/enum/userRole");
const data_source_1 = require("../data-source");
class AuthController {
    constructor() {
        this.signUp = async (req, res) => {
            const { name, email, password, role } = req.body;
            try {
                const hashedPassword = await bcrypt_1.default.hash(password, 10);
                const user = new User_1.User();
                user.name = name;
                user.email = email;
                user.password = hashedPassword;
                user.role = role || userRole_1.UserRole.STUDENT;
                const savedUser = await data_source_1.AppDataSource.getRepository(User_1.User).save(user);
                return res.status(201).json({
                    message: "User created successfully",
                    user: {
                        id: savedUser.id,
                        name: savedUser.name,
                        email: savedUser.email,
                        role: savedUser.role,
                    },
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating user", error });
            }
        };
        this.login = async (req, res) => {
            const { email, password } = req.body;
            if (!email) {
                return res.status(401).json({ message: "Email is required" });
            }
            if (!password) {
                return res.status(401).json({ message: "Password is required" });
            }
            try {
                const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { email },
                });
                if (!user) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                const checkPasswordValidation = await bcrypt_1.default.compare(password, user.password);
                if (!checkPasswordValidation) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRY || "3600", 10) });
                return res.status(200).json({
                    message: "Login successful",
                    accessToken,
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Error logging in", error });
            }
        };
        this.token = async (req, res) => {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Token is required" });
            }
            jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid token" });
                }
                req.user = user;
                return res.status(200).json({
                    message: "Token is valid",
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                });
            });
        };
    }
}
exports.default = new AuthController();
