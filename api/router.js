const express = require('express');
const router = express.Router();


const recipesRoutes = require('./recipes');
const preferencesRoutes = require('./preferences')

router.use('/recipes', recipesRoutes);
router.use('/preferences', preferencesRoutes)


module.exports = router;