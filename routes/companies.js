const express = require('express');
const dbHandler = require('../dbHandler');
const verifyJWT = require('../middleware/verifyJwt');


const router = express.Router();
require('dotenv').config();


router.use(express.json());


// Get all data from compnaies table http://localhost:4000/api/companies
router.get('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `Select * from companies where company_id = "${req.params.company_id}"`;
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
        res.status(200).json(data);
        console.log(await dbHandler.disconnectAsync(db));
    } catch (error) {
        console.log(error)
        console.log(error.message)
        res.status(500).json({
            "message": 'Internal Server Error!!'
        })
        console.log(await dbHandler.disconnectAsync(db));
    }
})

router.get('/companyBookingInfo/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `Select * from companies where company_id = '${req.params.company_id}'; Select * from booking_instructions where company_id = '${req.params.company_id}'`;
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
        const organisedData = {
            companyInfo: data[0][0],
            bookingInfo: data[1]
        }
        res.status(200).json(organisedData);
        console.log(await dbHandler.disconnectAsync(db));
    } catch (error) {
        console.log(error)
        console.log(error.message)
        res.status(500).json({
            "message": 'Internal Server Error!!'
        })
        console.log(await dbHandler.disconnectAsync(db));
    }
})

//Post data to companies table http://localhost:4000/api/companies
router.post('/', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createUUIDPostQuery(req.body, 'companies');
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
router.patch('/:company_id', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = await dbHandler.createUpdateQuery(req.body, 'companies', 'company_id', req.params.company_id);
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


router.delete('/:company_id', verifyJWT, async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `DELETE FROM companies WHERE company_id = '${req.params.company_id}'`;
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