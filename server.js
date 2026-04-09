const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const http = require("http");

const app = express();

// ⚠️ dùng PORT của Render
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://hiep77972.github.io",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 🔥 tạo HTTP server từ express
const server = http.createServer(app);

// 🔥 gắn WebSocket vào server này
const wss = new WebSocket.Server({ server });

let clients = [];

// WebSocket connect
wss.on("connection", (ws) => {
    console.log("Printer connected");

    clients.push(ws);

    ws.on("message", (msg) => {
        const text = msg.toString();

        if (text === "ping") return;

        console.log("Client message:", text);
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
        console.log("Printer disconnected");
    });

    ws.on("error", (err) => {
        console.log("WS error:", err.message);
    });
});

// API
app.post("/print", (req, res) => {
    const data = JSON.stringify(req.body);

    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    res.send("Sent to printers");
});

// 🔥 dùng server.listen thay vì app.listen
server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});