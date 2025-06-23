import { Request, Response } from 'express';
import User from "../models/User";

import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Wallet from "../models/Wallet";
import axios from 'axios';





export const initializeTransaction = async (req: Request, res: Response) => {
    try {
        const { email, amount } = req.body;

        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount are required" });
        }

        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Initialize transaction
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, // Convert to Kobo
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const { authorization_url, reference } = response.data.data;

        return res.status(200).json({
            message: "Transaction initialized",
            authorization_url,
            reference,
        });
    } catch (error: any) {
        console.error("Initialize transaction error:", error.response?.data || error.message);
        return res.status(500).json({ message: "Unable to initialize transaction" });
    }
};





