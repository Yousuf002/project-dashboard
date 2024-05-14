const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const cors = require('cors'); 

app.use(cors());
app.use(express.json());

const projectRouter = require('./routes/Project');
app.use('/projects', projectRouter);

mongoose.connect('mongodb://localhost:27017').then(() => {
    console.log('Connected to database');
}).catch((error) => {
    console.log(error);
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
