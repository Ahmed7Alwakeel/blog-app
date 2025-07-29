import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import AuthService from "../service/auth.service"

class AuthController {
	static login = catchAsync(async (req: Request, res: Response) => {
		const user = await AuthService.login(res, req.body)
		return res.status(200).json({ data: user })
	})

	static signup = catchAsync(async (req: Request, res: Response) => {
		const user = await AuthService.signup(res, req.body)
		return res.status(200).json({ data: user })
	})

	static logout = catchAsync(async (req: Request, res: Response) => {
		await AuthService.logout(res, req?.currentUser?.id)
		return res.status(200).json({ message: "logged out" })
	})
}
export default AuthController
