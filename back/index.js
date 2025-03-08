const express = require('express');
const cors = require('cors');
const dbConnect = require("./DataBase");
const expressListEndpoints = require("express-list-endpoints");

const app = express();
const port = process.env.PORT || 3000;

dbConnect();

const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 5000 });

server.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.type === "click") {
            console.log(`Kliknięcie od gracza!`);
        }
    });
});

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes)

const endpoints = expressListEndpoints(app);

console.log(endpoints);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})