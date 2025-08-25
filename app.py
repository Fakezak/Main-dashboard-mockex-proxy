from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Fixed proxy
PROXY_IP = "11.88.18.103"
PROXY_PORT = "7235"

# In-memory storage for UIDs
sessions = {}

# Fake user data template
fake_user_template = {
    "vip": True,
    "vBadge": "V1",
    "amount": 9999,
    "coins": 5000,
    "diamonds": 200,
    "skins": "All unlocked",
    "friends": ["Friend1","Friend2"]
}

@app.route("/check_ip", methods=["POST"])
def check_ip():
    data = request.json
    ip = data.get("ip")
    port = str(data.get("port"))
    if ip == PROXY_IP and port == PROXY_PORT:
        # Simulate speed test
        speed = 20 + int((datetime.now().second % 30))
        return jsonify({"connected": True, "speed": speed})
    return jsonify({"connected": False, "speed": None})

@app.route("/save_uid", methods=["POST"])
def save_uid():
    data = request.json
    uid = data.get("uid")
    if not uid:
        return jsonify({"success": False, "message": "UID required"})
    end_time = datetime.now() + timedelta(hours=1)
    sessions[uid] = {"timerEnd": end_time, "data": fake_user_template.copy()}
    return jsonify({"success": True, "timerEnd": end_time.isoformat(), "data": sessions[uid]["data"]})

@app.route("/session/<uid>", methods=["GET"])
def get_session(uid):
    session = sessions.get(uid)
    if not session:
        return jsonify({"success": False, "message": "UID not found"})
    now = datetime.now()
    remaining = max((session["timerEnd"] - now).total_seconds(), 0)
    return jsonify({"success": True, "remaining": remaining, "data": session["data"]})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
