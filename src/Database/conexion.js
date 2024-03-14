import pg from "pg";
const { Pool } = pg;

// Importante comentar al desplegar
// const pool = new Pool({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'postgres',
//   database: 'e_commerce_db'
// })

// Importante descomentar al desplegar
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

const consulta = async (query) => {
  try {
    const res = await pool.query(query);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertar = async (query, array) => {
  try {
    if (array) {
      const res = await pool.query(query, array);
      return res;
    }
    else {
      return "Array vacio";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export {
  consulta,
  insertar
};