const mysql = require('mysql');
require('dotenv').config();

let connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "shortikodb_accurateno"
});

// let connection = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "express_short_link"
// });

module.exports = connection;