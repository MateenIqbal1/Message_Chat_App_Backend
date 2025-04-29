import express from 'express'
import authRoutes from './routes/authRoute.js'
import messageRoutes from './routes/messageRoute.js'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app ,server} from './lib/socket.js'

dotenv.config()

const PORT=process.env.PORT

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use(
    cors({
      origin: "http://localhost:5173", // Your frontend URL
      credentials: true, // Required for sending cookies with cross-origin requests
    })
  );
  

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
app.use('/',(req,res)=>{
  return res({message:"Welcome to chat app server"})
})

export default app