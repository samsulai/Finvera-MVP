// controllers/withdraw.controller.ts

import { Request, Response } from "express";
import axios from "axios";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        withdrawalBank: {
            recipientCode: string;
        };
    };
}


export const withdrawFunds = async (req: AuthenticatedRequest, res: Response) => {
    const { amount } = req.body;
    const userId = req.user?.id;

    try {
        // Find user and wallet

        const user = await User.findById(userId);

        if (!user || !user.withdrawalBank?.recipientCode) {
            return res.status(400).json({ message: "Bank recipient not set" });
        }

        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Create a transaction record (status pending)
        const reference = `wd_${Date.now()}`;
        const transaction = await Transaction.create({
            user: userId,
            amount,
            type: "withdrawal",
            status: "pending",
            reference,
        });

        // Initiate withdrawal
        const transferResponse = await axios.post(
            "https://api.paystack.co/transfer",
            {
                source: "balance",
                amount: amount * 100, // Paystack expects kobo
                recipient: user.withdrawalBank.recipientCode,
                reason: "Wallet Withdrawal",
                reference,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const status = transferResponse.data.data.status;

        // Update wallet and transaction based on response
        if (status === "success") {
            wallet.balance -= amount;
            await wallet.save();

            transaction.status = "successful";
            await transaction.save();

            return res.status(200).json({
                message: "Withdrawal successful",
                data: {
                    amount,
                    reference,
                },
            });
        } else {
            transaction.status = "failed";
            await transaction.save();

            return res.status(500).json({ message: "Withdrawal failed at Paystack" });
        }
    } catch (err: any) {
        console.error("Withdrawal error:", err.response?.data || err.message);
        return res.status(500).json({ message: "Withdrawal request failed" });
    }
};
