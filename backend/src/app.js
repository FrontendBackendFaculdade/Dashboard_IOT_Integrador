import express from "express";
import { router } from "./routes.js"; // <-- aqui o ajuste principal
import cors from "cors";

const app = express();

// Middleware para tratar JSON
app.use(express.json());

// Middleware de CORS (limpo e direto)
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "*"
}));

// Rotas
app.use(router);

// Inicialização do servidor
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
