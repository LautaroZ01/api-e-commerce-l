import { consulta } from "../Database/conexion.js";


const getCategorias = async (req, res) => {
    const query = "SELECT name FROM categorias";
    try {
      const respuesta = await consulta(query);
      res.status(200).json(respuesta.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  };

export {getCategorias}