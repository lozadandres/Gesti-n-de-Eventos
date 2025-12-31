const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); 
const Usuario = mongoose.model('Usuario');

let mongoServer;

require('dotenv').config(); // Ensure env vars are loaded

beforeAll(async () => {
    // If MONGODB_URI is provided, use it strictly. Do not fallback to download.
    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000 
            });
            console.log('Connected to provided MONGODB_URI');
            return;
        } catch (err) {
            console.error('CRITICAL ERROR: Failed to connect to MONGODB_URI:', err.message);
            throw err; // Fail the test setup to show the error to user
        }
    }

    // Only use In-Memory DB if no URI is provided at all
    console.log('No MONGODB_URI found. Starting MongoMemoryServer...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}, 600000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('JWT Authentication Tests', () => {
    let testToken;
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        superUserCode: '' 
    };

    test('POST /registro should create user and return token', async () => {
        const res = await request(app)
            .post('/registro')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('usuario');
        expect(res.body.usuario.email).toBe(testUser.email);
    });

    test('POST /login should return token for valid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        testToken = res.body.token; // Save token for next tests
    });

    test('GET /items (protected) should fail without token', async () => {
        const res = await request(app)
            .get('/items');

        expect(res.statusCode).toBe(401);
    });

    test('GET /items (protected) should succeed with valid token', async () => {
        const res = await request(app)
            .get('/items')
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /login should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
    });
});

