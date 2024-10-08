const express = require('express');
const router = express.Router();


const getUserIdFromToken = (token) => {
    const userIds = ["4a624254-56c3-4bde-beb1-1619e62c0d9d", "1397f05c-d48f-4040-a571-977abd24599b",
        "ce331eef-c272-4fae-bcfd-9ab29532135f", "c8971aaf-c7da-486a-ac43-f320c7c94aef"]

    return userIds[Math.floor(Math.random() * userIds.length)];
};

const isTokenSignatureValid = (token) => {
    return true;
};


const tokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!isTokenSignatureValid(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = getUserIdFromToken(token);

    next();
};

module.exports = tokenMiddleware;