const express = require('express');
const router = express.Router();
const Preferences = require('../models/preferences');


router.post('/', async (req, res) => {
    try {
        const preferences = req.body;
        const pref = await Preferences.findOneAndUpdate(
            { user: req.user._id },
            { ...preferences },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Preferences updated successfully', pref });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const pref = await Preferences.findOne({user: req.user._id});
        res.json(pref);
    } catch (error) {
        req.status(500).json({error: error.message});
    }  
}
)

module.exports = router;