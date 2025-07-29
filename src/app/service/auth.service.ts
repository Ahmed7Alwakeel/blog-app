import { IUser } from "../interface/user.interface"
import { UserModal } from "../model/user.model"
import AppError from "./appError.service"
import jwt, { JwtPayload } from "jsonwebtoken"
import { Response } from "express"

class AuthService {
	static createToken = (id: string, tokenVersion: number, res: Response) => {
		const token = jwt.sign(
			{ id, tokenVersion },
			process.env.JWT_SECRET as string,
			{
				expiresIn: "1d",
			}
		)
		res.cookie("auth_token", token, {
			httpOnly: true,
			maxAge: 86400000,
		})
	}

	static signup = async (res: Response, body: IUser) => {
		const { name, email, password, confirmPassword } = body
		const data = await UserModal.create({
			name,
			email,
			password,
			confirmPassword,
			tokenVersion: 1,
		})
		const user = await UserModal.find({ email: data.email }).select("-password")
		this.createToken(data?.id, data?.tokenVersion, res)
		return user
	}

	static login = async (res: Response, body: IUser) => {
		const { email, password } = body
		if (!email || !password)
			throw new AppError("Please provide email and password", "Fail", 400)
		let user = await UserModal.findOne({ email })
		if (!user || !(await user?.comparePassword(password)))
			throw new AppError("Invalid credentials", "Fail", 422)
		user.tokenVersion = user.tokenVersion + 1
		user.save({ validateBeforeSave: false })
		this.createToken(user?.id, user?.tokenVersion, res)
		user = await UserModal.findOne({ email }).select("-password")
		return user
	}

	static logout = async (res: Response, id: string) => {
		const user = await UserModal.findById(id)
		if (!user) throw new AppError("Invalid credentials", "Fail", 422)
		user.tokenVersion = 0
		user.save({ validateBeforeSave: false })
		res.cookie("auth_token", "", {
			expires: new Date(0),
		})
	}

	static verifyToken = async (token: string) => {
		const error = new AppError("Unauthenticated", "Fail", 401)
		const decoded: JwtPayload | null = jwt.decode(token, { json: true })
		if (!decoded) {
			throw error
		}
		const userId = (decoded as { id: string }).id
		const tokenV = (decoded as { tokenVersion: number }).tokenVersion

		const user = await UserModal.findById(userId, {
			password: 0,
		})
		if (!user) {
			throw error
		}

		if (tokenV !== user.tokenVersion) {
			throw new AppError("Token expired", "Fail", 401)
		}

		return user
	}
}

export default AuthService
