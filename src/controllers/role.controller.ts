import { validate } from "class-validator"
import { Request, Response } from "express"
import { getRepository } from 'typeorm'
import { Role } from '../entity/Role'

export const getRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const roles = await getRepository(Role).find({relations: ["permissions"]});

        if(roles.length > 0) {
            return res.status(200).json(roles);
        } else {
            return res.status(404).json({message: 'Not results'})
        }
    } catch (error) {
        return res.status(400).json({message: 'Bad request!'})
    }
}

export const getRole = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const role = await getRepository(Role).findOneOrFail(id, {relations: ["permissions"]});
        return res.status(200).json(role);
    } catch (error) {
        return res.status(404).json({message: 'Not results'})
    }
}

export const createRole = async (req: Request, res: Response): Promise<Response> => {
    const { name, description, isActive, permissions } = req.body;
    const newRole = new Role();

    newRole.name = name;
    newRole.description = description;
    newRole.isActive = isActive;
    newRole.permissions = permissions

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(newRole, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        await getRepository(Role).save(newRole);
    } catch (error) {
        return res.status(400).json('Bad request!');
    }

    return res.status(200).json({message: 'Role created!'})
}

export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let role;

    try {
        role = await getRepository(Role).findOneOrFail(id);
    } catch (error) {
        return res.status(404).json({message: 'Role not found'})
    }

    getRepository(Role).delete(id);
    return res.status(200).json({message: 'Role deleted!'})
}

export const updateRole = async (req: Request, res: Response): Promise<Response> =>{
    let existRole;
    const { id } = req.params;
    const { name, description, isActive, permissions } = req.body;

    try {
        existRole = await getRepository(Role).findOneOrFail(id);
        existRole.name = name;
        existRole.description = description;
        existRole.isActive = isActive;
        existRole.permissions = permissions;

    } catch (error) {
        return res.status(404).json({message: "Role not found"});
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(existRole, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        getRepository(Role).save(existRole)
    } catch (error) {
        return res.status(400).json({message: 'Bad Request!'})
    }

    return res.status(200).json({message: 'Role updated!'});
}