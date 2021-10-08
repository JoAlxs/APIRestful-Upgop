import { Router } from 'express'
import { login, changePassword, forgotPassword, createNewPassword, refreshToken } from '../controllers/auth.controller'
import { checkJwt } from '../middlewares/jwt'

const router = Router()

router.post("/Login", login)
router.post("/Change-Password", changePassword)
router.post("/Refresh-Token", refreshToken)
router.put("/Forgot-Password", forgotPassword)
router.put("/New-Password", createNewPassword)

export default router