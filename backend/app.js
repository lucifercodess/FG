import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import  userRoute from './routes/user.route.js'
import  postRoute from './routes/post.route.js'
import  messageRoute from './routes/message.route.js'

dotenv.config();
const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/user',userRoute);
app.use('/api/post',postRoute);
app.use('/api/message',messageRoute);


const PORT = process.env.PORT;

app.listen(PORT,()=>{
  connectDB();
  console.log(`Server is running on port ${PORT}`);
})