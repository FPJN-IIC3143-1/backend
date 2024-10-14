const request = require('supertest');
const express = require('express');
const router = require('../../routes/preferences');
const Preferences = require('../../models/preferences');

// Mock the necessary modules
jest.mock('../../models/preferences');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { _id: 'user123' }; // Mock user object
    next();
});
app.use('/preferences', router);

describe('Preferences API', () => {
    describe('POST /preferences', () => {
        it('should update user preferences', async () => {
            const mockPreferences = { diet: 'vegan', intolerances: 'nuts' };
            Preferences.findOneAndUpdate.mockResolvedValue({
                user: 'user123',
                ...mockPreferences
            });

            const response = await request(app)
                .post('/preferences')
                .send(mockPreferences);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'Preferences updated successfully',
                pref: { user: 'user123', ...mockPreferences }
            });
        });

        it('should handle errors', async () => {
            Preferences.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/preferences')
                .send({ diet: 'vegan' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /preferences', () => {
        it('should return user preferences', async () => {
            const mockPreferences = { diet: 'vegetarian', intolerances: 'gluten' };
            Preferences.findOne.mockResolvedValue(mockPreferences);

            const response = await request(app).get('/preferences');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPreferences);
        });

        it('should handle errors', async () => {
            Preferences.findOne.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/preferences');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
});
