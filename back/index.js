const express = require('express');
const cors = require('cors');
const dbConnect = require("./DataBase");
const expressListEndpoints = require("express-list-endpoints");

const app = express();
const port = process.env.PORT || 3000;

dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');

app.use('/users', userRoutes)

const endpoints = expressListEndpoints(app);

console.log(endpoints);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})