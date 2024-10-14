const request = require('supertest');
const express = require('express');
const router = require('../../routes/nutrition');
const History = require('../../models/history');
const DailyGoal = require('../../models/dailyGoal');

jest.mock('../../models/history');
jest.mock('../../models/dailyGoal');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { _id: 'user123' };
    next();
});
app.use('/nutrition', router);

describe('Nutrition API', () => {
    describe('GET /nutrition/dailyGoal', () => {
        it('should return daily macros and goals', async () => {
            DailyGoal.findOne.mockResolvedValue({
                protein: 150,
                carbs: 200,
                fats: 70,
                calories: 2500
            });

            History.aggregate.mockResolvedValue([{
                protein: 50,
                carbs: 100,
                fats: 30,
                calories: 1200
            }]);

            const response = await request(app).get('/nutrition/dailyGoal');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                consumed: {
                    protein: 50,
                    carbs: 100,
                    fats: 30,
                    calories: 1200
                },
                goal: {
                    protein: 150,
                    carbs: 200,
                    fats: 70,
                    calories: 2500
                }
            });
        });

        it('should handle errors', async () => {
            DailyGoal.findOne.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/nutrition/dailyGoal');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        }, 10000); // Increase timeout to 10 seconds
    });

    describe('POST /nutrition/dailyGoal', () => {
        it('should update daily goal if it exists', async () => {
            DailyGoal.findOne.mockResolvedValue({
                save: jest.fn()
            });

            const response = await request(app)
                .post('/nutrition/dailyGoal')
                .send({ protein: 160, carbs: 210, fats: 75, calories: 2600 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Daily goal updated successfully' });
        });

        it('should create a new daily goal if it does not exist', async () => {
            DailyGoal.findOne.mockResolvedValue(null);
            DailyGoal.prototype.save = jest.fn().mockResolvedValue();

            const response = await request(app)
                .post('/nutrition/dailyGoal')
                .send({ protein: 160, carbs: 210, fats: 75, calories: 2600 });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Daily goal set successfully' });
        });

        it('should handle errors', async () => {
            DailyGoal.findOne.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/nutrition/dailyGoal')
                .send({ protein: 160, carbs: 210, fats: 75, calories: 2600 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        }, 10000);
    });
});
