import { validate } from "class-validator";
import { Request, Response } from "express"
import { getRepository } from 'typeorm'
import { Permission } from "../entity/Permission";

export const getPermissions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const permissions = await getRepository(Permission).find();

        if(permissions.length > 0) {
            return res.status(200).json(permissions);
        } else {
            return res.status(404).json({message: 'Not results'})
        }
    } catch (error) {
        return res.status(400).json({message: 'Bad request!'})
    }
}

export const getPermission = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const permission = await getRepository(Permission).findOneOrFail(id);
        return res.status(200).json(permission);
    } catch (error) {
        return res.status(404).json({message: 'Not results'})
    }
}

export const createPermission = async (req: Request, res: Response): Promise<Response> => {
    const { name, description } = req.body;
    const newPermission = new Permission();

    newPermission.name = name;
    newPermission.description = description;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(newPermission, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        await getRepository(Permission).save(newPermission);
    } catch (error) {
        return res.status(400).json('Bad request!');
    }

    return res.status(200).json({message: 'Permission created!'})
}

export const deletePermission = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let permission;

    try {
        permission = await getRepository(Permission).findOneOrFail(id);
    } catch (error) {
        return res.status(404).json({message: 'Permission not found'})
    }

    getRepository(Permission).delete(id);
    return res.status(200).json({message: 'Permission deleted!'})
}

export const updatePermission = async (req: Request, res: Response): Promise<Response> =>{
    let existPermission;
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        existPermission = await getRepository(Permission).findOneOrFail(id);
        existPermission.name = name;
        existPermission.description = description;
    } catch (error) {
        return res.status(404).json({message: "Permission not found"});
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(existPermission, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        getRepository(Permission).save(existPermission)
    } catch (error) {
        return res.status(400).json({message: 'Bad Request!'})
    }

    return res.status(200).json({message: 'Permission updated!'});
}