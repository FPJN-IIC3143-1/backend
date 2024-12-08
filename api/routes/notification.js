const express = require('express');
const router = express.Router()
const Notification = require('../models/notification');


router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(limit);
    res.json(notifications);
}
);


module.exports = router;