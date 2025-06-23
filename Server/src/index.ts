import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";
import helmet from "helmet"
import morgan from 'morgan';
import mongoose from 'mongoose';

/*Route Imports*/
import authRoutes from './routes/auth';
import webhookRoutes from "./routes/webhook";
import paymentRoutes from "./routes/Payments";
import walletRoutes from "./routes/wallet";
import TransactionRoutes from "./routes/transactions";
import bankRoutes from "./routes/saveBank"
import withdrawalRoutes from "./routes/withdrawal"
import { generalLimiter } from './middleware/rateLimiter';
import savingsRoutes from './routes/savings'
import { setupSwagger } from './docs/swagger';




/*Configurations*/
dotenv.config();
const app = express();
setupSwagger(app);

app.use('/api/webhook', webhookRoutes)
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api',walletRoutes )
app.use("/api",paymentRoutes)
app.use('/api', TransactionRoutes)
app.use('/api', bankRoutes)
app.use('/api', withdrawalRoutes)
app.use('/api', savingsRoutes)

app.use(generalLimiter)




mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        app.listen(PORT, () =>
            console.log(`✅ MongoDB connected | Server Port: ${PORT}`)
        );
    })
    .catch((err) => console.error(`❌ Connection error: ${err.message}`));
