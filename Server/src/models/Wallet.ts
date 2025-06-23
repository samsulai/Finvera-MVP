// models/Wallet.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
    user: mongoose.Types.ObjectId;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema: Schema<IWallet> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
export default Wallet;
