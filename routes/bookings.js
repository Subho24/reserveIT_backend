const express = require('express');
const dbHandler = require('../dbHandler');
const verifyJWT = require('../middleware/verifyJwt');
const nodemailer = require('nodemailer')
const mailTmp = require('../emails');

const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.simply.com',
    pool: true,
    port: 587,
    secure: false,
    auth: {
        user: process.env.Email,
        pass: process.env.Pass,
    },
});

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
    const db = await dbHandler.createConnectionAsync();

    try {
        const info = req.body;
        const query = await dbHandler.createPostQuery(req.body, 'bookings');
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
        const email = mailTmp.reservationConfirmed(info.customer_email, info.customer_name, info.number_of_people, info.booking_date, info.booking_time,info.company_name);

        transporter.verify((err, succ) => {
            if(err) throw err
            transporter.sendMail(email, (err) => {
                if(err) throw err;
                res.status(200).json(data);
            })
        })
        console.log(await dbHandler.disconnectAsync(db));
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
        const query = await dbHandler.createUpdateQuery(req.body, 'bookings', 'company_id', req.params.company_id);
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
        const query = `DELETE FROM bookings WHERE company_id = '${req.params.company_id}'`;
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
        await dbHandler.queryAsync(db, `ALTER TABLE companies AUTO_INCREMENT='${req.params.company_id}'`)
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