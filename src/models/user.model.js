import mongoose  from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt' ;


const userSchema = new mongoose.Schema ( {
    userName : { type : String , required : true , unique : true ,lowercase : true , trim : true, index : true } ,
    email : { type : String , required : true , unique : true ,lowercase : true , trim : true, } ,
    fullName : { type : String , required : true , trim : true, index : true } ,
    avatar : {
        type : String , // url from cloudinary 
        required : true ,
    },
    coverImage : {
        type : String , // url from cloudinary 
    },

    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "Video",
        }
    ],


    password : { type : String , required : [true , "Password is required"] } ,
    refreshToken : { type : String } ,
    // role : { type : String , enum : ["admin", "user"], default : "user" }
} , 
{ timestamps : true }
)
// pre hook is a middleware in mongoose 
// just before the data is saved this hook will get executed -> to hash the password 
// this type of function is used because this has the scope for this keyword 
userSchema.pre ( "save" , async function(next){
    // if the password in the current model is not modified then just skip encrypting 
    if( !this.isModified("password")) return next();
    this.password = bcrypt.hash( this.password , 10)
    next()
})
// methods in mongoose 
userSchema.methods.isPasswordCorrect = async function ( password ){
    return await bcrypt.compare( password ,this.password )
}


// jwt is a bearer token -> jiske pas hoga usse info send krdenge 
userSchema.methods.generateAccessToken = function (){
    jwt.sign(
        {   // payload_key: database_field
            _id: this._id,
            email: this.email , 
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    jwt.sign(
        {   // payload_key: database_field
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)