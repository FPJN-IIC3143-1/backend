const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const mainRouter = require('./router');
const tokenMiddleware = require('./auth');
const { expressjwt: jwt } = require('express-jwt');


mongoose.connect('mongodb://mongo:27017/test')

// Middleware to parse JSON bodies
app.use(express.json());

// app.use(tokenMiddleware);

app.use(jwt({ secret: 'a', algorithms: ['HS256'] }));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello Worlds!');
});

app.use('/', mainRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



