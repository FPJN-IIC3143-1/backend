const express = require('express');
const router = express.Router();
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); 
const Transaction = require('../models/transaction');

router.post('/', async (req, res) => {

    try {
        const returnUrl = 'http://localhost:3000/payment-return';
        
        const tx = new WebpayPlus.Transaction(new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
        ));

        const transaction = await Transaction.create({
            amount: 10_000
        });

        console.log(transaction)

        const response = await tx.create(
            transaction.buyOrder,
            transaction.sessionId,
            transaction.amount,
            returnUrl
        );
            
        res.json(
            {
                redirect: response.url + "?token_ws=" + response.token
            }
            
        );

        console.log(transaction)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {

});

module.exports = router;
