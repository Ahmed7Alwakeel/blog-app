import mongoose from "mongoose"
import { IBlog } from "../app/interface/blog.interface"

export default class APIFiltration {
	query: mongoose.Query<Array<IBlog>, IBlog, {}>
	queryString = {}

	constructor(query: mongoose.Query<Array<IBlog>, IBlog, {}>, queryString: {}) {
		this.query = query
		this.queryString = queryString
	}

	filter() {
		const queryParams = { ...this.queryString }
		const excludedFields = ["page", "sort", "limit", "fields"]
		excludedFields.forEach((el) => delete (queryParams as any)[el])
		let queryStr = JSON.stringify(queryParams)
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt|in)\b/g,
			(match) => `$${match}`
		)
		this.query = this.query.find(JSON.parse(queryStr)) || []
		return this
	}

	metaData() {
		const page = (this.queryString as { page: string }).page
			? +(this.queryString as { page: string }).page * 1
			: 1
		const limit = (this.queryString as { limit: string }).limit
			? +(this.queryString as { limit: string }).limit * 1
			: 10
		const skip = (page - 1) * limit
		return {
			page,
			limit,
			skip,
		}
	}

	paginate() {
		this.query = this.query
			.skip(this.metaData().skip)
			.limit(this.metaData().limit)
		return this
	}
}
