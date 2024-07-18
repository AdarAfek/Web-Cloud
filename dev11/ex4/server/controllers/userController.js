const { clear } = require("console");
const db = require("../db");
const crypto = require("crypto");
const generateAccessCode = () => crypto.randomBytes(32).toString("hex");

async function registerNewUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing Field" });
  }
  
  try {
    const connection = await db.createConnection(); // Await for connection creation
    await connection.execute(
      "INSERT INTO tbl_11_users (username, password, access_code) VALUES (?, ?, ?)",
      [username, password, generateAccessCode()]
    );
    await db.closeConnection(); // Await for closing connection
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to register user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
}
async function loginUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing Field" });
    }
    
    try {
      const connection = await db.createConnection();
      const [rows] = await connection.execute(
        "SELECT access_code FROM tbl_11_users WHERE username = ? AND password = ?",
        [username, password]
      );
      await db.closeConnection();
      
      if (rows.length === 0) {
        return res.status(401).json({ error: "Wrong User Name or Password" });
      }
      
      res.json({ accessCode: rows[0].access_code });
    } catch (err) {
      console.error("Failed to login:", err);
      res.status(500).json({ error: "Failed to login" });
    }
  }


module.exports = {
    {registerNewUser, loginUser };
  }
