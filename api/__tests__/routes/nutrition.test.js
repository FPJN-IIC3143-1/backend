const request = require('supertest');
const express = require('express');
const { nutritionRoutes, getDailyMacros } = require('../../routes/nutrition');
const History = require('../../models/history');
const DailyGoal = require('../../models/dailyGoal');

jest.mock('../../models/history');
jest.mock('../../models/dailyGoal');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { _id: 'testUserId' };
    next();
});
app.use('/nutrition', nutritionRoutes);

describe('Nutrition Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /nutrition/dailyGoal', () => {
        it('should return daily macros when data exists', async () => {
            const mockDailyGoal = {
                protein: 150,
                carbs: 200,
                fats: 70,
                calories: 2000
            };

            const mockConsumed = [{
                _id: null,
                protein: 100,
                carbs: 150,
                fats: 50,
                calories: 1500
            }];

            DailyGoal.findOne.mockResolvedValue(mockDailyGoal);
            History.aggregate.mockResolvedValue(mockConsumed);

            const response = await request(app).get('/nutrition/dailyGoal');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                consumed: {
                    protein: 100,
                    carbs: 150,
                    fats: 50,
                    calories: 1500
                },
                goal: mockDailyGoal
            });
        });

        it('should handle case when no consumption data exists', async () => {
            const mockDailyGoal = {
                protein: 150,
                carbs: 200,
                fats: 70,
                calories: 2000
            };

            DailyGoal.findOne.mockResolvedValue(mockDailyGoal);
            History.aggregate.mockResolvedValue([]);

            const response = await request(app).get('/nutrition/dailyGoal');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                consumed: {
                    protein: 0,
                    carbs: 0,
                    fats: 0,
                    calories: 0
                },
                goal: mockDailyGoal
            });
        });

        it('should handle case when no daily goal exists', async () => {
            DailyGoal.findOne.mockResolvedValue(null);
            History.aggregate.mockResolvedValue([]);

            const response = await request(app).get('/nutrition/dailyGoal');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                consumed: {
                    protein: 0,
                    carbs: 0,
                    fats: 0,
                    calories: 0
                },
                goal: {
                    protein: 0,
                    carbs: 0,
                    fats: 0,
                    calories: 0
                }
            });
        });

        it('should handle errors', async () => {
            DailyGoal.findOne.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/nutrition/dailyGoal');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /nutrition/dailyGoal', () => {
        const mockGoalData = {
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        };

        it('should update existing daily goal', async () => {
            const mockExistingGoal = {
                ...mockGoalData,
                save: jest.fn().mockResolvedValue(undefined)
            };

            DailyGoal.findOne.mockResolvedValue(mockExistingGoal);

            const response = await request(app)
                .post('/nutrition/dailyGoal')
                .send(mockGoalData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Daily goal updated successfully' });
            expect(mockExistingGoal.save).toHaveBeenCalled();
        });

        it('should create new daily goal when none exists', async () => {
            DailyGoal.findOne.mockResolvedValue(null);
            const mockSave = jest.fn().mockResolvedValue(undefined);
            DailyGoal.mockImplementation(() => ({
                save: mockSave
            }));

            const response = await request(app)
                .post('/nutrition/dailyGoal')
                .send(mockGoalData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Daily goal set successfully' });
            expect(mockSave).toHaveBeenCalled();
        });

        it('should handle validation errors', async () => {
            DailyGoal.findOne.mockRejectedValue(new Error('Validation error'));

            const response = await request(app)
                .post('/nutrition/dailyGoal')
                .send(mockGoalData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });
});
