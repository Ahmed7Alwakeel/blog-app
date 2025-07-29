import { NextFunction, Request } from "express"
import BlogModal from "../model/blog.model"
import { IBlog } from "../interface/blog.interface"
import AppError from "./appError.service"
import { catchAsync } from "../../utils/catchAsync"
import APIFiltration from "../../utils/APIFiltration"

class BlogService {
	static findAll = async (req: Request) => {
		let filter = {}
		const apiFiltration = new APIFiltration(BlogModal.find(filter), req.query)
			.filter()
			.paginate()
		const blogs = await apiFiltration.query
		if (!blogs) throw new AppError("Not found", "Fail", 404)
		const count = await BlogModal.countDocuments()
		const metaData = {
			page: apiFiltration.metaData().page,
			limit: apiFiltration.metaData().limit,
			no_of_pages:
				blogs.length < apiFiltration.metaData().limit
					? 1
					: Math.ceil(count / apiFiltration.metaData().limit) || 1,
			resultsPerPage: blogs.length,
			results: count,
		}
		return { blogs, metaData }
	}

	static findOne = async (id: string) => {
		const data = await BlogModal.findById(id)
		if (!data) throw new AppError("Not found", "Fail", 404)
		return data
	}

	static createOne = async (req: Request) => {
		const { title, content } = req.body as IBlog
		const user = req.currentUser.id
		return await BlogModal.create({ title, content, user })
	}

	static updateOne = async (id: string, body: IBlog) => {
		return await BlogModal.findByIdAndUpdate(id, body, {
			new: true,
			projection: { __v: 0 },
		})
	}

	static deleteOne = async (id: string) => {
		return await BlogModal.findByIdAndDelete(id)
	}
}

export default BlogService
