const express = require('express');
const dbHandler = require('../dbHandler');
const mailTmp = require('../emails');
const nodemailer = require('nodemailer');
const generator = require('generate-password');

const router = express.Router();
require('dotenv').config();


router.use(express.json());

const transporter = nodemailer.createTransport({
    host: 'smtp.simply.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.Email,
        pass: process.env.Pass,
    },
});


router.post('/createAccount', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const password = generator.generate({
            length: 10,
            numbers: true
        })

        const hash = await dbHandler.hashPass(password, 10)
        let {query, id} = await dbHandler.createUUIDPostQuery(req.body.companyInfo, 'companies');
        console.log(query)
        console.log(await dbHandler.connectAsync(db))
        let data = await dbHandler.queryAsync(db, query);
        data = await dbHandler.queryAsync(db, `Insert Into users (user_name, user_password, company_id, user_created) Value ("${req.body.companyInfo.company_email}", "${hash}", "${id}", CURDATE() )`)
        const email = mailTmp.accountRegistered(req.body.companyInfo.company_email, password, req.body.companyInfo.company_name)
        transporter.sendMail(email);

        res.status(200).json(data);
        console.log(await dbHandler.disconnectAsync(db));

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            "message": 'Internal Server Error!!'
        })
        console.log(await dbHandler.disconnectAsync(db));
    }
})



module.exports = router;