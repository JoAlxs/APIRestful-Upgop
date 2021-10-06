import { Router } from 'express'
import { getUsers, getUser, createUser, deleteUser, updateUser } from '../controllers/user.controller'
import { checkJwt } from '../middlewares/jwt'

const router = Router()

router.get("/Users", [checkJwt],  getUsers)
router.get("/Users/:id", [checkJwt], getUser)
router.post("/Users", [checkJwt], createUser)
router.put("/Users/:id", [checkJwt], updateUser)
router.delete("/Users/:id", [checkJwt], deleteUser)

export default router