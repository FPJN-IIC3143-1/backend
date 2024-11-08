const express = require('express');
const router = express.Router();
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); 
const Transaction = require('../models/transaction');


function getStatusOfTransaction(token_ws){
    const tx = new WebpayPlus.Transaction(new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
    ));

    return tx.status(token_ws);
}

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

router.get('/status', async (req, res) => {
    const { token_ws } = req.query;
    try {
        const response = await getStatusOfTransaction(token_ws);
        const transaction = await Transaction.findOne({ buyOrder: response.buy_order });
        transaction.status = response.status;
        await transaction.save();

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    

});

module.exports = router;
