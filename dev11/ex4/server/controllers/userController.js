const db = require("../db");
const crypto = require("crypto");
const generateAccessCode = () => crypto.randomBytes(32).toString("hex");
const connection=db.createConnection();
async function registerNewUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing Field" });
  }
  const accessCode = generateAccessCode();
  try {
 connection = db.getConnection();
    await connection.execute(
      "INSERT INTO tbl_11_users (username, password, access_code) VALUES (?, ?, ?)",
      [username, password, accessCode]
    );
    db.closeConnection();
    res.json({ accessCode });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
 
}
module.exports = { registerNewUser };