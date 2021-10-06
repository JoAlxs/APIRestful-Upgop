import { validate } from "class-validator";
import { Request, Response } from "express"
import { getRepository } from 'typeorm'
import { Career } from "../entity/Career";

export const getCareers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const careers = await getRepository(Career).find();

        if(careers.length > 0) {
            return res.status(200).json(careers);
        } else {
            return res.status(404).json({message: 'Not results'})
        }
    } catch (error) {
        return res.status(400).json({message: 'Bad request!'})
    }
}

export const getCareer = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const career = await getRepository(Career).findOneOrFail(id);
        return res.status(200).json(career);
    } catch (error) {
        return res.status(404).json({message: 'Not results'})
    }
}

export const createCareer = async (req: Request, res: Response): Promise<Response> => {
    const { name, acronym } = req.body;
    const newCareer = new Career();

    newCareer.name = name;
    newCareer.acronym = acronym;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(newCareer, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        await getRepository(Career).save(newCareer);
    } catch (error) {
        return res.status(400).json('Bad request!');
    }

    return res.status(200).json({message: 'Career created!'})
}

export const deleteCareer = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let career;

    try {
        career = await getRepository(Career).findOneOrFail(id);
    } catch (error) {
        return res.status(404).json({message: 'Career not found'})
    }

    getRepository(Career).delete(id);
    return res.status(200).json({message: 'Career deleted!'})
}

export const updateCareer = async (req: Request, res: Response): Promise<Response> =>{
    let existCareer;
    const { id } = req.params;
    const { name, acronym } = req.body;

    try {
        existCareer = await getRepository(Career).findOneOrFail(id);
        existCareer.name = name;
        existCareer.acronym = acronym;
    } catch (error) {
        return res.status(404).json({message: "Career not found"});
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(existCareer, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        getRepository(Career).save(existCareer)
    } catch (error) {
        return res.status(400).json({message: 'Bad Request!'})
    }

    return res.status(200).json({message: 'Career updated!'});
}