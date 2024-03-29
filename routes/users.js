const express = require('express');
const dbHandler = require('../dbHandler');

const router = express.Router();
require('dotenv').config();


router.use(express.json());


// Get all data from users table http://localhost:4000/api/users
router.get('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `Select * from users where company_id = '${req.params.company_id}'`;
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
        const query = await dbHandler.createPostQuery(req.body, 'users');
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
        const query = await dbHandler.createUpdateQuery(req.body, 'users', 'company_id', req.params.company_id);
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


router.delete('/:company_id', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const query = `DELETE FROM users WHERE company_id = ${req.params.company_id}`;
        console.log(await dbHandler.connectAsync(db))
        const data = await dbHandler.queryAsync(db, query);
        await dbHandler.queryAsync(db, `ALTER TABLE companies AUTO_INCREMENT=${req.params.company_id}`)
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