//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conn = require("../database");
const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  const { nombre, apellido, telefono, direccion, user, password } = req.body;
  conn.query(
    "INSERT INTO clientes(nombre,apellido,telefono,direccion,user,password) VALUES (?,?,?,?,?,?)",
    [nombre, apellido, telefono, direccion, user, password],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "User created"
        });
      } else {
        res.status(401).json({
          message: "Auth failed"
        });
        console.log(err);
      }
    }
  );
});

router.post("/login", (req, res) => {
  const { user, password } = req.body;
  const consulta = `SELECT password,id FROM empleados WHERE user = '${user}' AND status = 1`;
  conn.query(consulta, (err, rows, fields) => {
    if (!err) {
      console.log(password, rows[0].password);
      if (password === rows[0].password) {
        console.log(password, rows[0].password, "simon");
        const token = jwt.sign(
          {
            user: user,
            userId: rows[0].id
          },
          "VOT",
          {
            expiresIn: "1h"
          }
        );
        return res.status(200).json(token);
      } else {
        res.status(401).json({
          message: "Auth failed"
        });
      }
    } else {
      console.log(err);
      res.status(401).json({
        message: "Auth failed"
      });
    }
  });
});

module.exports = router;
