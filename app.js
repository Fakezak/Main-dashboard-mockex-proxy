import React, { useState, useEffect } from "react";
import axios from "axios";

const backendURL = "http://localhost:5000"; // Change if deployed

function App() {
  const [ip, setIP] = useState("11.88.18.103");
  const [port, setPort] = useState("7235");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [speed, setSpeed] = useState(null);
  const [uid, setUID] = useState("");
  const [timer, setTimer] = useState(0);
  const [userData, setUserData] = useState(null);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleLogin = async () => {
    const res = await axios.post(`${backendURL}/login`, { ip, port });
    if (res.data.success) {
      setLoginSuccess(true);
      setSpeed(res.data.speed);
    } else {
      alert(res.data.message);
    }
  };

  const saveUID = async () => {
    if (!uid) return alert("Enter UID");
    const res = await axios.post(`${backendURL}/save-uid`, { uid });
    if (res.data.success) {
      setTimer(res.data.timerEnd - new Date());
      const session = await axios.get(`${backendURL}/session/${uid}`);
      setUserData(session.data.data);
    }
  };

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms/1000);
    const h = Math.floor(totalSec/3600);
    const m = Math.floor((totalSec%3600)/60);
    const s = totalSec%60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{textAlign:"center", fontFamily:"monospace", color:"#0f0"}}>
      {!loginSuccess ? (
        <div>
          <h1>MockeX Main Dashboard Login</h1>
          <input value={ip} onChange={e=>setIP(e.target.value)} placeholder="IP" />
          <input value={port} onChange={e=>setPort(e.target.value)} placeholder="Port" />
          <button onClick={handleLogin}>Connect ⚡</button>
          {speed && <p>Speed Test: {speed}ms</p>}
        </div>
      ) : (
        <div>
          <h2>Main Dashboard</h2>
          <input value={uid} onChange={e=>setUID(e.target.value)} placeholder="Enter UID" />
          <button onClick={saveUID}>💾 Save UID</button>
          {timer > 0 && <p>Timer: {formatTime(timer)}</p>}
          {userData && (
            <div>
              <h3>VIP Status: {userData.vip ? "✅ VIP" : "❌"}</h3>
              <p>V Badge: {userData.vBadge}</p>
              <p>Amount: {userData.amount}</p>
              <p>Coins: {userData.coins}</p>
              <p>Diamonds: {userData.diamonds}</p>
              <p>Skins: {userData.skins}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
