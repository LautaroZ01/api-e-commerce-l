import { Router } from "express";
const routerP = Router();

import {getCategorias} from "../Controllers/CProduct.js"

routerP.get('/list', getCategorias)


export {routerP};