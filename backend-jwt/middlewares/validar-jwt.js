import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../config.js';
import { database } from '../config.js';

// Middleware para verificar el token JWT
export default async (req, res, next) => {
    console.log(req.session)
    console.log('-----------')
    console.log(req.cookies)
    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }
    try {
        // Verifica el token JWT
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token Decodificado:', decoded);
        const conex = await database()
        // Busca al usuario en la base de datos con el ID del token decodificado
        const [rows] = await conex.execute('SELECT id, username FROM users WHERE id = ?', [decoded.userId]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const user = rows[0]; // Suponiendo que solo hay un usuario con ese ID

        req.user = user; // Agrega la información del usuario decodificada al request
       
        next(); // Pasa al siguiente middleware o ruta
    } catch (error) {
        console.error('Error al validar JWT:', error);
        return res.status(401).json({ message: 'Token no válido' });
    }
};