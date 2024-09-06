import { createConnection } from "mysql2/promise";

export const database = async () => {
    try {
        const conex = await createConnection({
            host: "localhost",
            user: "root",
            database: "db_system"
        });
        console.log("Conexión exitosa");
        return conex;
    } catch (error) {
        throw error;
    }
};

export const PORT=4000
export const SECRET_KEY="aopz9-3fliw12-4ja94f-614jzg8"

export const SessionConfig={
    secret: 'session_secret_key', // Cambia esto por una clave secreta en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usar 'true' si usas HTTPS
}