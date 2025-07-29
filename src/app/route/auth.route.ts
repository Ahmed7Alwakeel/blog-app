import express from "express"
import AuthController from "../controller/auth.controller"
import AuthMiddleware from "../middleware/auth.middleware"
import { loginUserValidation } from "../model/user.model"

const authRouter = express.Router()

authRouter.route("/signup").post(AuthController.signup)
authRouter
	.route("/login")
	.post(loginUserValidation, AuthMiddleware.validate, AuthController.login)
authRouter.route("/logout").post(AuthMiddleware.protect, AuthController.logout)

export default authRouter
