const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3500;

app.use(express.json());

app.use('/tickets', require('./routes/api/tickets'));
app.use('/users', require('./routes/api/users'));
app.use('/teams', require('./routes/api/teams'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));