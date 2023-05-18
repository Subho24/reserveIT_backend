const express = require('express');
const verifyJWT = require('../middleware/verifyJwt');
const dbHandler = require('../dbHandler');

const router = express.Router();
require('dotenv').config();


router.use(express.json());


// Get all data from compnaies table http://localhost:4000/api/companies
router.get('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `Select booking_closed_time from booking_settings where company_id='${req.params.company_id}' and booking_closed_date='${req.query.date}' and booking_closed_type='${req.query.type}'`
        console.log(query);
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

//Post data to companies table http://localhost:4000/api/companies
router.post('/', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createPostQuery(req.body, 'booking_settings');
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

//Update data in companies table http://localhost:4000/api/companies
router.patch('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createUpdateQuery(req.body, 'booking_settings', 'company_id', req.params.company_id);
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


router.delete('/:company_id', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        console.log(req.body)
        const query = `DELETE FROM booking_settings WHERE company_id = "${req.params.company_id}" AND booking_closed_date = "${req.body.booking_closed_date}" AND booking_closed_type = "${req.body.booking_closed_type}" AND booking_closed_time = "${req.body.booking_closed_time}";`;
        console.log(query)
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