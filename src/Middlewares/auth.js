import jwt from "jwt-simple";
import moment from "moment";
import { secret } from "../Services/jwt.js";

export const check = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene cabecera de autorizacion"
        })
    }

    let token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        let payload = jwt.decode(token, secret);

        if (payload.exp <= moment.unix()) {
            return res.status(401).send({
                status: "error",
                message: 'El token ha expirado'
            })
        }

        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: 'Token invalido'
        })

    }

    next();
}