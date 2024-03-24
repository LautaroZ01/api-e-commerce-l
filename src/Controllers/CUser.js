import { consulta, insertar } from "../Database/conexion.js";
import Bcrypt from "bcrypt";
import { createToken } from "../Services/jwt.js";


const register = async (req, res) => {
    let params = req.body;

    if (!params.name || !params.surname || !params.email || !params.password) {
        return res.status(400).send({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        })
    }

    const query = `SELECT COUNT(*) FROM users WHERE name = '${params.name}' OR email = '${params.email}'`
    const userExist = await consulta(query);

    if (userExist.rows[0].count != 0) {
        return res.status(400).send({
            status: "Error",
            mensaje: "El usuario ya existe"
        })
    }

    // try {
    //     validate.validate(params);

    // } catch (error) {
    //     return res.status(400).send({
    //         status: "Error",
    //         mensaje: "Validacion no superada"
    //     })
    // }

    try {
        let { name, surname, email, password, address, birthdate } = params;

        let pwd = await Bcrypt.hash(password, 10);
        password = pwd;

        const query = "INSERT INTO users (name, surname, email, password, address, birthdate) values ($1, $2, $3, $4, $5, $6)"
        let array = [name, surname, email, password, address, birthdate]
        const respuesta = await insertar(query, array);

        res.status(200).send({
            status: "Success",
            user: array
        })

    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "No se ha podido registrar el usuario",
            error: error
        })
    }
}

const login = async (req, res) => {
    const params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: 'error',
            message: 'No se ha enviado los datos necesarios'
        });
    }


    try {
        const query = `SELECT * FROM users WHERE email = '${params.email}'`;
        const respuesta = await consulta(query);
        const user = respuesta.rows[0];

        const pwd = Bcrypt.compareSync(params.password, user.password)

        if (!pwd) {
            return res.status(400).send({
                status: "error",
                message: "Contraseña incorrecta"
            })
        }

        const token = createToken(user);

        res.status(200).send({
            status: "Success",
            message: "Te has identificado correctamente",
            usuario: {
                name: user.name,
                surname: user.surname,
                email: user.email
            },
            token
        })

    } catch (error) {
        return res.status(400).send({
            status: 'error',
            message: 'El usuario no se pudo logear'
        });
    }

}

const profile = async (req, res) => {
    const name = req.params.name;

    try {
        const query = `SELECT name, surname, email, address, birthdate FROM users WHERE name = '${name}'`;
        const respuesta = await consulta(query);
        const user = respuesta.rows[0]

        return res.status(200).send({
            status: "Success",
            message: "Datos del usuario",
            user: user
        })

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Algo salio mal al mostrar el usuario"
        })
    }
}

export {
    register,
    login,
    profile
}