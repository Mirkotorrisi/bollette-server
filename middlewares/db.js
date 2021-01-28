const mysql = require("mysql");
const util = require("util");
const config = require("config");
const db = mysql.createPool({
  connectionLimit: 10,
  host: "sql7.freemysqlhosting.net",
  port: 3306,
  user: config.get("db_username"),
  password: config.get("db_password"),
  database: config.get("db_username"),
});

// Ping database to check for common exception errors.
db.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
    console.log(err);
  }

  if (connection) connection.release();

  return;
});
db.query = util.promisify(db.query);

// Promisify for Node.js async/await.

module.exports = db;
