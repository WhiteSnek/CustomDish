import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log(process.env.CORS_ORIGIN)

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"))

app.use(cookieParser())

// route imports
// import imageRouter from './routes/images.routes.js'
import userRouter from './src/routes/user.routes.js'
import dishRouter from './src/routes/dishes.routes.js'
import restaurantRouter from './src/routes/restaurants.routes.js'

app.get('/',(req,res)=>{
    res.json('hello')
})

// router use
// app.use("/api/v1", imageRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dish", dishRouter)
app.use("/api/v1/restaurant", restaurantRouter)

export {app}