// controllers/bank.controller.ts

import { Request, Response } from "express";
import axios from "axios";
import User from "../models/User";


interface AuthenticatedRequest extends Request {
    user?: { id: string };
}
export const saveBankDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { accountNumber, bankCode } = req.body;
    const userId = req.user?.id;


    try {
        if (!accountNumber || !bankCode) {
            res.status(400).json({ message: "Account number and bank code are required." });
            return;
        }


        const user = await User.findById(userId).lean();
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        // Check for duplicate bank details BEFORE calling Paystack for verification
        if (user.withdrawalBank &&
            user.withdrawalBank.accountNumber === accountNumber &&
            user.withdrawalBank.bankCode === bankCode) {
            res.status(400).json({ message: "Bank already saved." });
            return;
        }
        const verifyRes = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const accountName = verifyRes.data.data.account_name;


        // Step 2: Create recipient
        const recipientRes = await axios.post(
            "https://api.paystack.co/transferrecipient",
            {
                type: "nuban",
                name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: "NGN",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const recipient = recipientRes.data.data;

        // Step 3: Save to user
        await User.findByIdAndUpdate(userId, {
            withdrawalBank: {
                accountNumber,
                bankCode,
                bankName: recipient.details.bank_name,
                accountName,
                recipientCode: recipient.recipient_code,
            },
        });

         res.status(200).json({
            message: "Bank details saved successfully",
            data: {
                accountNumber,
                bankName: recipient.details.bank_name,
                accountName,
            },
        });
    } catch (error: any) {
        console.error("Save bank error:", error.response?.data || error.message);
         res.status(500).json({ message: "Failed to save bank details" });
    }
};
