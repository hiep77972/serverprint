const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const wss = new WebSocket.Server({ port: 3001 });

let clients = [];

// 🔥 WebSocket connect
wss.on("connection", (ws) => {
    console.log("Printer connected");
    clients.push(ws);

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
        console.log("Printer disconnected");
    });
});

// 🔥 API để web gọi
app.post("/print", (req, res) => {
    const data = JSON.stringify(req.body);

    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    res.send("Sent to printers");
});

app.listen(3000, () => {
    console.log("API running at http://localhost:3000");
});