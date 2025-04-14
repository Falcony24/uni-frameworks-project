const WebSocket = require("ws");

const URL = "ws://localhost:5000"; // Twój serwer WebSocket
const CLIENTS = 1000;              // Ile klientów chcesz stworzyć
const INTERVAL = 1;             // Co ile ms wysyłają wiadomość

let connected = 0;

for (let i = 0; i < CLIENTS; i++) {
    const ws = new WebSocket(URL);

    ws.on("open", () => {
        connected++;
        console.log(`Client ${i} connected (${connected}/${CLIENTS})`);

        setInterval(() => {
            ws.send(JSON.stringify({ type: "click" }));
        }, INTERVAL);
    });

    ws.on("error", (err) => {
        console.error(`Client ${i} error:`, err.message);
    });
}
