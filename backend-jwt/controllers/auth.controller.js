import { database } from '../config.js'
import generarJwt from '../helpers/generar-jwt.js';

// INICIO DE SESIÓN
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const conex = await database();
        const [rows] = await conex.execute('SELECT id, username FROM users WHERE username = ? AND password = ?', [username, password]);

        // Validación de usuario
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = rows[0]; // Accede al primer usuario del array

        // Generar token JWT
        const token = await generarJwt(user.id);

        // Almacenar el token en la sesión del servidor
        req.session.token = token;

        // Almacenar el token en una cookie segura
        res.cookie('authToken', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript
            secure: false, // Cambiar a true en producción con HTTPS
            maxAge: 3600000 // Expiración en milisegundos (1 hora)
        });

        return res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};
export const validateSession = async(req,res) =>{
    console.log(req.user);
    return res.json({ message: 'Acceso permitido a área protegida', user: req.user });

}

export const logoutSession = async(req,res)=>{
        try {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Error al cerrar sesión' });
                }
    
                res.clearCookie('authToken');
                return res.json({ message: 'Cierre de sesión exitoso' });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error Inesperado' });
        }

}




export const RegisterUser = async(req,res)=>{
    const {username, password} = req.body
    try {
        const conex= await database()

        const [userExist] = await conex.execute('SELECT id FROM users WHERE username = ?',[username])
        if(userExist.length>0){
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        const [consulta] = await conex.execute('INSERT INTO users (username, password) VALUES (?,?)',[username, password])

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
    
}
