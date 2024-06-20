import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"))

app.use(cookieParser())

// route imports
// import imageRouter from './routes/images.routes.js'
import userRouter from './routes/user.routes.js'
import dishRouter from './routes/dishes.routes.js'
import restaurantRouter from './routes/restaurants.routes.js'

// router use
// app.use("/api/v1", imageRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dish", dishRouter)
app.use("/api/v1/restaurant", restaurantRouter)

export {app}