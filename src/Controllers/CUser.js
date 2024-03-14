import { consulta, insertar } from "../Database/conexion.js";
import { validate } from "../Helpers/validate.js";
import Bcrypt from "bcrypt";
import { createToken } from "../Services/jwt.js";
import fs from "fs";


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

        res.status(200).json(respuesta)

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

const upload = async (req, res) => {
    if (!req.file) {
        return res.status(404).send({
            status: 'error',
            message: "No has subido ninguna imagen"
        })
    }

    let image = req.file.originalname;

    const imageSplit = image.split('\.');
    const extencion = imageSplit[1]

    if (extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "svg" && extencion != "gif" && extencion != "WebP") {
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        return res.status(400).send({
            status: 'error',
            message: `Formato no permitido`
        })
    }

    try {
        const query = `SELECT name FROM users WHERE name = '${req.user.name}'`;
        const respuesta = await consulta(query);

        if (respuesta.rows.length == 0) {
            return res.status(404).send({
                status: 'error',
                message: 'Error al actualizar la imagen'
            })
        }

        const user = respuesta.rows[0]
        const query2 = `UPDATE users SET photo = '${req.file.filename}' WHERE name = '${req.user.name}';`
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

export {
    register,
    login,
    profile,
    upload
}