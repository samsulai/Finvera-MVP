import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

const userData = {
    email: 'walletuser@example.com',
    password: 'Password123!',
    fullName: 'Test User',
};

let token: string;

beforeAll(async () => {
    // Signup the user
    await request(app).post('/api/auth/signup').send(userData);

    // Login the user
    const res = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: userData.password,
    });

    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /api/wallet', () => {
    it('should return the wallet balance for a logged in user', async () => {
        const res = await request(app)
            .get('/api/wallet') // or `/api/wallet/balance` depending on your setup
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Wallet retrieved successfully');
        expect(typeof res.body.data.balance).toBe('number');
    });

    it('should fail without a valid token', async () => {
        const res = await request(app).get('/api/wallet');

        expect(res.statusCode).toBe(401);

    });


});
