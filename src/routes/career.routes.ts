import { Router } from 'express'
import { getCareers, getCareer, createCareer, deleteCareer, updateCareer } from '../controllers/career.controller'
import { checkJwt } from '../middlewares/jwt'

const router = Router()

router.get("/Careers", [checkJwt], getCareers)
router.get("/Careers/:id", [checkJwt], getCareer)
router.post("/Careers", [checkJwt], createCareer)
router.put("/Careers/:id", [checkJwt], updateCareer)
router.delete("/Careers/:id", [checkJwt], deleteCareer)

export default router