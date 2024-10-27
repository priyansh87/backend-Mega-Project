import express from "express" ; 
import cors from 'cors' ;
import cookieParser from 'cookie-parser';
const app = express() ;


app.use( cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}))

app.use( express.json({limit: "16kb"}))
app.use( express.urlencoded({extended:true , limit:"16kb"}))
app.use( express.static("public")) 
app.use( cookieParser() )


// routes : 
import userRouter from "./routes/user.routes.js" 


//routes declaration 
// ! jb koi /user pe ayega tb control userRouter pe jayega aur vo user.routes.js mai jayega and vaha kaam krega 
// ! user ke baad ke jitne bhi routes hai vo sb ab userRutes main hai jaise ki 
// ! http://localhost:9000/api/v1/users/register -> register router file mai hai  aur register jo krega vo controller mai hai 
// ! http://localhost:9000/api/v1/users/login -> login router file mai hai  aur login jo krega vo controller mai hai 
app.use("/api/v1/users", userRouter )  // user routes are mounted here



export  { app }
