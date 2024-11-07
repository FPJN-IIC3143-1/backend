const express = require('express');
const router = express.Router();


const recipesRoutes = require('./recipes');
const preferencesRoutes = require('./preferences')
const nutrition = require('./nutrition')
const payment = require('./payment')

router.use('/recipes', recipesRoutes);
router.use('/preferences', preferencesRoutes)
router.use('/nutrition', nutrition)
router.use('/payment', payment)


module.exports = router;