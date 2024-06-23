import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

const allowedOrigins = [process.env.CORS_ORIGIN];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) {
            // For requests with no origin (like mobile apps or curl requests)
            callback(null, true);
        } else if (allowedOrigins.some(url => origin.startsWith(url))) {
            // Allow origin if it starts with any of the allowed origins
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
    origin: allowedOrigins,
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
import orderRouter from './src/routes/order.routes.js'
import ingredientRouter from './src/routes/ingredients.routes.js'
import cartRouter from './src/routes/cart.routes.js'

app.get('/',(req,res)=>{
    res.json('hello')
})

// router use
// app.use("/api/v1", imageRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dish", dishRouter)
app.use("/api/v1/restaurant", restaurantRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/ingredient",ingredientRouter)
app.use("/api/v1/cart",cartRouter)

export {app}