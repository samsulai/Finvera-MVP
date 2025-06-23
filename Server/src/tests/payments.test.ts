import request from 'supertest';
import app from '../app';
import User from '../models/User';
import Wallet from '../models/Wallet';

describe('🧪 Payments Route', () => {
    let token: string = '';
    const userData = {
        fullName: 'Test Payment User',
        email: 'payuser@example.com',
        password: 'Password123!',
    };

    beforeEach(async () => {
        await User.deleteMany({});
        await Wallet.deleteMany({});

        await request(app).post('/api/auth/signup').send(userData);


        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: userData.password,
        });

        token = res.body.token;
    });

    it('✅ should initialize a payment successfully', async () => {
        const res = await request(app)
            .post('/api/initialize-transaction')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 5000,
                email: userData.email,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('authorization_url');
        expect(res.body).toHaveProperty('reference');
    });

    it('❌ should fail to initialize payment without amount', async () => {
        const res = await request(app)
            .post('/api/initialize-transaction')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: userData.email,
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });
});
