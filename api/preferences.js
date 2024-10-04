const express = require('express');
const router = express.Router();
const Preferences = require('./models/preferences');


router.post('/preferences', (req, res) => {
    const { preferences } = req.body;

    Preferences.create(
    { 
        ...preferences, user: 0
    },
    (err, preferences) => {
        if (err)
            return res.status(400).json({ error: 'Bad request' });
        res.json({ preferences });
    });
});


module.exports = router;