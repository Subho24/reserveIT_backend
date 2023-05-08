const express = require('express');
const dbHandler = require('../dbHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
require('dotenv').config();


router.use(express.json());


router.post('/', async (req, res) => {
    try {
        const userName = req.body.userName;
        const plainPwd = req.body.userPass;

        const db = await dbHandler.createConnectionAsync();
        console.log(await dbHandler.connectAsync(db));
        const query = `Select user_name, user_password, company_id from users where user_name = "${userName}"`;

        const data = await dbHandler.queryAsync(db, query);
        console.log(data[0]);

        bcrypt.compare(plainPwd, data[0].user_password, async (err, match) => {
            if(err) res.status(500).json({message: 'Internal serfver error'});

            if(data[0].user_name === userName && match) {
                const payload = {
                    user: userName,
                    companyId: data[0].company_id
                }
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '12h'})
                const refToken = jwt.sign(payload, process.env.REF_TOKEN_SECRET, {expiresIn: '12h'})

                res.cookie('jwt', refToken, {
                    httpOnly: true,
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                });
                res.json({
                    token: accessToken,
                })
                console.log(await dbHandler.disconnectAsync(db));
            } else {
                console.log(await dbHandler.disconnectAsync(db));
                res.status(403).json({message: 'Forbidden'})
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'})
    }
})

module.exports = router;
