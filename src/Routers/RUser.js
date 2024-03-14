import { Router } from "express";
import { login, profile, register } from "../Controllers/CUser.js";
import { check } from "../Middlewares/auth.js"

const routerU = Router();

routerU.post('/register', register);
routerU.post('/login', login);
routerU.get('/profile/:name', check, profile);
export { routerU };