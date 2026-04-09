const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "https://hiep77972.github.io",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


const wss = new WebSocket.Server({ port: 3001 });

let clients = [];

// 🔥 WebSocket connect
wss.on("connection", (ws) => {
    console.log("Printer connected");
    
    clients.push(ws);

    ws.on("message", (msg) => {
        try {
            const text = msg.toString();

            // 🔥 heartbeat
            if (text === "ping") {
                // có thể reply lại nếu muốn
                // ws.send("pong");
                return;
            }

            console.log("Client message:", text);
        } catch (e) {
            console.log("Message error:", e);
        }
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
        console.log("Printer disconnected");
    });
    ws.on("error", (err) => {
        console.log("WS error:", err.message);
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