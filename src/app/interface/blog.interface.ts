import mongoose from "mongoose"

export interface IBlog {
	title: string
	content: string
	user: mongoose.Types.ObjectId
}
