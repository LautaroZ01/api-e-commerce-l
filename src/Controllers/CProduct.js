import { consulta } from "../Database/conexion.js";

const getCategorias = async (req, res) => {
  const query = "SELECT name FROM categorias;";
  try {
    const respuesta = await consulta(query);

    res.status(200).send({
      status: 'Success',
      categorias: respuesta.rows
    })

  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Error al mostrar las categorias"
    });
  }
};

const getMarcas = async (req, res) => {
  const query = "SELECT name, logo FROM marca;";

  try {
    const respuesta = await consulta(query);

    res.status(200).send({
      status: 'Success',
      marcas: respuesta.rows
    })

  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Error al mostrar las marcas"
    });
  }
}

const getProducts = async (req, res) => {
  const query = `select p.id, p.name, p.price, p.discount, p.photo, m.name as marca, c.name as categoria 
  from productos p inner join marca m on id_marca = m.id
  inner join categorias c on id_categoria = c.id;`;
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

export {
  getCategorias,
  getMarcas,
  getProducts,
  getOneProduct
}