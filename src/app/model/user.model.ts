import mongoose, { Query } from "mongoose"
import { IUser } from "../interface/user.interface"
import validator from "validator"
import * as bcrypt from "bcryptjs"
import { body } from "express-validator"

const userSchema = new mongoose.Schema<IUser>({
	name: {
		type: String,
		min: 3,
		max: 20,
		required: [true, "User name is required"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "User email is required"],
		validate: [validator.isEmail, "Please enter valid email"],
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		match: [
			/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{3,}$/,
			"Password must contain at least one letter and one number",
		],
	},
	confirmPassword: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			validator: function (this: IUser, val: string) {
				const password = this.password
				return val === password
			},
			message: "Passwords are not the same!",
		},
	},
	tokenVersion: {
		type: Number,
		default: 0,
	},
})

userSchema.pre(/^find/, function (this: Query<IUser, IUser[]>, next) {
	this.select("-__v -tokenVersion")
	next()
})

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next()
	this.password = await bcrypt.hash(this.password, 8)
	this.confirmPassword = undefined
	next()
})
userSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	return await bcrypt.compare(candidatePassword, this.password)
}

export const UserModal = mongoose.model("User", userSchema)

export const loginUserValidation = [
	body("email").isEmail().withMessage("Email must be valid"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters")
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{3,}$/)
		.withMessage("Password must contain numbers and letters")
]
