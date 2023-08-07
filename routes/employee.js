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



// Get all employees registered for a particular company http://localhost:4000/api/employee
router.get('/all/:company_id', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const { company_id } = req.params;
        const query = `SELECT * FROM employees WHERE company_id = '${company_id}'`
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

// Get all data for a specific employee http://localhost:4000/api/employee
router.get('/:personnummer', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const { personnummer } = req.params;
        const query = `SELECT * FROM employee WHERE employee_personnummer = ${personnummer}`
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

//Post data to employee table http://localhost:4000/api/employee
router.post('/', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createPostQuery(req.body, 'employees');
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
        // const email = mailTmp.reservationConfirmed(info.customer_email, info.customer_name, info.number_of_people, info.booking_date, info.booking_time,info.company_name);

        // transporter.verify((err, succ) => {
        //     if(err) throw err
        //     transporter.sendMail(email, (err) => {
        //         if(err) throw err;
        //         res.status(200).json(data);
        //     })
        // })
        res.status(200).json(data)
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

//Update data in employee table http://localhost:4000/api/employee
router.patch('/:personnummer', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createUpdateQuery(req.body.data, 'employees', 'employee_personnummer', req.params.personnummer);
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


router.delete('/:personnummer', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `DELETE FROM employees WHERE employee_personnummer = '${req.params.personnummer}'`;
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