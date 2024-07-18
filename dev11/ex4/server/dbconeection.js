const mysql = require('mysql2/promise');
let connection;

module.exports = {
  async createConnection() {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  },
  async initialize() {
    if (connection) {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL,
          access_code VARCHAR(100) NOT NULL UNIQUE
        );
      `);
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS preferences (
          preference_id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          destination VARCHAR(100) NOT NULL,
          type VARCHAR(100) NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
      `);
    }
  },
  async closeConnection() {
    if (connection) {
      await connection.end();
    }
  },
  getConnection() {
    return connection;
  }
};
