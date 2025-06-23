
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Fetch all transactions of the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions fetched
 *       401:
 *         description: Unauthorized
 */

import express from 'express';
import { getTransactions } from '../controllers/transaction.controller';
import {authenticate, } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/transactions', authenticate, getTransactions);

export default router;
