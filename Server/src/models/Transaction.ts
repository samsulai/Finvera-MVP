// models/Transaction.ts

import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'deposit' | 'withdrawal';
export type TransactionStatus = 'pending' | 'successful' | 'failed';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    reference: string;
    createdAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['deposit', 'withdrawal'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'successful', 'failed'],
            default: 'pending',
        },
        reference: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;
