import { Router } from 'express'
import { getPermissions, getPermission, createPermission, deletePermission, updatePermission } from '../controllers/permission.controller'
import { checkJwt } from '../middlewares/jwt'

const router = Router()

router.get("/Permissions", [checkJwt], getPermissions)
router.get("/Permissions/:id", [checkJwt], getPermission)
router.post("/Permissions", [checkJwt], createPermission)
router.put("/Permissions/:id", [checkJwt], updatePermission)
router.delete("/Permissions/:id", [checkJwt], deletePermission)

export default router