import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId) ; 
        
        if(!user) {
            throw new ApiError(404 , "user not found") ;
        }

        const accessToken =   user.generateAccessToken() ; 
        const refreshToken = user.generateRefreshToken() ;
        // console.log("got generated ? ",refreshToken) ;
        user.refreshToken = refreshToken ; 
        await user.save({ validateBeforeSave : false }) ; 
        
        return { accessToken, refreshToken } ;

    } catch (error) {
        throw new ApiError(500 , "something went wrong while generating refhresh and access token")
    }
}




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


const loginUser = asyncHandler( async ( req , res ) => {
    // req body se data 
    // userName or email 
    // password
    // check if user exists
    // compare password
    // generate access token
    // generate refresh token
    // send cookie 
    // return response

    const {email , userName , password } = req.body ; 
    if( !(userName || email) ){
        throw new ApiError( 400 , "username or email is required ")
    }

    const user = await User.findOne({
        $or : [{userName} , {email}]
    })

    if( !user ) {
        throw new ApiError(404 , "user does not exist ") ;
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if( !isPasswordValid ) {
        throw new ApiError(401 , "inavlid user credentials  ") ;
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id) ;
    const loggedInUser = await User.findById(user._id).select( "-password -refreshToken") ; 
    // console.log(accessToken , refreshToken) ;
    const options = {
        httpOnly : true , 
        secure : true , 
    }

    return res.status( 200 )
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options ) 
    .json(
        new ApiResponse(
            200 , 
            {
                user: loggedInUser , accessToken , refreshToken 
            }, 
            "User logged in successfully"
        )
    )
})


const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        
        {
            $set : {
                refreshToken : undefined,
            }
        },
        {
            new : true 
        }
        
    )

    const options = {
        httpOnly : true , 
        secure : true , 
    }

    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json( new ApiResponse(200 , {} , "user logged Out successfully ")) ;
})




const refreshAccessToken = asyncHandler(async (req , res )=>{
    try {
        const incomingRefreshToken = req.cookie.refreshAccessToken || req.body.refreshAccessToken ; 

        if( !incomingRefreshToken ){
            throw new ApiError((401 , "unauthorized request ") ) ; 
        }
    
        const decoded = await jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded._id) ;
        if(!user){
            throw new ApiError(404 , "user not found ") ;
        }
    
        if( incomingRefreshToken !== user?.refreshToken) {
            throw ApiError(401 , "Refresh token is expired or used !") ;
        }
        const options = {
            httpOnly : true , secure : true 
        }
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id) ;
    
        return res
        .status(200)
        .cookie("accessToken"  , accessToken  , options ) 
        .cookie("refreshToken" , newrefreshToken , options ) 
        .json(
            new ApiResponse(
                200 , 
                {accessToken ,refreshToken :  newrefreshToken},
                "access token refreshed token"
    
            )
        )
    } catch (error) {
        throw ApiError(401 . error?.message || "invalid refresh token") ;
        
    }

})


const changeCurrentUserPassword = asyncHandler( async ( req , res )=>{
    // i have to change the password of the user if the token is valid 
    // bring data from req.body 
    // validate data 
    // hash new password 
    // update user password in db
    // return response

    const { oldPassword , newPassword } = req.body ;
    const user = await User.findById( req.user._id ) ; 
    if(!user){
        throw new ApiError(404 , "user not found ") ;
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if( !isPasswordCorrect ){
        throw new ApiError(400 , " password not  correct  ") ;
    }
    user.password = newPassword ; 
    await user.save({validateBeforeSave : false })

    return res
    .status(200)
    .json( new ApiResponse(200 , {} , "password changed successfully ")) ; 



})


const getCurrentUser = asyncHandler ( async (req , res ) =>{
    return res.status(200)
    .json( new ApiResponse( 200 , req.user , "current user feetched successfully  ")) ;
})

const updateAccountDetails = asyncHandler( async ( req , res ) => {
    // get data from req.body
    // validate data
    // update user details in db
    // return response

    const {fullName , email } = req.body ; 
    if( !fullName && !email ){
        throw new ApiError( 400 , "Allfields are required ") ;
    }

    const user = User.findByIdAndUpdate( 
        req.user?._id,
        {
            $set : {
                fullName,
                email : email.toLowerCase()
            }
        },
        { new : true } // because of new the infor after updating is returned 
        
    ).select("-password")

    return res
    .status(200)
    .json( new ApiResponse(200 , user , "Account details updated successfully !!! "))
})

// to change images make another endpoint and controller functions 

const updateUserAvatar = asyncHandler ( async ( req , res ) => {
    // get data from req.body
    // validate data
    // upload image to cloudinary
    // update user avatar in db
    // return response
    const avatarLocalPath = req.file?.path ; 
    if(!avatarLocalPath ){
        throw new ApiError(400 , "avatar file is required ") ;
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath) ;
    
    if(!avatar.url){
        throw new ApiError(400 , "Error uploading avatar ") ;
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        { new : true }
    ).select("-password")

    return res
    .status(200) 
    .json( new ApiResponse( 200 , user , "avatar image updated successfully ")) ;

} )


const updateCoverImage = asyncHandler( async (req , res ) => {
    // get data from req.body
    // validate data
    // upload image to cloudinary
    // update user cover image in db
    // return response
    const coverImageLocalPath = req.file?.path ; 
    if(!coverImageLocalPath ){
        throw new ApiError(400 , "cover image file is required ") ;
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath) ;
    
    if(!coverImage.url){
        throw new ApiError(400 , "Error uploading cover image ") ;
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id ,
        {
            $set:{
                coverImage : coverImage.url
            }
        }, 
        {new : true}
    )

    return res
    .status(200) 
    .json( new ApiResponse( 200 , user , "cover image updated successfully ")) ;
})


export { registerUser , loginUser , logoutUser , refreshAccessToken ,
        changeCurrentUserPassword, getCurrentUser , updateAccountDetails, updateUserAvatar , updateCoverImage}