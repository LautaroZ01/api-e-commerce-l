import express from "express";
import { routerP } from "./src/Routers/RProduct.js"
import { routerU } from "./src/Routers/RUser.js";

import cors from "cors";
const app = express();

app.use(cors())

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const userRoutes = routerU;
const productRoutes = routerP;

//Rutas
app.use("/api/user", userRoutes);
app.use("/api/producto", productRoutes);

app.listen(process.env.PORT);
console.log("Servidor corriendo en el puerto 3000");