import jwt from "jwt-simple";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET;

const createToken = (user) => {
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