import { Router } from "express";
const routerP = Router();

import {getCategorias, getOneProduct, getProducts} from "../Controllers/CProduct.js"

routerP.get('/list', getCategorias)
routerP.get('/products', getProducts)
routerP.get('/oneproduct/:id', getOneProduct)


export {routerP};