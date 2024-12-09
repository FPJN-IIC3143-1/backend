const mongoose = require('mongoose');
const DailyGoal = require('../../models/dailyGoal');
const User = require('../../models/user');

describe('DailyGoal Model', () => {
    let testUser;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL);
        testUser = await User.create({ email: 'test@example.com' });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await DailyGoal.deleteMany({});
    });

    it('should create a daily goal successfully', async () => {
        const validDailyGoal = {
            user: testUser._id,
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        };
        const dailyGoal = await DailyGoal.create(validDailyGoal);
        
        expect(dailyGoal.user.toString()).toBe(testUser._id.toString());
        expect(dailyGoal.protein).toBe(validDailyGoal.protein);
        expect(dailyGoal.carbs).toBe(validDailyGoal.carbs);
        expect(dailyGoal.fats).toBe(validDailyGoal.fats);
        expect(dailyGoal.calories).toBe(validDailyGoal.calories);
        expect(dailyGoal._id).toBeDefined();
        expect(dailyGoal.createdAt).toBeDefined();
        expect(dailyGoal.updatedAt).toBeDefined();
    });

    it('should create a daily goal without user reference', async () => {
        const goalWithoutUser = {
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        };
        const dailyGoal = await DailyGoal.create(goalWithoutUser);
        
        expect(dailyGoal.user).toBeUndefined();
        expect(dailyGoal.protein).toBe(goalWithoutUser.protein);
        expect(dailyGoal.carbs).toBe(goalWithoutUser.carbs);
        expect(dailyGoal.fats).toBe(goalWithoutUser.fats);
        expect(dailyGoal.calories).toBe(goalWithoutUser.calories);
    });

    it('should create a daily goal with partial macros', async () => {
        const partialGoal = {
            user: testUser._id,
            protein: 150,
            calories: 2000
        };
        const dailyGoal = await DailyGoal.create(partialGoal);
        
        expect(dailyGoal.user.toString()).toBe(testUser._id.toString());
        expect(dailyGoal.protein).toBe(partialGoal.protein);
        expect(dailyGoal.calories).toBe(partialGoal.calories);
        expect(dailyGoal.carbs).toBeUndefined();
        expect(dailyGoal.fats).toBeUndefined();
    });

    it('should find daily goals by user', async () => {
        const goalData = {
            user: testUser._id,
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        };
        await DailyGoal.create(goalData);
        
        const foundGoal = await DailyGoal.findOne({ user: testUser._id });
        expect(foundGoal).toBeDefined();
        expect(foundGoal.protein).toBe(goalData.protein);
        expect(foundGoal.carbs).toBe(goalData.carbs);
        expect(foundGoal.fats).toBe(goalData.fats);
        expect(foundGoal.calories).toBe(goalData.calories);
    });

    it('should update a daily goal', async () => {
        const dailyGoal = await DailyGoal.create({
            user: testUser._id,
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        });

        const updates = {
            protein: 160,
            carbs: 220,
            fats: 75,
            calories: 2200
        };

        await DailyGoal.updateOne({ _id: dailyGoal._id }, updates);
        const updatedGoal = await DailyGoal.findById(dailyGoal._id);
        
        expect(updatedGoal.protein).toBe(updates.protein);
        expect(updatedGoal.carbs).toBe(updates.carbs);
        expect(updatedGoal.fats).toBe(updates.fats);
        expect(updatedGoal.calories).toBe(updates.calories);
        expect(updatedGoal.updatedAt).not.toEqual(dailyGoal.updatedAt);
    });

    it('should delete a daily goal', async () => {
        const dailyGoal = await DailyGoal.create({
            user: testUser._id,
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        });

        await DailyGoal.deleteOne({ _id: dailyGoal._id });
        const deletedGoal = await DailyGoal.findById(dailyGoal._id);
        expect(deletedGoal).toBeNull();
    });

    it('should populate user reference', async () => {
        const dailyGoal = await DailyGoal.create({
            user: testUser._id,
            protein: 150,
            carbs: 200,
            fats: 70,
            calories: 2000
        });

        const populatedGoal = await DailyGoal.findById(dailyGoal._id).populate('user');
        expect(populatedGoal.user).toBeDefined();
        expect(populatedGoal.user.email).toBe(testUser.email);
    });
}); 
