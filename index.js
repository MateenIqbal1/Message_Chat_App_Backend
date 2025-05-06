import express from 'express'
import authRoutes from './routes/authRoute.js'
import messageRoutes from './routes/messageRoute.js'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app ,server} from './lib/socket.js'
import mongoose from 'mongoose'

dotenv.config()

const PORT=process.env.PORT

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Mongodb connected'))
    .catch(error => console.log(error));


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://message-chat-app-frontend.vercel.app" 
    ],
    credentials: true, 
  })
);

  


app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
app.use('/',(req,res)=>{
  res.json({ message: "Welcome to chat app server" });
})



export default app