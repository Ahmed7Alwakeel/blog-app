import express from "express"
import blogController from "../controller/blog.controller"
import AuthService from "../service/auth.service"
import BlogService from "../service/blog.service"
import AuthMiddleware from "../middleware/auth.middleware"
import BlogMiddleware from "../middleware/blog.middleware"

const blogRouter = express.Router()

blogRouter
	.route("/")
	.get(blogController.getAll)
	.post(AuthMiddleware.protect, blogController.createOne)
blogRouter
	.route("/:id")
	.get(blogController.getOne)
	.delete(
		AuthMiddleware.protect,
		BlogMiddleware.permittedTo,
		blogController.deleteOne
	)
	.patch(
		AuthMiddleware.protect,
		BlogMiddleware.permittedTo,
		blogController.updateOne
	)

export default blogRouter
