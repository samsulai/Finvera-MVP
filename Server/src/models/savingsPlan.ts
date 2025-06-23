import mongoose, { Schema, Document } from "mongoose";

export type SavingsType = "fixed" | "flexible";
export type SavingsStatus = "active" | "completed" | "cancelled";

export interface ISavingsPlan extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    type: SavingsType;
    durationInDays: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    status: SavingsStatus;
    autoWithdraw: boolean;
    hasWithdrawn: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SavingsPlanSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["fixed", "flexible"],
            required: true,
        },
        durationInDays: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
        },
        autoWithdraw: {
            type: Boolean,
            default: true,
        },
        hasWithdrawn: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const SavingsPlan = mongoose.model<ISavingsPlan>("SavingsPlan", SavingsPlanSchema);
export default SavingsPlan;
