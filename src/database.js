const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store"
});

conn.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`tamos adentro`);
  }
});

module.exports = conn;
