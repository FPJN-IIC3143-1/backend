const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const mainRouter = require('./router');
const { expressjwt: jwt } = require('express-jwt');
const User = require('./models/user');


mongoose.connect('mongodb://mongo:27017/test')

// Middleware to parse JSON bodies
app.use(express.json());

// app.use(tokenMiddleware);

app.use(jwt({ secret: 'shhhhhhared-secret', algorithms: ['HS256'] }));

app.use(async (req, res, next) => {
    let user;
    console.log(req.auth);
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



