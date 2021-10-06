import { Router } from 'express'
import { getRoles, getRole, createRole, deleteRole, updateRole } from '../controllers/role.controller'
import { checkJwt } from '../middlewares/jwt'

const router = Router()

router.get("/Roles", [checkJwt], getRoles)
router.get("/Roles/:id", [checkJwt], getRole)
router.post("/Roles", [checkJwt], createRole)
router.put("/Roles/:id", [checkJwt], updateRole)
router.delete("/Roles/:id", [checkJwt], deleteRole)

export default router