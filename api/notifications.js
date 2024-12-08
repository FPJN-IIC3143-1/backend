const Notification = require('./models/notification');
const User = require('./models/user');
const { getDailyMacros } = require('./routes/nutrition');


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateMessage(calories, protein, carbs, fats) {
    const messages = [
        `You have ${calories} calories, ${protein}g of protein, ${carbs}g of carbs and ${fats}g of fats left for today.`,
        `Today's remaining macros: ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats.`,
        `Keep going! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left for today.`,
        `Don't give up! You still have ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats to consume today.`,
        `Stay on track! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats remaining for today.`,
        `Push through! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `Almost there! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats to go.`,
        `Keep pushing! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `You're doing great! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats remaining.`,
        `Stay focused! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `Keep it up! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats to go.`,
        `You're almost there! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `Stay motivated! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats remaining.`,
        `Keep striving! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `You're on track! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats to go.`,
        `Keep moving forward! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `Stay strong! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats remaining.`,
        `You're doing awesome! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`,
        `Keep the momentum! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats to go.`,
        `Stay determined! ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fats}g fats left.`
    ];
    const randomIndex = getRandomInt(messages.length);
    return messages[randomIndex];
}

async function sendRemainingMacrosNotification(userId) {
    const dailyMacros = await getDailyMacros(userId);
    const remainingMacros = {
        protein: Math.max(0, dailyMacros.goal.protein - dailyMacros.consumed.protein),
        carbs: Math.max(0, dailyMacros.goal.carbs - dailyMacros.consumed.carbs),
        fats: Math.max(0, dailyMacros.goal.fats - dailyMacros.consumed.fats),
        calories: Math.max(0, dailyMacros.goal.calories - dailyMacros.consumed.calories)
    };

    const msg = generateMessage(remainingMacros.calories, remainingMacros.protein, remainingMacros.carbs, remainingMacros.fats);

    const notification = new Notification({
        user: userId,
        message: msg
    });

    await notification.save();
};

async function sendRemainingMacrosNotificationToAllUsers() {
    const users = await User.find();
    for (const user of users) {
        await sendRemainingMacrosNotification(user._id);
    }
}


module.exports = { sendRemainingMacrosNotificationToAllUsers };