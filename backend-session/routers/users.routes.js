import { Router } from "express";
import {login, session, logout, register } from "../controllers/users.controllers.js"

const routerTasks = Router();

// Ruta para iniciar sesión
routerTasks.post("/login", login);

// Ruta para obtener los datos de la sesión
routerTasks.get('/session',session );

// Ruta para cerrar la sesión
routerTasks.post('/logout', logout );

//ruta para registrarse
routerTasks.post('/register', register)

export default routerTasks;