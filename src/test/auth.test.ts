import jwt from "jsonwebtoken"
import { Response } from "express"
import AuthService from "../app/service/auth.service"
import { UserModal } from "../app/model/user.model"
import AppError from "../app/service/appError.service"
import { IUser } from "../app/interface/user.interface"

jest.mock("./../app/model/user.model")
jest.mock("jsonwebtoken")

const mockRes = () => {
	const res = {} as Response
	res.cookie = jest.fn().mockReturnValue(res)
	return res
}

describe("AuthService test suite", () => {
	afterEach(() => jest.clearAllMocks())

	describe("createToken test suite", () => {
		it("should create a token and set it as cookie", () => {
			const res = mockRes()
			;(jwt.sign as jest.Mock).mockReturnValue("fake_token")

			AuthService.createToken("userId123", 1, res)

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: "userId123", tokenVersion: 1 },
				process.env.JWT_SECRET,
				{ expiresIn: "1d" }
			)
			expect(res.cookie).toHaveBeenCalledWith("auth_token", "fake_token", {
				httpOnly: true,
				maxAge: 86400000,
			})
		})
	})

	describe("signup test suite", () => {
		it("should create a new user and return it without password", async () => {
			const res = mockRes()
			const userData = {
				name: "Test",
				email: "test@example.com",
				password: "123456",
				confirmPassword: "123456",
				tokenVersion: 1,
			}

			const createdUser = { ...userData, id: "abc123" }
			const selectedUser = [{ name: "Test", email: "test@example.com" }]

			;(UserModal.create as jest.Mock).mockResolvedValue(createdUser)
			;(UserModal.find as jest.Mock).mockReturnValue({
				select: jest.fn().mockReturnValue(selectedUser),
			})
			;(jwt.sign as jest.Mock).mockReturnValue("token")

			const result = await AuthService.signup(res, userData as IUser)

			expect(UserModal.create).toHaveBeenCalled()
			expect(res.cookie).toHaveBeenCalled()
			expect(result).toEqual(selectedUser)
		})
	})

	describe("login test suite", () => {
		it("should throw if email or password is missing", async () => {
			const res = mockRes()
			await expect(AuthService.login(res, {} as any)).rejects.toThrow(AppError)
		})

		it("should throw for invalid credentials", async () => {
			const res = mockRes()
			;(UserModal.findOne as jest.Mock).mockResolvedValue(null)
			await expect(
				AuthService.login(res, { email: "x", password: "y" } as any)
			).rejects.toThrow("Invalid credentials")
		})

		it("should login and return user without password", async () => {
			const res = mockRes()
			const mockUser = {
				id: "id1",
				email: "test@example.com",
				tokenVersion: 0,
				comparePassword: jest.fn().mockResolvedValue(true),
				save: jest.fn(),
			}
			const findOneMock = jest.fn().mockResolvedValueOnce(mockUser)
			findOneMock.mockReturnValueOnce({
				select: jest
					.fn()
					.mockResolvedValue({ name: "Test", email: "test@example.com" }),
			})
			;(UserModal.findOne as unknown as jest.Mock) = findOneMock
			;(jwt.sign as jest.Mock).mockReturnValue("token")

			const result = await AuthService.login(res, {
				email: "test@example.com",
				password: "123456",
			} as any)

			expect(mockUser.save).toHaveBeenCalled()
			expect(res.cookie).toHaveBeenCalled()
			expect(result).toEqual({ name: "Test", email: "test@example.com" })
		})
	})

	describe("logout test suite", () => {
		it("should reset tokenVersion and clear cookie", async () => {
			const res = mockRes()
			const user = {
				id: "id",
				tokenVersion: 1,
				save: jest.fn(),
			}

			;(UserModal.findById as jest.Mock).mockResolvedValue(user)

			await AuthService.logout(res, "id")

			expect(user.tokenVersion).toBe(0)
			expect(user.save).toHaveBeenCalled()
			expect(res.cookie).toHaveBeenCalledWith("auth_token", "", {
				expires: new Date(0),
			})
		})

		it("should throw if user not found during logout", async () => {
			const res = mockRes()
			;(UserModal.findById as jest.Mock).mockResolvedValue(null)

			await expect(AuthService.logout(res, "id")).rejects.toThrow(
				"Invalid credentials"
			)
		})
	})

	describe("verifyToken test suite", () => {
		it("should verify token and return user", async () => {
			;(jwt.decode as jest.Mock).mockReturnValue({
				id: "id123",
				tokenVersion: 2,
			})
			const user = { id: "id123", tokenVersion: 2 }

			;(UserModal.findById as jest.Mock).mockResolvedValue(user)

			const result = await AuthService.verifyToken("token")

			expect(result).toEqual(user)
		})

		it("should throw if token is invalid", async () => {
			;(jwt.decode as jest.Mock).mockReturnValue(null)
			await expect(AuthService.verifyToken("bad_token")).rejects.toThrow(
				"Unauthenticated"
			)
		})

		it("should throw if tokenVersion does not match", async () => {
			;(jwt.decode as jest.Mock).mockReturnValue({ id: "id", tokenVersion: 1 })
			;(UserModal.findById as jest.Mock).mockResolvedValue({
				id: "id",
				tokenVersion: 2,
			})

			await expect(AuthService.verifyToken("token")).rejects.toThrow(
				"Token expired"
			)
		})
	})
})
