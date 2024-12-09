const mongoose = require('mongoose');
const Notification = require('../../models/notification');
const User = require('../../models/user');

describe('Notification Model', () => {
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
        await Notification.deleteMany({});
    });

    it('should create a notification successfully', async () => {
        const validNotification = {
            user: testUser._id,
            message: 'Test notification message'
        };
        const notification = await Notification.create(validNotification);
        
        expect(notification.user.toString()).toBe(testUser._id.toString());
        expect(notification.message).toBe(validNotification.message);
        expect(notification.createdAt).toBeDefined();
        expect(notification.updatedAt).toBeDefined();
    });

    it('should create a notification without user reference', async () => {
        const notificationWithoutUser = {
            message: 'Test notification without user'
        };
        const notification = await Notification.create(notificationWithoutUser);
        
        expect(notification.user).toBeUndefined();
        expect(notification.message).toBe(notificationWithoutUser.message);
    });

    it('should find notifications by user', async () => {
        const notification1 = await Notification.create({
            user: testUser._id,
            message: 'First notification'
        });
        const notification2 = await Notification.create({
            user: testUser._id,
            message: 'Second notification'
        });

        const userNotifications = await Notification.find({ user: testUser._id });
        expect(userNotifications).toHaveLength(2);
        expect(userNotifications[0].message).toBe(notification1.message);
        expect(userNotifications[1].message).toBe(notification2.message);
    });

    it('should update a notification', async () => {
        const notification = await Notification.create({
            user: testUser._id,
            message: 'Original message'
        });

        const updatedMessage = 'Updated message';
        await Notification.updateOne(
            { _id: notification._id },
            { message: updatedMessage }
        );

        const updatedNotification = await Notification.findById(notification._id);
        expect(updatedNotification.message).toBe(updatedMessage);
        expect(updatedNotification.updatedAt).not.toEqual(notification.updatedAt);
    });

    it('should delete a notification', async () => {
        const notification = await Notification.create({
            user: testUser._id,
            message: 'To be deleted'
        });

        await Notification.deleteOne({ _id: notification._id });
        const deletedNotification = await Notification.findById(notification._id);
        expect(deletedNotification).toBeNull();
    });

    it('should populate user reference', async () => {
        const notification = await Notification.create({
            user: testUser._id,
            message: 'Test notification'
        });

        const populatedNotification = await Notification.findById(notification._id).populate('user');
        expect(populatedNotification.user).toBeDefined();
        expect(populatedNotification.user.email).toBe(testUser.email);
    });
}); 
