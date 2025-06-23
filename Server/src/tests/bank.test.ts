

import request from 'supertest';
import mongoose from 'mongoose';
import nock from 'nock';
import app from '../app';
import User from '../models/User';

let token = '';
const userData = {
    fullName: 'Test User',
    email: 'testbank@example.com',
    password: 'Password123!',
};

beforeEach(async () => {
    await User.deleteMany({});

    // Mock Paystack account verification
    nock('https://api.paystack.co')
        .get(/\/bank\/resolve.*/)
        .reply(200, {
            status: true,
            data: { account_name: 'John Doe' },
        });

    // Mock Paystack transfer recipient creation
    nock('https://api.paystack.co')
        .post('/transferrecipient')
        .reply(200, {
            status: true,
            data: {
                recipient_code: 'RCP_xyz123',
                details: { bank_name: 'GTBank' },
            },
        });

    // First signup
    await request(app)
        .post('/api/auth/signup')
        .send(userData);

    // Then login
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: userData.email,
            password: userData.password,
        });

    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('🏦 Save Bank Controller', () => {
    it('✅ should save bank details successfully', async () => {
        const res = await request(app)
            .post('/api/save-bank')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountNumber: '1234567890',
                bankCode: '058',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Bank details saved successfully');
        expect(res.body.data).toHaveProperty('accountName', 'John Doe');
        expect(res.body.data).toHaveProperty('bankName', 'GTBank');
    });

    it('❌ should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/save-bank')
            .set('Authorization', `Bearer ${token}`)
            .send({
                accountNumber: '1234567890', // Missing bankCode
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('❌ should not save duplicate bank for the same user', async () => {
        const bankData = {
            accountNumber: '1234567890',
            bankCode: '058',
        };

        // Save once
        await request(app)
            .post('/api/save-bank')
            .set('Authorization', `Bearer ${token}`)
            .send(bankData);

        // Try saving again
        const res = await request(app)
            .post('/api/save-bank')
            .set('Authorization', `Bearer ${token}`)
            .send(bankData);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Bank already saved.');
    });

    it('❌ should fail if user is not authenticated', async () => {
        const res = await request(app)
            .post('/api/save-bank')
            .send({
                accountNumber: '1234567890',
                bankCode: '058',
            });

        expect(res.status).toBe(401); // Adjust if your middleware uses 403
    });
});
