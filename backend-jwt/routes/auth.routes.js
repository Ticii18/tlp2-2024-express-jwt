import {Router} from 'express'
import { login, logoutSession, validateSession } from '../controllers/auth.controller.js'
import validarJwt from '../middlewares/validar-jwt.js'

const router = Router()

router.post("/login", login)
router.get("/session",validarJwt , validateSession)
router.post("/logout", logoutSession)

export default router

