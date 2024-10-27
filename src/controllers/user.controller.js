import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
const registerUser = asyncHandler( async ( req , res ) => {
    // get user details from frontend 
    // validation 
    // check if user already exists : username & email
    // check for images , check for avatar 
    // upload them to cloudinary , avatar 
    // create user object - create entry in db 
    // remove password and refresh token field from response 
    // check for user creation 
    // return response 
    // hash password
    // save user to db

    const { fullName , email , userName , password} = req.body ; 
    console.log("email: " , email) ;

    // if( fullName === "" ){
    //     throw new ApiError(400 , "fullname is required") ; 
    // }

    if(
        [fullName , email , userName , password ].some((field)=>(field?.trim() === ""))
    ){
        throw new ApiError(400 , "All fields are required !!! ") ; 
    }

    const existedUser = await User.findOne({
        $or: [{ userName } , { email }]
    })
    if(existedUser) {
        throw new ApiError(409 , "Username or email already exists !!! ") ; 
    }

    const avatarLocalPath = req.files?.avatar[0]?.path ; 
    // const converImageLocalPath = req.files?.coverImage[0]?.path  ;
    let converImageLocalPath ;
    if( req.files && req.files?.coverImage?.length > 0){
        converImageLocalPath = req.files?.coverImage[0]?.path ; 
    }  // if cover image is not provided , it will remain null

    if( !avatarLocalPath ){
        throw new ApiError(400 , "Avatar file is required ") ; 
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath) ; 
    const coverImage = await uploadOnCloudinary(converImageLocalPath) ; 
    
    if(!avatar){
        throw new ApiError(400 , "Avatar file is required ") ; 
    }

    const user = await User.create({
        fullName , 
        avatar : avatar.url ,
        coverImage : coverImage?.url || "" ,
        email ,
        userName : userName.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if( !createdUser ){
        throw new ApiError(500 , "Something went wrong whie creating the user ") ;  // internal server error
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully ") 
    )

})

export { registerUser}