const express = require('express');
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJwt');

const app = express();

const PORT = process.env.PORT || 4000;

const corsConfig = {
    origin: true,
    credentials: true
}

app.get('/', (req, res) => {
    res.send("Welcome to reserveIT backend!!")
})

app.use(cors());
// app.options('*', cors(corsConfig))
app.use(express.json());


app.use('/auth', require('./routes/auth'))
app.use('/api/register', require('./routes/register'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/booking_instructions', require('./routes/bookingInstructions'));
app.use('/api/bookings', require('./routes/bookings'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));