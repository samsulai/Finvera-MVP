import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from 'morgan';
import mongoose from 'mongoose';

/* Route Imports */
import authRoutes from './routes/auth';
import webhookRoutes from "./routes/webhook";
import paymentRoutes from "./routes/Payments";
import walletRoutes from "./routes/wallet";
import TransactionRoutes from "./routes/transactions";
import bankRoutes from "./routes/saveBank";
import withdrawalRoutes from "./routes/withdrawal";
import savingsRoutes from './routes/savings';
import { generalLimiter } from './middleware/rateLimiter';

/* Configurations */
dotenv.config();

const app = express();

app.use('/api/webhook', webhookRoutes);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', walletRoutes);
app.use('/api', paymentRoutes);
app.use('/api', TransactionRoutes);
app.use('/api', bankRoutes);
app.use('/api', withdrawalRoutes);
app.use('/api', savingsRoutes);


    (app.use(generalLimiter))


export async function connectDB(uri: string) {
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ Connection error:', error);
        throw error;
    }
}

export default app;
