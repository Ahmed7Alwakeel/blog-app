import "dotenv/config"
import mongoose from "mongoose"
import { app } from "./src/app/app"

mongoose.connect(process.env.MONGO_LOCAL_URL as string).then(() => {
	console.log("Connected to DB:", process.env.MONGO_LOCAL_URL)
})

app.listen(process.env.PORT, () => {
	console.log("Listening on port", process.env.PORT)
})
