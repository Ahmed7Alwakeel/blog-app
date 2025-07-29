import { NextFunction, Response, Request } from "express"
import { catchAsync } from "../../utils/catchAsync"
import AppError from "../service/appError.service"
import AuthService from "../service/auth.service"
import { validationResult } from "express-validator"

class AuthMiddleware {
	static protect = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const token = req.cookies["auth_token"]
			if (!token) next(new AppError("Unauthenticated", "Fail", 401))
			const user = await AuthService.verifyToken(token)
			req.currentUser = user
			next()
		}
	)

	static validate = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req)
			if (errors.isEmpty()) {
				next()
				return
			}

			return res.status(400).json({
				status: "FAIL",
				errors: errors.array().map((err) => ({
					message: err.msg,
				})),
				statusCode: 400,
			})
		}
	)
}
export default AuthMiddleware
