import { Request, Response } from 'express';
import User from "../models/User";
import {hashPassword, comparePasswords} from "../utils/hash";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Wallet from "../models/Wallet";
import axios from 'axios';

export const signup = async (req: Request, res : Response) => {
try {
    const {fullName, email , password} = req.body;

    const existingUser = await User.findOne({email})
    if(existingUser) {
        return res.status(400).json({message: "User already exists"})
    }

    const passwordHash = await hashPassword(password);


    const newUser = new User({
        fullName,
        email,
        passwordHash

    })

    await newUser.save()

    const newWallet = new Wallet({
        user: newUser._id,
        balance: 0
    })

    await newWallet.save();
    return res.status(201).json({message: "User created successfully", user:newUser, wallet:newWallet})

}catch (error) {
return res.status(500).json({message : error})
}
}

export const login = async (req: Request, res : Response) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email})
        if (!existingUser) {
            return res.status(404).json({message: "User not found"})
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = jwt.sign(
            {id : existingUser._id},
            process.env.JWT_SECRET as string,
            {expiresIn: "1d"}
        )

        res.status(200).json({message : "Login successful", token, user:{
                id: existingUser._id,
                email: existingUser.email,
                fullName: existingUser.fullName,
            }
        })
    }catch (error) {
        return res.status(500).json({message : error})
    }
}

