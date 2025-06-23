/**
 * @swagger
 * /payments/initialize:
 *   post:
 *     summary: Initialize wallet funding
 *     tags: [Payments]
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
 *         description: Payment initialized
 *       400:
 *         description: Invalid request
 */

import { initializeTransaction } from '../controllers/payment.controller';
const router = require('express').Router();
// Route to create a virtual account
router.post('/initialize-transaction',initializeTransaction )

export default router;