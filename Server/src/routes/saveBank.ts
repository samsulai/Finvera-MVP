/**
 * @swagger
 * /bank:
 *   post:
 *     summary: Save bank details and create recipient
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountNumber, bankCode]
 *             properties:
 *               accountNumber:
 *                 type: string
 *               bankCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank details saved
 *       400:
 *         description: Invalid account info or duplicate entry
 */

import { saveBankDetails } from '../controllers/bank.controller';
import {authenticate, } from '../middleware/authMiddleware';
const router = require('express').Router();
// Route to create a virtual account
router.post('/save-bank',authenticate,saveBankDetails )

export default router;