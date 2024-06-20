import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const restaurantSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        required: true,
    },
    address: {
        type: String,
    },
    dishes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Dish"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

restaurantSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

restaurantSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

restaurantSchema.methods.generateAccessToken = function(){
    return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

restaurantSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Restaurant = mongoose.model("Restaurant",restaurantSchema);