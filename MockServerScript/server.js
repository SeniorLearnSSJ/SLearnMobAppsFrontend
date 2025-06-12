/* const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Mock data matching your React Native app

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

// Helper to serialize Date objects to ISO string
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

app.listen(port, () => {
  console.log(`Mock backend running at http://localhost:${port}`);
});
 */

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Your existing bulletins ---

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

// --- New user management for auth ---

const users = []; // In-memory users store

// Register new user
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ success: false, message: "Username already exists" });
  }

  users.push({ username, password });
  res.json({ success: true, message: "User registered" });
});

// Login user
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  // Generate fake JWT token (just a string for testing)
  const token = `fake-jwt-token-for-${username}`;

  res.json({ success: true, token });
});

app.listen(port, () => {
  console.log(`Mock backend running at http://localhost:${port}`);
});
