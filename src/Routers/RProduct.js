import { Router } from "express";
import {getCategorias, getMarcas, getOneProduct, getProducts} from "../Controllers/CProduct.js"


const routerP = Router();


routerP.get('/categorys', getCategorias);
routerP.get('/marks', getMarcas);
routerP.get('/products', getProducts);
routerP.get('/oneproduct/:id', getOneProduct);


export {routerP};