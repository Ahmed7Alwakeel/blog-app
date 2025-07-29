export interface IUser {
	id: string
	name: string
	email: string
	password: string
	confirmPassword?: string
	tokenVersion: number
	comparePassword(p1: string): Promise<string>
}

declare global {
	namespace Express {
		interface Request {
			currentUser: IUser
		}
	}
}
