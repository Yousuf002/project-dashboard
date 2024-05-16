const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const cors = require('cors'); 

app.use(cors());
app.use(express.json());

const projectRouter = require('./routes/Project');
const fileRouter = require('./routes/File');
const fileverificationRouter = require('./routes/FileVerification')
//import formouter
const formRouter = require('./routes/Form');
app.use('/projects', projectRouter);
app.use('/files', fileRouter);
app.use('/file-verification', fileverificationRouter);
//use formrouter
app.use('/form', formRouter);
mongoose.connect('mongodb://localhost:27017').then(() => {
    console.log('Connected to database');
}).catch((error) => {
    console.log(error);
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
