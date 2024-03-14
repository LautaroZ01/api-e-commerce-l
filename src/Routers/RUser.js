import { Router } from "express";
import { login, profile, register, upload } from "../Controllers/CUser.js";
import { check } from "../Middlewares/auth.js"
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Uploads/Avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

const routerU = Router();

routerU.post('/register', register);
routerU.post('/login', login);
routerU.get('/profile/:name', check, profile);
routerU.post("/upload", [check, uploads.single("photo")], upload);

export { routerU };