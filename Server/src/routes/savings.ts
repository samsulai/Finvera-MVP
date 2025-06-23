/**
 * @swagger
 * /savings:
 *   post:
 *     summary: Create a new savings plan
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, durationInDays]
 *             properties:
 *               amount:
 *                 type: number
 *               durationInDays:
 *                 type: number
 *     responses:
 *       201:
 *         description: Savings plan created
 *       400:
 *         description: Validation error or insufficient balance
 */

/**
 * @swagger
 * /savings:
 *   get:
 *     summary: Get all savings plans for user
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Savings plans retrieved
 */

/**
 * @swagger
 * /savings/{id}:
 *   get:
 *     summary: Get details of a specific savings plan
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Savings plan ID
 *     responses:
 *       200:
 *         description: Savings plan details
 *       404:
 *         description: Plan not found
 */

import express from "express";
import { createSavingsPlan , getUserSavingsPlans} from '../controllers/savings.controller';
import {authenticate, } from '../middleware/authMiddleware';
const router = require('express').Router();

router.post('/create-savings',authenticate,createSavingsPlan )
router.get('/get-savings-plans',authenticate,getUserSavingsPlans )

export default router;