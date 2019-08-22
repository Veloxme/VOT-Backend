const express = require("express");
const router = express.Router();
const conn = require("../database");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dyn9zotlc",
  api_key: "848796867536635",
  api_secret: "rartK8mco1GgbFP2GNLCblHzYwM"
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

router.get("/", (req, res) => {
  conn.query(
    "SELECT * FROM productos Where status = '1' AND cantidad > '0'",
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/buscar", (req, res) => {
  const { search } = req.query;
  console.log(search);
  const consulta = `SELECT * FROM productos WHERE nombre LIKE '%${search}%' AND status = '1' AND cantidad > '0' `;
  conn.query(consulta, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/see", (req, res) => {
  const { id } = req.query;
  const mostrar = `SELECT * FROM productos WHERE id_productos LIKE '%${id}%'`;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/pedirproveedor", (req, res) => {
  const mostrar = `SELECT * FROM productos WHERE cantidad < '1' AND status = '1'`;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/empleados", (req, res) => {
  const mostrar = `SELECT * FROM empleados `;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/showprovee", (req, res) => {
  const mostrar = `SELECT * FROM proveedores `;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/reporte/venta", (req, res) => {
  const mostrar = `SELECT ventas.id_ventas,productos.nombre,ventas.cantidad,ventas.total,ventas.fecha FROM ventas INNER JOIN productos ON productos.id_productos = ventas.id_producto `;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/reporte/apartados", (req, res) => {
  const mostrar = `SELECT apartados.id_apartados,productos.nombre AS producto,apartados.nombre,apartados.apellido,apartados.telefono,apartados.direccion,apartados.enganche,apartados.fecha FROM apartados INNER JOIN productos ON productos.id_productos = apartados.id_producto`;
  conn.query(mostrar, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.post("/cambio", async (req, res) => {
  const { id } = req.body;

  console.log(id);

  await conn.query(
    "UPDATE empleados SET STATUS = (SELECT IF(empleados.`status` = '1', '0', '1')) WHERE id =  ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "change",
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

router.post("/sell", async (req, res) => {
  const { id_producto, cantidad, total } = req.body;
  await conn.query(
    "INSERT INTO ventas(id_producto,cantidad,total) VALUES (?,?,?)",
    [id_producto, cantidad, total],
    (err, rows, fields) => {
      if (!err) {
        console.log("venta hecha");
      } else {
        res.status(401).json({
          message: "failed"
        });
        console.log(err);
      }
    }
  );

  await conn.query(
    "UPDATE productos SET cantidad = cantidad - ? WHERE id_productos = ?",
    [cantidad, id_producto],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "sell",
          rows
        });
        console.log("producto eliminado");
      } else {
        res.status(401).json({
          message: "failed"
        });
        console.log(err);
      }
    }
  );
});

router.post("/modi", async (req, res) => {
  const { id_producto, nombre, descripcion, precio, plataforma } = req.body;
  console.log(id_producto, nombre, descripcion, precio, plataforma);
  await conn.query(
    "UPDATE productos SET nombre = ? , descripcion = ? ,plataforma =? , precio =? WHERE id_productos = ?",
    [nombre, descripcion, plataforma, precio, id_producto],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "update",
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

router.post("/add/emple", async (req, res) => {
  const { user, password, nombre, apellido, direccion, telefono } = req.body;
  await conn.query(
    "INSERT INTO empleados(user,password,direccion,nombre,apellido,telefono) VALUES (?,?,?,?,?,?)",
    [user, password, direccion, nombre, apellido, telefono],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "update",
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

router.post("/add/proveedor", async (req, res) => {
  const { nombre, apellido, direccion, telefono } = req.body;
  await conn.query(
    "INSERT INTO proveedores(nombre,apellido,telefono,direccion) VALUES (?,?,?,?)",
    [nombre, apellido, telefono, direccion],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "update",
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

router.post("/pedirproveedor", async (req, res) => {
  const { id_producto, cantidad } = req.body;
  console.log(id_producto, cantidad);
  await conn.query(
    "UPDATE productos SET cantidad = ? WHERE id_productos = ?",
    [cantidad, id_producto],
    (err, rows, fields) => {
      if (!err) {
        res.json({
          message: "update",
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

router.post("/add", upload.single("imagen"), async (req, res) => {
  const {
    nombre,
    descripcion,
    plataforma,
    precio,
    telefono,
    cantidad
  } = req.body;

  var id_proveedor;

  console.log(nombre, plataforma, precio, telefono, cantidad);

  const mensaje = `SELECT id_proveedor FROM proveedores WHERE telefono = ${telefono}`;

  await conn.query(mensaje, (err, rows, fields) => {
    if (!err) {
      id_proveedor = rows[0].id_proveedor;
    } else {
      console.log(err);
    }
  });

  // Saving Image in Cloudinary
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);

    conn.query(
      "INSERT INTO productos(nombre,descripcion,plataforma,precio,id_proveedor,cantidad,imagen) VALUES (?,?,?,?,?,?,?)",
      [
        nombre,
        descripcion,
        plataforma,
        precio,
        id_proveedor,
        cantidad,
        result.url
      ],
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      }
    );

    await fs.unlink(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
