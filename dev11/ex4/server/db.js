async function createConnection() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log("here");
  return connection;
}
async function closeConnection(connection) {
  if (connection) {
    await connection.end();
  }
}

module.exports = {
  createConnection,
  closeConnection,
};
