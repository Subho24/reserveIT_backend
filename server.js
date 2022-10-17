const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send("Welcome to reserveIT backend!!")
})

app.use(cors())

app.use('/api/companies', require('./routes/companies'));
app.use('/api/booking_instructions', require('./routes/bookingInstructions'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));