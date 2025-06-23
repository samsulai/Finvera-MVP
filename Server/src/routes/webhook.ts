/**
 * @swagger
 * /webhook/paystack:
 *   post:
 *     summary: Handle Paystack webhook event
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook handled
 *       400:
 *         description: Invalid webhook data
 */

import express from "express";
import bodyParser from "body-parser";
import { handlePaystackWebhook } from "../controllers/webhook.controller";

const router = express.Router();

router.post("/paystack", bodyParser.raw({ type: 'application/json' }), handlePaystackWebhook);

export default router;
