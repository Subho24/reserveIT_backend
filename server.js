const express = require('express');
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJwt');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 4000;

const corsConfig = {
    origin: true,
    credentials: true
}

app.use(express.static(path.join(__dirname, "index.html")));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.use(cors());
// app.options('*', cors(corsConfig))
app.use(express.json());


app.use('/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/register', require('./routes/register'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/booking_instructions', require('./routes/bookingInstructions'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/booking_settings', require('./routes/bookingSettings'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/employee_punches', require('./routes/employeePunches'));

//Below are the apis for another project and has nothing to do with this project. 
app.use('/api/text', require('./routes/larlattApi'))
app.use('/api/image', require('./routes/larlattApi'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));