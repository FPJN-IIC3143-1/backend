const express = require('express');
const router = express.Router();


const recipesRoutes = require('./recipes');
const preferencesRoutes = require('./preferences')
const { nutritionRoutes } = require('./nutrition')
const pantryRoutes = require('./pantry')
const paymentRoutes = require('./payment')


router.use('/recipes', recipesRoutes);
router.use('/preferences', preferencesRoutes)
router.use('/nutrition', nutritionRoutes)
router.use('/pantry', pantryRoutes)
router.use('/payment', paymentRoutes)


module.exports = router;