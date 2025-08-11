

import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import {authRouter} from './routes/authRouter'
dotenv.config()
const app=express()
const PORT=process.env.PORT||5000
app.use(express.json())
app.use(cors({
    origin:`http://localhost:3000`,
    credentials:true

}))
app.use('/auth',authRouter)

app.get('/',(req:Request,res:Response)=>{
    res.send('hellllll')
})

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not defined in your environment variables.");
}

mongoose.connect(mongoUrl)
.then(()=>{
    console.log("connected");
    
})
.catch(()=>{
    console.log("not connected");
    
})
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
    
})
