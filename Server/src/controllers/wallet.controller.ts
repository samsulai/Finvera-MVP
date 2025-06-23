import { Request, Response } from 'express';
import Wallet from '../models/Wallet';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export const getWalletBalance = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID missing' });
            return;
        }

        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            res.status(404).json({ message: 'Wallet not found' });
            return;
        }

        res.status(200).json({
            message: 'Wallet retrieved successfully',
            data: {
                balance: wallet.balance,
                walletId: wallet._id,
            },
        });
        return;
    } catch (error) {
        console.error('Error retrieving wallet:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
