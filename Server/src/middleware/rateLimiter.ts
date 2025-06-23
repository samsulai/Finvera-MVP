import rateLimit from 'express-rate-limit';



import { Request, Response, NextFunction } from 'express';

export const generalLimiter =
    process.env.NODE_ENV === 'test'
        ? (req: Request, res: Response, next: NextFunction) => next()
        : rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per window
            message: 'Too many requests, please try again later.',
        });


export const authLimiter =
    process.env.NODE_ENV === 'test'
        ? (req: Request, res: Response, next: NextFunction) => next()
        : rateLimit({
            windowMs: 5 * 60 * 1000, // 5 minutes
            max: 5, // Only 5 login attempts per 5 mins
            message: 'Too many login attempts. Please try again later.',
        });

export const withdrawLimiter =
    process.env.NODE_ENV === 'test'
        ? (req: Request, res: Response, next: NextFunction) => next()
        : rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            max: 3,
            message: 'Withdrawal rate limit exceeded. Try again later.',
        });