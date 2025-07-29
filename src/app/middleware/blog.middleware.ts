import { NextFunction, Response, Request } from "express"
import { catchAsync } from "../../utils/catchAsync"
import AppError from "../service/appError.service"
import BlogModal from "../model/blog.model"

class BlogMiddleware {
	static permittedTo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const error = new AppError("Unauthorized", "Fail", 403)
			const userId = req.currentUser.id
			const id = req.params.id
			const blog = await BlogModal.findById(id)
			if (!blog?.user) {
				throw error
			} else {
				if (blog?.user.toString() !== userId) throw error
			}
			next()
		}
	)
}
export default BlogMiddleware
