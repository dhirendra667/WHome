import { config } from 'dotenv';
config();

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

// middleware imports 
import errorMiddleware from './middlewares/error.middleware.js';

// Import all routes
import authuserRoutes from './routes/authuser.routes.js';
import userRoutes from "./routes/user.routes.js";
import listingRoutes from './routes/listing.routes.js';
import bookingRoutes from "./routes/booking.routes.js";

// import paymentRoutes from './routes/payment.routes.js';
// import miscRoutes from './routes/miscellaneous.routes.js';



const app = express();

// Middlewares

// Built-In Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Third-Party Middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, ""],
    credentials: true,
  })
);
app.use(morgan('dev'));  //for logger information of log information
app.use(cookieParser());



//ROUTES
app.use('/api/v1/authuser', authuserRoutes);
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/listing', listingRoutes);
app.use("/api/v1/booking", bookingRoutes);

// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1', miscRoutes);



// Server Status Check Route
app.get('/check', (_req, res) => {
  res.send('Check');
});


// Default catch all route - 404
app.all('/api', (_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});


// Custom error handling middleware
app.use(errorMiddleware);

export default app;

