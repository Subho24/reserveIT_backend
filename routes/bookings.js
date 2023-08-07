const express = require('express');
const dbHandler = require('../dbHandler');
const verifyJWT = require('../middleware/verifyJwt');
const nodemailer = require('nodemailer')
const mailTmp = require('../emails');

const router = express.Router();
require('dotenv').config();


let transporter = nodemailer.createTransport({
    host: 'smtp.simply.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.Email,
        pass: process.env.Pass,
    },
    dkim: {
        domainName: "reserveit.se",
        keySelector: "key001",
        privateKey: "-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQDIf5KAzeiCS11zwFFOXsaQ0Ikz5//juYtb9tHv7Q005fiG6skvQ/Ff5J+l+j5d2p7skfizsvgX3bKbXSoeYg5PNIOF/c+e8O/isXXcx2jyueVvEHskhF4GTKYv7dmZc0kXjqRLrKOmGOQf0Fd4eekF0Rs+IGOBx3uM/lAV5l+cGQIDAQABAoGAI/+710KhR5uuiNT0BEVCE8hNijNSn5m16uozIYgHggL0j4ziWIkzcotDGvMGdaWGOWWwKNuubeKRahHdOR1UAhVJNGM1wxY2eT7D7U6enkeF30VGiDuk6Gd72dF16GOanpAdADw0IrTCmHbCdnnRUvxlVz2aNVDBW/+9aQw84LECQQDjv3aY7bDxSnqCiPmNykdeIOveQ4YQ6t5duWhEFNVJg63HxgQMIU6JqNzKK74NOEpvvNBAEeMS/eAKQeBt2O4dAkEA4V7ALB5Wxl9uNFa6T/bvRuD5N8qAtP8yXhdfAt1JzDMO/vE+RH74yy8NTSlUeJLHTv/5Pq9/cVwXDdPBegz1LQJBAJ7H7qxiEtm23kDBtJLJMwaKF0fHdeG3jb50NCA7EhSFzJOaF1pJolLROtVst7zJwQOz9NCmZ9Tm0Nr14L1U33UCQQCMJVG3nb40ac+sOGpvo400NF6F9SWIaFG39SyeKWHk27NtkjM4gQTRxRaubw8aU5whYkhqVNQZeDzV2mKsNTaZAkAN3J1e5yG7QuAoNWafcnuXrgT1nj2O9TmAO7RVSh3kiQImk/t+qh+Ndm73H0r37ITnyR4aZZQiSOtVgrWWkKQX-----END RSA PRIVATE KEY-----"
    }
})

router.use(express.json());



// Get all data from bookings table http://localhost:4000/api/bookings
router.get('/:company_id', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    if(req.body.companyId !== req.params.company_id) {
        return res.status(403).json({message: 'Not authorized'});
    }

    try {
        const query = req.query.custom ? `Select * from bookings Where company_id = '${req.params.company_id}' and ${req.query.custom} = ${req.query.for} Order by booking_date, booking_time` 
        : `Select * from bookings Where company_id = '${req.params.company_id}'`;
        console.log(await dbHandler.connectAsync(db))
        console.log(query);
        const data = await dbHandler.queryAsync(db, query);
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

//Post data to bookings table http://localhost:4000/api/bookings
router.post('/', async (req, res) => {
    // const db = await dbHandler.createConnectionAsync();

    try {
        const info = req.body;
        // const query = await dbHandler.createPostQuery(req.body, 'bookings');
        // console.log(await dbHandler.connectAsync(db))
        // const data = await dbHandler.queryAsync(db, query);
        const email = mailTmp.reservationConfirmed(info.customer_email, info.customer_name, info.number_of_people, info.booking_date, info.booking_time,info.company_name);
        
        transporter.sendMail(email, (err, info) => {
            if(err) throw err;
            console.log(info)
            res.status(200).json({data: 'data'});
        })
        
        // console.log(await dbHandler.disconnectAsync(db));
    } catch (error) {
        console.log(error.message)
        console.log(error)
        res.status(500).json({
            "message": 'Internal Server Error!!'
        })
        console.log(await dbHandler.disconnectAsync(db));
    }
})

//Update data in bookings table http://localhost:4000/api/bookings
router.patch('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createUpdateQuery(req.body.data, 'bookings', 'company_id', req.params.company_id, 'booking_id', req.query.booking_id);
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
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


router.delete('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `DELETE FROM bookings WHERE company_id = '${req.params.company_id}' AND booking_id = '${req.query.booking_id}'`;
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
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