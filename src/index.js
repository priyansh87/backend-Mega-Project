// require('dotenv').config({path : './env'});
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
dotenv.config(
    {
        path : './env'
    }
)
// import express from 'express' ; //  we might need these two 
// const app = express() ;


connectDB()
.then(()=>{

    app.on("errror" , (error )=>{
        console.error("server could not be connected to mongodb") ; 
        process.exit(1) ;
    })

    app.listen( process.env.PORT ||8000, ()=>{
        console.log(`server is running on port : ${process.env.port}`)
    })
})
.catch((err)=>{
    console.log("mongo db connection failed !!! " , err) ;
})




/*

// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js" ;

! method one to  connect to db ( good )
import express from 'express' ;
const app = express();
;( async () => {

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        app.on("errror" , (error)=>{
            console.log( "mongoose connection error ", error);
            throw error ;
        })


        app.listen( process.env.PORT , ()=>{
            console.log("server has been connected on port " , process.env.PORT) ;
        })


    } catch (error) {
        console.error("ERROR : " , error ) ; 
        throw error;
    }

})()

*/
