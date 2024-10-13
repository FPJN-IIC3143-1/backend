const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const mainRouter = require('./routes/router');
const { expressjwt: jwt } = require('express-jwt');
const User = require('./models/user');


const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/test';
mongoose.connect(MONGO_URI);


// Middleware to parse JSON bodies
app.use(express.json());

// app.use(tokenMiddleware);

app.use(jwt({ secret: '-KJGzSyN_xPJFu058EIb-fTvEkFCna1QLdbERahXMMxKRJprkB4ig31ZL8klEWJl', algorithms: ['HS256'] }));

app.use(async (req, res, next) => {
    let user;
    if (req.auth.email) {
        user = await User.findOne({ email: req.auth.email });
        if (!user)
            user = await User.create({ email: req.auth.email });

        req.user = user;
        }
    else
        return res.status(401).json({ error: 'Every request requires email' });
    
    next();

    })  



// Basic route
app.get('/', (req, res) => {
    res.send('Hello Worlds!');
});

app.use('/', mainRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



