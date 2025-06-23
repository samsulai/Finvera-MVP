import request from 'supertest';
import app from '../app'; // Your Express app
import User from '../models/User'; // Your user model
import Wallet from '../models/Wallet'; // Your wallet model

describe('🧪 Auth Routes', () => {
    const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
    };

    afterEach(async () => {
        await User.deleteMany({});
    });



    it('✅ should register a user and automatically create a wallet', async () => {
        const res = await request(app).post('/api/auth/signup').send({
            email: 'walletuser@example.com',
            password: 'Password123!',
            fullName: 'Test User',
        });

        expect(res.status).toBe(201);

        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('wallet');

        // Fetch wallet from DB
        const userId = res.body.user._id;
        const wallet = await Wallet.findOne({ user: userId });

        expect(wallet).toBeTruthy();
        expect(wallet?.balance).toBe(0);
    });
    it('should not signup already registered user', async () => {

        await request(app).post('/api/auth/signup').send(userData);


        const res = await request(app).post('/api/auth/signup').send({
            fullName : userData.fullName,
            email: userData.email,
            password: userData.password,
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should login a registered user', async () => {

        await request(app).post('/api/auth/signup').send(userData);


        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: userData.password,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {

        await request(app).post('/api/auth/signup').send(userData);


        const res = await request(app).post('/api/auth/login').send({
            email: userData.email,
            password: 'wrongpassword',
        });

        expect(res.statusCode).toBe(400);

    });
});
