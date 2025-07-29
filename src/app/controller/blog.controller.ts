import { Response, Request } from "express"
import BlogService from "../service/blog.service"
import { catchAsync } from "../../utils/catchAsync"

class Blog {
	getAll = catchAsync(async (req: Request, res: Response) => {
		const data = await BlogService.findAll(req)
		res.status(200).json({ data })
	})

	getOne = catchAsync(async (req: Request, res: Response) => {
		const data = await BlogService.findOne(req.params.id)
		res.status(200).json({ data })
	})

	createOne = catchAsync(async (req: Request, res: Response) => {
		const data = await BlogService.createOne(req)
		res.status(200).json({ data })
	})

	updateOne = catchAsync(async (req: Request, res: Response) => {
		const data = await BlogService.updateOne(req.params.id, req.body)
		res.status(200).json({ data })
	})

	deleteOne = catchAsync(async (req: Request, res: Response) => {
		const data = await BlogService.deleteOne(req.params.id)
		res.status(200).json({ message: "success" })
	})
}

export default new Blog()
