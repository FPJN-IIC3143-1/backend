const express = require('express');
const router = express.Router()
const History = require('../models/history');

router.get('/', async (req, res) => {
    const history = await History.find({ user: req.user._id });
    res.json(history);
}
);

module.exports = router;
