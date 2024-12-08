const express = require('express');
const router = express.Router()
const History = require('../models/history');

router.get('/export', async (req, res) => {
    const history = await History.find({ user: req.user._id });
    res.json(history);
}
);

router.post('/import', async (req, res) => {
    // override all history with the new one
    const {history} = req.body;
    if (!history) 
        return res.status(400).json({ error: 'Missing history' });
    
    try {
        await History.deleteMany({ user: req.user._id });
        await History.insertMany(history.map(h => ({...h, user: req.user._id})));
        res.json(history);
    } catch (e) {
        res.status(400).json({ error: e });
    }
}
);

module.exports = router;
