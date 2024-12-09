const mongoose = require('mongoose');
const User = require('../../models/user');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create a new user successfully', async () => {
        const validUser = {
            email: 'test@example.com',
        };
        const user = await User.create(validUser);
        expect(user.email).toBe(validUser.email);
        expect(user._id).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    });

    it('should fail to create a user without email', async () => {
        const userWithoutEmail = {};
        let err;
        try {
            await User.create(userWithoutEmail);
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.email).toBeDefined();
    });

    it('should fail to create a user with duplicate email', async () => {
        const email = 'duplicate@example.com';
        await User.create({ email });
        
        let err;
        try {
            await User.create({ email });
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.code).toBe(11000); // MongoDB duplicate key error code
    });

    it('should find a user by email', async () => {
        const userData = { email: 'find@example.com' };
        await User.create(userData);
        
        const foundUser = await User.findOne({ email: userData.email });
        expect(foundUser).toBeDefined();
        expect(foundUser.email).toBe(userData.email);
    });

    it('should update a user', async () => {
        const user = await User.create({ email: 'old@example.com' });
        const newEmail = 'new@example.com';
        
        await User.updateOne({ _id: user._id }, { email: newEmail });
        const updatedUser = await User.findById(user._id);
        
        expect(updatedUser.email).toBe(newEmail);
    });

    it('should delete a user', async () => {
        const user = await User.create({ email: 'delete@example.com' });
        await User.deleteOne({ _id: user._id });
        
        const deletedUser = await User.findById(user._id);
        expect(deletedUser).toBeNull();
    });
}); 
