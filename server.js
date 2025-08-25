const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Fixed IP/Port
const PROXY_IP = "11.88.18.103";
const PROXY_PORT = "7235";

// In-memory storage for UID sessions
let sessions = {}; // { uid: { timerEnd: Date, data: {...} } }

// Fake user data template
const fakeUserData = {
  vip: true,
  vBadge: "V1",
  amount: 9999,
  coins: 5000,
  diamonds: 200,
  skins: "All unlocked"
};

// Login endpoint (IP/Port validation + speed check)
app.post("/login", (req, res) => {
  const { ip, port } = req.body;
  if (ip === PROXY_IP && port == PROXY_PORT) {
    // Simulate speed test (ms)
    const speedMs = Math.floor(Math.random() * 50) + 20;
    res.json({ success: true, speed: speedMs, message: "IP/Port verified" });
  } else {
    res.json({ success: false, message: "Invalid IP or Port" });
  }
});

// Save UID & start/reset 1-hour timer
app.post("/save-uid", (req, res) => {
  const { uid } = req.body;
  const now = new Date();
  const timerEnd = new Date(now.getTime() + 60*60*1000); // 1 hour from now

  // Save or reset
  sessions[uid] = { timerEnd, data: { ...fakeUserData } };

  res.json({ success: true, message: "UID saved", timerEnd });
});

// Get session info
app.get("/session/:uid", (req, res) => {
  const uid = req.params.uid;
  if (!sessions[uid]) return res.json({ success: false, message: "UID not found" });

  const now = new Date();
  const remainingMs = sessions[uid].timerEnd - now;
  const remaining = remainingMs > 0 ? remainingMs : 0;

  res.json({
    success: true,
    timer: remaining,
    data: sessions[uid].data
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
