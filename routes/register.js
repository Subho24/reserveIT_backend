const express = require('express');
const dbHandler = require('../dbHandler');

const router = express.Router();
require('dotenv').config();


router.use(express.json());


router.post('/createAccount', async (req, res) => {
    const db = await dbHandler.createConnectionAsync();

    try {
        const hash = await dbHandler.hashPass(req.body.acc.pwd, 10)
        let {query, id} = await dbHandler.createUUIDPostQuery(req.body.companyInfo, 'companies');
        console.log(query)
        console.log(await dbHandler.connectAsync(db))
        let data = await dbHandler.queryAsync(db, query);
        data = await dbHandler.queryAsync(db, `Insert Into users (user_name, user_password, company_id, user_created) Value ("${req.body.companyInfo.company_email}", "${hash}", "${id}", CURDATE() )`)
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