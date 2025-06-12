// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Sample bulletins from before ---

const memberBulletins = [
  { id: "1", title: "First Member Bulletin", type: 1 },
  { id: "2", title: "Second Member Bulletin", type: 2 },
  { id: "3", title: "Third Member Bulletin", type: 3 },
];

const officialBulletins = [
  { id: "1", title: "First Official Bulletin", datetime: new Date(2025, 0, 1) },
  { id: "2", title: "Second Official Bulletin", datetime: new Date(2025, 0, 2, 8) },
  { id: "3", title: "Third Official Bulletin", datetime: new Date(2025, 0, 2, 12) },
];

function serializeBulletins(bulletins) {
  return bulletins.map(b => ({
    ...b,
    datetime: b.datetime ? b.datetime.toISOString() : undefined,
  }));
}

app.get("/api/bulletins/member", (req, res) => {
  res.json({ results: memberBulletins });
});

app.get("/api/bulletins/official", (req, res) => {
  res.json({ results: serializeBulletins(officialBulletins) });
});

// --- User/auth management ---

// In-memory users store
// Pre-seed an admin user if you like:
const users = [
  { username: "admin", password: "adminpass", role: "admin" }
];

// Register new user
app.post("/api/register", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ success: false, message: "Username already exists" });
  }
  const newRole = role === "admin" ? "admin" : "user";
  users.push({ username, password, role: newRole });
  res.json({ success: true, message: "User registered", role: newRole });
});

// Login user
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }
  // Fake JWT token—replace with real JWT generation if you wish
  const token = `fake-token-for-${username}`;
  res.json({ success: true, token, role: user.role });
});

app.listen(port, () => {
  console.log(`Mock backend running at http://localhost:${port}`);
});
