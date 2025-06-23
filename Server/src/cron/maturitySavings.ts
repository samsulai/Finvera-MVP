import cron from 'node-cron';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SavingsPlan from '../models/savingsPlan';
import Wallet from '../models/Wallet';

dotenv.config();

// Connect to DB (if this is not already done globally in your app)
mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any)
    .then(() => {
        console.log("Cron DB connected");

        // Schedule the cron to run every hour (can be adjusted)
        cron.schedule('0 * * * *', async () => {
            console.log('Running matured savings job...');

            const now = new Date();

            const maturedSavings = await SavingsPlan.find({
                isActive: true,
                endDate: { $lte: now }
            });

            for (const plan of maturedSavings) {
                // Credit wallet
                const wallet = await Wallet.findOne({ user: plan.user });

                if (wallet) {
                    wallet.balance += plan.amount;
                    await wallet.save();

                    plan.isActive = false;
                    await plan.save();

                    console.log(`Credited ₦${plan.amount} to user ${plan.user}`);
                }
            }

            console.log('Matured savings job completed.');
        });
    })
    .catch(err => {
        console.error("Cron DB connection failed:", err);
    });
