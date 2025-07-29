import mongoose, { Query } from "mongoose"
import { IBlog } from "../interface/blog.interface"

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
})

blogSchema.pre(/^find/, function (this: Query<IBlog, IBlog[]>, next) {
	this.select("-__v")
	next()
})

const BlogModal = mongoose.model("Blog", blogSchema)
export default BlogModal
