import jwt from "jwt-simple";
import moment from "moment";

const secret = "CLAVE_SECRETA_del_e_commerce_DE_ELECTRONICOS_23311";

const createToken = (user) =>{
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        address: user.address,
        birthdate: user.birthdate,
        photo: user.photo,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, secret);

}

export {
    secret,
    createToken
}