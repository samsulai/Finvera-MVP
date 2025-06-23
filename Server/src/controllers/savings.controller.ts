import { Request, Response } from "express";
import SavingsPlan from "../models/savingsPlan";
import Wallet from '../models/Wallet'
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}
export const createSavingsPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { amount, type, durationInDays } = req.body;
        const userId = req.user?.id;

        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationInDays);

        const savings = await SavingsPlan.create({
            user: userId,
            amount,
            type,
            durationInDays,
            endDate,
        });

        wallet.balance -= amount;
        await wallet.save();

        return res.status(201).json({ message: "Savings plan created", savings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getUserSavingsPlans = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        const savingsPlans = await SavingsPlan.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({ savingsPlans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
