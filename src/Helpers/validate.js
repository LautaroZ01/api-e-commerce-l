import validator from "validator";

const validate = (params) => {
    let name = !validator.isEmpty(params.name)
        && validator.isLength(params.name, { min: 3, max: undefined })
        && validator.isAlpha(params.name, "es-ES")

    let surname = !validator.isEmpty(params.surname)
        && validator.isLength(params.surname, { min: 3, max: undefined })
        && validator.isAlpha(params.surname, "es-ES")

    let email = !validator.isEmpty(params.email)
        && validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password)

    let birthdate = !validator.isEmpty(params.birthdate)
    
    if (!name || !surname || !email || !password  || !birthdate){
        throw new Error("No se ha superado la validacion")
    } else{
        console.log("validacion superada")
    }

}

export {validate}