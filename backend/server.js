import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import helmet from 'helmet';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRouter from './routes/auth.js';
import customerRouter from './routes/customer.js';
import adminRouter from './routes/admin.js';
import restaurantRouter from './routes/restaurant.js';
import deliveryRouter from './routes/delivery.js';
import { initOrderSocket } from './sockets/orderSocket.js';

// app config
const app = express()
const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet());

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/auth', authRouter);
app.use('/api/customer', customerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/delivery', deliveryRouter);

app.get("/", (req, res) => {
    res.send("API Working")
  });

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  // orderSocket handles join events
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
initOrderSocket(io);

server.listen(port, () => console.log(`Server started on http://localhost:${port}`));