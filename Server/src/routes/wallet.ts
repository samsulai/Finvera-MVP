// routes/wallet.routes.ts or wherever you handle wallet routes
/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved
 *       401:
 *         description: Unauthorized
 */

import express from 'express';
import { getWalletBalance } from '../controllers/wallet.controller';
import {authenticate, } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/wallet', authenticate, getWalletBalance);

export default router;
