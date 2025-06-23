/**
 * @swagger
 * /withdrawals:
 *   post:
 *     summary: Withdraw funds to saved bank account
 *     tags: [Withdrawals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient balance or invalid bank
 */

import { withdrawFunds } from '../controllers/withdrawal.controller';
import {authenticate, } from '../middleware/authMiddleware';
import { withdrawLimiter } from '../middleware/rateLimiter';
const router = require('express').Router();
// Route to create a virtual account
router.post('/withdrawal',authenticate,withdrawLimiter, withdrawFunds )

export default router;