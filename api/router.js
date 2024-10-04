const express = require('express');
const router = express.Router();


const recipesRoutes = require('./recipes');

router.use('/recipes', recipesRoutes);


module.exports = router;