const express = require("express");
const cors = require("cors");
const app = express();
const port = 5143;

app.use(cors());
app.use(express.json());

// In-memory user store
const users = [
  { username: "admin", password: "adminpass", role: "admin" },
  { username: "user1", password: "userpass", role: "user" }
];

// In-memory bulletins store (example data)
const bulletins = [
  { id: "1", title: "Bulletin One", category: "1" },
  { id: "2", title: "Bulletin Two", category: "2" },
  { id: "3", title: "Bulletin Three", category: "3" },
];

// POST /api/register
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

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }
  // Generate fake token — replace with real JWT if you want
  const token = `fake-token-for-${username}`;
  res.json({ success: true, token, role: user.role });
});

// GET /api/bulletins/member
app.get("/api/bulletins/member", (req, res) => {
  // You can filter bulletins based on user or other logic here
  res.json({ success: true, data: bulletins });
});

// GET /api/bulletins/official (example, empty list)
app.get("/api/bulletins/official", (req, res) => {
  res.json({ success: true, data: [] });
});

app.listen(port, "172.19.159.72", () => {
  console.log(`Auth backend running at http://172.19.159.72::${port}`);
});
