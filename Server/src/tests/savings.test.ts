import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';
import Wallet from '../models/Wallet';
import SavingsPlan from '../models/savingsPlan';

let token = '';
let userId = '';

beforeEach(async () => {
    // Clear previous data
    await User.deleteMany({});
    await Wallet.deleteMany({});
    await SavingsPlan.deleteMany({});

    const userData = {
        fullName: 'Savings Tester',
        email: `savings_${Date.now()}@example.com`,
        password: 'Password123!',
    };

    // Signup
    await request(app).post('/api/auth/signup').send(userData);

    // Login
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password });

    token = loginRes.body.token;

    const user = await User.findOne({ email: userData.email });
    userId = user?._id.toString() || '';

    // 💰 Make sure wallet exists with balance
    await Wallet.updateOne(
        { user: userId },
        { $set: { balance: 10000 } },
        { upsert: true } // will create it if missing
    );
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('💰 Savings Plan Controller', () => {
    it('✅ should create a savings plan when wallet has enough balance', async () => {
        const res = await request(app)
            .post('/api/create-savings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 3000,
                type: 'fixed',
                durationInDays: 30,
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Savings plan created');
        expect(res.body.savings).toHaveProperty('amount', 3000);

        const wallet = await Wallet.findOne({ user: userId });
        expect(wallet?.balance).toBe(7000); // 10000 - 3000
    });

    it('❌ should not create savings plan if wallet is missing or balance is low', async () => {
        await Wallet.updateOne({ user: userId }, { $set: { balance: 100 } });

        const res = await request(app)
            .post('/api/create-savings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 500,
                type: 'fixed',
                durationInDays: 10,
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Insufficient wallet balance');
    });

    it('❌ should not create plan without auth token', async () => {
        const res = await request(app)
            .post('/api/create-savings')
            .send({
                amount: 1000,
                type: 'fixed',
                durationInDays: 15,
            });

        expect(res.status).toBe(401); // assuming your middleware returns 401
    });

    it('✅ should retrieve user’s savings plans', async () => {
        // Create one plan
        await request(app)
            .post('/api/create-savings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1000,
                type: 'fixed',
                durationInDays: 20,
            });

        // Fetch all
        const res = await request(app)
            .get('/api/get-savings-plans')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.savingsPlans)).toBe(true);
        expect(res.body.savingsPlans.length).toBeGreaterThanOrEqual(1);
    });
});
