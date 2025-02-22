import dotenv from "dotenv";
import {app} from './app.js'
import { connectDB } from "./src/config/database.js";

dotenv.config({
    path: "./env"
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on PORT:" + process.env.PORT);
    connectDB();
  });