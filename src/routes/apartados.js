const conn = require("../database");
const express = require("express");
const router = express.Router();

router.get("/apartados", (req, res) => {
  const { search } = req.query;
  console.log(search);
  const consulta = `SELECT * FROM apartados INNER JOIN productos ON productos.id_productos = apartados.id_producto WHERE apartados.status = 1`;
  conn.query(consulta, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/buscar/apartado", (req, res) => {
  const { search } = req.query;
  console.log(search);
  const consulta = `SELECT * FROM apartados INNER JOIN productos ON productos.id_productos = apartados.id_producto WHERE apartados.nombre LIKE '%${search}%' AND apartados.status = 1`;
  conn.query(consulta, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/see/apartado", (req, res) => {
  const { id } = req.query;
  const mostrar = `SELECT * FROM apartados INNER JOIN productos ON productos.id_productos = apartados.id_producto WHERE id_apartados LIKE '%${id}%' AND apartados.status = 1`;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.post("/reserve", async (req, res) => {
  const {
    id_producto,
    enganche,
    nombre,
    apellido,
    telefono,
    direccion
  } = req.body;

  await conn.query(
    "INSERT INTO apartados(id_producto,nombre,apellido,telefono,direccion,enganche) VALUES (?,?,?,?,?,?)",
    [id_producto, nombre, apellido, telefono, direccion, enganche],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "reserve",
          rows
        });
      } else {
        res.status(401).json({
          message: "failed"
        });
        console.log(err);
      }
    }
  );
});

router.post("/final", async (req, res) => {
  const { id_producto, total, id_apartados } = req.body;

  await conn.query(
    "UPDATE apartados SET status = 0 WHERE id_apartados = ?",
    [id_apartados],
    (err, rows, fields) => {
      if (!err) {
      } else {
        res.status(401).json({
          message: "failed"
        });
        console.log(err);
      }
    }
  );

  await conn.query(
    "INSERT INTO venta(id_producto,cantidad,total) VALUES (?,1,?)",
    [id_producto, total],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "reserve",
          rows
        });
      } else {
        res.status(401).json({
          message: "failed"
        });
        console.log(err);
      }
    }
  );
});

module.exports = router;
