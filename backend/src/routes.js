import { Router } from "express";
import RegistroController from "./controllers/RegistroController.js";

const router = Router();

router.get('/listregistros', RegistroController.findAllRegistros);


export { router }