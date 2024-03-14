import { Router } from "express";
import {getCategorias, getOneProduct, getProducts, media, upload} from "../Controllers/CProduct.js"
import multer from "multer";
import { check } from "../Middlewares/auth.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Uploads/Products/")
    },
    filename: (req, file, cb) => {
        cb(null, "product-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

const routerP = Router();


routerP.get('/list', getCategorias);
routerP.get('/products', getProducts);
routerP.get('/oneproduct/:id', getOneProduct);
routerP.post('/upload/:id', [check, uploads.single("photo")], upload);
routerP.get("/media/:file", media);


export {routerP};