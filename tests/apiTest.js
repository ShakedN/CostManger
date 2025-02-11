
const request = require('supertest');
const app = require('../app'); // יש לוודא שזה הנתיב הנכון לשרת שלך

describe('API Tests', () => {
    // בדיקת קבלת פרטי מפתחים
    test('GET /api/about should return team members', async () => {
        const response = await request(app).get('/api/about');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('first_name');
        expect(response.body[0]).toHaveProperty('last_name');
    });

    // בדיקת הוספת עלות חדשה
    test('POST /api/add should add a new cost item', async () => {
        const newCost = {
            description: 'Coffee',
            category: 'food',
            userid: '123123',
            sum: 15
        };

        const response = await request(app).post('/api/add').send(newCost);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.description).toBe('Coffee');
    });

    // בדיקת קבלת דוח לפי חודש
    test('GET /api/report should return costs grouped by category', async () => {
        const response = await request(app).get('/api/report?id=123123&year=2025&month=1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('food');
        expect(response.body.food).toBeInstanceOf(Array);
    });

    // בדיקת קבלת פרטי משתמש
    test('GET /api/users/:id should return user details and total costs', async () => {
        const response = await request(app).get('/api/users/123123');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('last_name');
        expect(response.body).toHaveProperty('total');
    });
});
