import { Request, Response } from 'express';
import User from '../models/User';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

export const handlePaystackWebhook = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        let jsonString: string;
        if (Buffer.isBuffer(req.body)) {
            jsonString = req.body.toString('utf8');
        } else {
            // req.body is already an object
            jsonString = JSON.stringify(req.body);
        }
        //const event = JSON.parse(req.body.toString()); // bodyParser.raw used
        const event = JSON.parse(jsonString);
        if (event.event === 'charge.success') {
            const { email } = event.data.customer;
            const amount = event.data.amount / 100; // Convert from kobo to naira
            const reference = event.data.reference;

            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).send('User not found');
                return;
            }

            const wallet = await Wallet.findOne({ user: user._id });
            if (!wallet) {
                res.status(404).send('Wallet not found');
                return;
            }

            // Check if transaction already exists (avoid duplicates)
            const existingTx = await Transaction.findOne({ reference });
            if (existingTx) {
                console.log('Duplicate transaction. Skipping.');
                res.status(200).send('Transaction already processed');
                return;
            }

            // Update wallet balance
            wallet.balance += amount;
            await wallet.save();

            // Save transaction record
            await Transaction.create({
                user: user._id,
                amount,
                type: 'deposit',
                status: 'successful',
                reference,
            });

            console.log(`Wallet funded for ${email} with ₦${amount}`);
        }

        res.status(200).send('Webhook received');
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(500).send('Error handling webhook');
    }
};
