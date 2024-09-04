import { db } from '../config.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const conex = await db();

        // Buscar usuario en la base de datos
        const [rows] = await conex.query(
            'SELECT id, username FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        const user = rows[0];

        if (user) {
            // Guardar información del usuario en la sesión
            req.session.userId = user.id;
            req.session.username = user.username;

            return res.json({ 
                message: 'Inicio de sesión exitoso', 
                user: { id: user.id, username: user.username } 
            });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// La función session y logout no necesitan cambios
export const session = (req, res) => {

    if (req.session.userId) {
        return res.json({ 
            loggedIn: true, 
            user: { id: req.session.userId, username: req.session.username } 
        });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
    }
}
export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const conex = await db();
        await conex.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );

        // Envía una respuesta al cliente con un mensaje de éxito
        return res.json({ message: 'Registro exitoso' });

    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const logout = (req, res) => {
    console.log(req.session)
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
        return res.json({ message: 'Sesión cerrada exitosamente' });
    });
}
