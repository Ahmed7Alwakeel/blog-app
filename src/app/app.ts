import cookieParser from "cookie-parser"
import express, { NextFunction } from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize"
import blogRouter from "./route/blog.route"
import ErrorHandler from "../utils/ErrorHandler"
import authRouter from "./route/auth.route"

export const app = express()

app.use(cookieParser())
app.use(
	helmet({
		hsts: false,
		crossOriginResourcePolicy: false,
	})
)
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests, please try again in an hour!",
})
app.use("/api", limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(mongoSanitize())
app.use(express.static("src/public"))
app.use("/api/blogs", blogRouter)
app.use("/api/auth", authRouter)
app.all(
	"*",
	(req: Express.Request, res: Express.Response, next: NextFunction) => {
		next(new Error("Not Found"))
	}
)
app.use(ErrorHandler.globalError)
