import { Router } from 'express'
import { getOffers, getOffer, createOffer, deleteOffer, updateOffer } from '../controllers/offer.controller'
import { checkJwt } from '../middlewares/jwt'

const router = Router()

router.get("/Offers", getOffers)
router.get("/Offers/:id", getOffer)
router.post("/Offers", [checkJwt], createOffer)
router.put("/Offers/:id", [checkJwt], updateOffer)
router.delete("/Offers/:id", [checkJwt], deleteOffer)

export default router