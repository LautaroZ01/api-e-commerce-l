import path from "path";
import { consulta } from "../Database/conexion.js";
import fs, { exists } from "fs";


const getCategorias = async (req, res) => {
  const query = "SELECT name FROM categorias";
  try {
    const respuesta = await consulta(query);
    res.status(200).json(respuesta.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

const getProducts = async (req, res) => {
  const query = `select p.id, p.name, p.price, p.discount, p.photo, m.name as marca from productos p inner join marca m on id_marca = m.id;`;
  try {
    const respuesta = await consulta(query);

    return res.status(200).send({
      status: "Seccess",
      productos: respuesta.rows
    })

  } catch (error) {

    return res.status(400).send({
      status: "error",
      message: "Ocurrio un problema al traer los productos"
    })

  }
}

const getOneProduct = async (req, res) => {
  const id = req.params.id;

  const query = `select p.name, p.description, p.price, p.stock, p.discount, p.photo,m.name as marca, c.name as categoria from productos p
                inner join categorias c on id_categoria = c.id 
                inner join marca m on id_marca = m.id
                where p.id = ${id};`;
  try {
    const respuesta = await consulta(query);

    if (respuesta.rows.length == 0) {
      return res.status(400).send({
        status: 'error',
        message: 'No existe ese producto'
      })
    }

    return res.status(200).send({
      status: "Seccess",
      producto: respuesta.rows[0]
    })

  } catch (error) {

    return res.status(400).send({
      status: "error",
      message: "Ocurrio un problema al traer el producto"
    })

  }
}

const upload = async (req, res) => {
  if (!req.file) {
    return res.status(404).send({
      status: 'error',
      message: "No has subido ninguna imagen"
    })
  }

  let image = req.file.originalname

  const imageSplit = image.split('\.');
  const extencion = imageSplit[1]

  if (extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "svg" && extencion != "gif" && extencion != "webp") {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: 'error',
      message: `Formato no permitido`
    })
  }

  try {
    const query = `SELECT name FROM users WHERE id = '${req.params.id}'`;
    const respuesta = await consulta(query);

    if (respuesta.rows.length == 0) {
      return res.status(404).send({
        status: 'error',
        message: 'Error al actualizar la imagen'
      })
    }

    const user = respuesta.rows[0]
    const query2 = `UPDATE productos SET photo = '${req.file.filename}' WHERE id = '${req.params.id}';`
    const respuesta2 = await consulta(query2);

    return res.status(200).send({
      status: "Success",
      user: user,
      file: req.file
    })

  } catch (error) {
    return res.status(404).send({
      status: 'error',
      message: 'Ocurrio un problema al cargar la imagen'
    })
  }
}

const media = async (req, res) => {
  const file = req.params.file;

  let filePath = './Uploads/Products/' + file;

  fs.stat(filePath, (error, exist) => {

    if (!exist) {
      return res.status(404).send({
        status: 'error',
        message: 'La imagen no existe'
      })
    }

    return res.sendFile(path.resolve(filePath));

  })
}

export {
  getCategorias,
  getProducts,
  getOneProduct,
  upload,
  media
}