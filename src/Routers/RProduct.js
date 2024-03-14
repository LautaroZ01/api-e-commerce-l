import { Router } from "express";
import {getCategorias, getOneProduct, getProducts} from "../Controllers/CProduct.js"


const routerP = Router();


routerP.get('/list', getCategorias);
routerP.get('/products', getProducts);
routerP.get('/oneproduct/:id', getOneProduct);


export {routerP};