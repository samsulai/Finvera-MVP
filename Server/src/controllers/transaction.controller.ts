import { Request, Response } from 'express';
import Transaction from '../models/Transaction'; // Adjust the import path as necessary

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export const getTransactions = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID missing' });
            return;
        }

        const transactions = await Transaction.find({ user: userId });

        if (transactions.length === 0) {
            res.status(200).json({
                message: 'No transactions found',
                transactions: []
            });
            return;
        }

        res.status(200).json({
            message: 'Transactions retrieved successfully',transactions

        });
        return; // optional, just to be explicit
    } catch (error) {
        console.error('Error retrieving Transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
