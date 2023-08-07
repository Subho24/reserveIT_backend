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


// Get all data for a specific employee http://localhost:4000/api/employee_punches
router.get('/all/:personnummer', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const { personnummer } = req.params;
        console.log(await dbHandler.connectAsync(db))
        const query = `SELECT * FROM employees WHERE employee_personnummer = '${personnummer}'`
        const data = await dbHandler.queryAsync(db, query);
        if(data.length <= 0) {
            res.status(404).json({"message": "Employee not found"})
            console.log(await dbHandler.disconnectAsync(db));
            return
        }
        const query2 = `SELECT * FROM employee_punches WHERE employee_personnummer = '${personnummer}'`
        console.log(query2);
        const data2 = await dbHandler.queryAsync(db, query2);
        res.status(200).json(data2);
        console.log(await dbHandler.disconnectAsync(db));
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            "message": 'Internal Server Error!!'
        })
        console.log(await dbHandler.disconnectAsync(db));
    }
})


// Get all data for a specific company http://localhost:4000/api/employee_punches/all/:company_id
router.get('/all/company/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const { company_id } = req.params;
        console.log(await dbHandler.connectAsync(db))
        const query = `SELECT * FROM employee_punches;`
        const data = await dbHandler.queryAsync(db, query);
        console.log(data)
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


router.get('/:personnummer', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const { personnummer } = req.params;
        console.log(await dbHandler.connectAsync(db))
        const query = `SELECT * FROM employees WHERE employee_personnummer = '${personnummer}'`
        const data = await dbHandler.queryAsync(db, query);
        console.log(data)
        if(data.length <= 0) {
            res.status(404).json({"message": "Employee not found"})
            console.log(await dbHandler.disconnectAsync(db));
            return
        }
        const query2 = `SELECT * FROM employee_punches WHERE employee_personnummer = "${personnummer}"`
        console.log(query2);
        const data2 = await dbHandler.queryAsync(db, query2);
        for(let i = 0; i < data2.length; i++) {
            console.log(data[0].employee_fullname, 'name')
            data2[i].employee_fullname = data[0].employee_fullname
        }
        console.log(data2)
        if(data2.length <= 0) {
            console.log(data[0].employee_fullname)
            res.status(200).json([{
                "employee_fullname": data[0].employee_fullname
            }]);
            console.log(await dbHandler.disconnectAsync(db));   
            return         
        }
        res.status(200).json(data2);
        console.log(await dbHandler.disconnectAsync(db));
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            "message": 'Internal Server Error!!'
        })
        console.log(await dbHandler.disconnectAsync(db));
    }
})

//Post data to employee_punches table http://localhost:4000/api/employee_punches
router.post('/clockIn', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        // const query = `INSERT INTO employee_punches (employee_personnummer, punch_date, punch_start_time) VALUES ('${req.body.employee_personnummer}', '${req.body.punch_date}', '${req.body.punch_start_time}');`
        const query = await dbHandler.createPostQuery(req.body, 'employee_punches')
        console.log(query)
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

//Update data in employee_punches table http://localhost:4000/api/employee_punches
router.patch('/clockOut', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();
    
    function calculateTotalTime(startTime, endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        // Calculate the total time in minutes
        let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

        if (totalMinutes < 0) {
          // Adjust for overnight scenarios
          totalMinutes += 24 * 60;
        }

        // Convert total minutes to hours and minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Return the total time as a formatted string
        return `${hours}:${minutes}`;
    }

    try {    
        console.log(await dbHandler.connectAsync(db))

        const updateQuery = `UPDATE employee_punches SET punch_end_time = "${req.body.punch_end_time}", daily_total_hours = "${calculateTotalTime(req.body.punch_start_time, req.body.punch_end_time)}" Where punch_id = ${req.body.punch_id}; `;
        const data = await dbHandler.queryAsync(db, updateQuery);

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

//Update data in employee_punches table http://localhost:4000/api/employee_punches
router.patch('/:punch_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createUpdateQuery(req.body.data, 'employee_punches', 'punch_id', req.params.punch_id);
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


router.delete('/:punch_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `DELETE FROM employee_punches WHERE employee_personnummer = '${req.params.punch_id}'`;
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