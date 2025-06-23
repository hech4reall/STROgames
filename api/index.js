require('dotenv').config();
const express = require('express');

const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json())

const connect = require('./db_connect');
connect();

app.use('/user', require('./routes/user'))
app.use('/book', require('./routes/Bus'))
app.use('/destination', require('./routes/destination'))
app.get('/', (req, res) => res.send("working"))

app.listen(2000, () => {
  console.log('Server is running on http://localhost:2000');
})