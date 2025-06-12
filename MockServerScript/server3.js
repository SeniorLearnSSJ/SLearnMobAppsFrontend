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

app.listen(port, () => {
  console.log(`Auth backend running at http://localhost:${port}`);
});
