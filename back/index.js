const express = require('express');
const cors = require('cors');
const dbConnect = require("./Database");
const expressListEndpoints = require("express-list-endpoints");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const upgradeRoutes = require('./routes/upgradeRoutes');

dbConnect();

// const WebSocket = require("ws");
// const server = new WebSocket.Server({ port: 5000 });
//
// server.on("connection", (ws) => {
//     ws.on("message", (message) => {
//         const data = JSON.parse(message);
//         if (data.type === "click") {
//             console.log('Click');
//         }
//     });
// });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
})

app.use(cors(
    {
        origin: 'http://localhost:3001',
        credentials: true,
    }
))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/admins', adminRoutes)
app.use('/upgrades', upgradeRoutes)

const endpoints = expressListEndpoints(app);

console.log(endpoints);
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})