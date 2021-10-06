import { validate } from "class-validator";
import { Request, Response } from "express"
import { getRepository } from 'typeorm'
import { Offer } from "../entity/Offer";

export const getOffers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const offers = await getRepository(Offer).find({relations: ["career"]});

        if(offers.length > 0) {
            return res.status(200).json(offers);
        } else {
            return res.status(404).json({message: 'Not results'})
        }
    } catch (error) {
        return res.status(400).json({message: 'Bad request!'})
    }
}

export const getOffer = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const offer = await getRepository(Offer).findOneOrFail(id);
        return res.status(200).json(offer);
    } catch (error) {
        return res.status(404).json({message: 'Not results'})
    }
}

export const createOffer = async (req: Request, res: Response): Promise<Response> => {
    const { title, company, location, description, career } = req.body;
    const newOffer = new Offer();

    newOffer.title = title;
    newOffer.company = company;
    newOffer.location = location;
    newOffer.description = description;
    newOffer.career = career;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(newOffer, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        await getRepository(Offer).save(newOffer);
    } catch (error) {
        return res.status(400).json('Bad request!');
    }

    return res.status(200).json({message: 'Offer created!'})
}

export const deleteOffer = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let offer;

    try {
        offer = await getRepository(Offer).findOneOrFail(id);
    } catch (error) {
        return res.status(404).json({message: 'Offer not found'})
    }

    getRepository(Offer).delete(id);
    return res.status(200).json({message: 'Offer deleted!'})
}

export const updateOffer = async (req: Request, res: Response): Promise<Response> =>{
    let existOffer;
    const { id } = req.params;
    const { title, company, location, description, career } = req.body;

    try {
        existOffer = await getRepository(Offer).findOneOrFail(id);
        existOffer.title = title;
        existOffer.company = company;
        existOffer.location = location;
        existOffer.description = description;
        existOffer.career = career;
    } catch (error) {
        return res.status(404).json({message: "Offer not found"});
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(existOffer, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        getRepository(Offer).save(existOffer)
    } catch (error) {
        return res.status(400).json({message: 'Bad Request!'})
    }

    return res.status(200).json({message: 'Offer updated!'});
}