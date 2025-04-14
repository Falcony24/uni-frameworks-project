const mongoose = require("mongoose");
const {initializeDatabase} = require("./util/initData");

async function dbConnect(retries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(process.env.DB_URL);
            await initializeDatabase();
            console.log("Connected!");
            return;
        } catch (error) {
            console.log(error)
            if (attempt < retries) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                process.exit(1);
            }
        }
    }
}

module.exports = dbConnect;
