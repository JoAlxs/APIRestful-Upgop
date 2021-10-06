import { Request, Response } from "express"
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { User } from '../entity/User'

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await getRepository(User).find({ relations: ["rol"] });

        if(users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({message: 'Not results'})
        }
    } catch (error) {
        return res.status(400).json({message: 'Bad request!'})
    }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const user = await getRepository(User).findOneOrFail(id, {relations: ["rol"]});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({message: 'Not results'})
    }
}

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    const { name, lastname, username, password, rol } = req.body;
    const newUser = new User();

    newUser.name = name;
    newUser.lastname = lastname;
    newUser.username = username;
    newUser.password = password;
    newUser.rol = rol;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(newUser, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        newUser.hashPassword();
        await getRepository(User).save(newUser);
    } catch (error) {
        return res.status(400).json('Bad request!');
    }

    return res.status(200).json({message: 'User created!'})
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let user;

    try {
        user = await getRepository(User).findOneOrFail(id);
    } catch (error) {
        return res.status(404).json({message: 'User not found'})
    }

    getRepository(User).delete(id);
    return res.status(200).json({message: 'User deleted!'})
}

export const updateUser= async (req: Request, res: Response): Promise<Response> =>{
    let existUser;
    const { id } = req.params;
    const { username, password, rol } = req.body;

    try {
        existUser = await getRepository(User).findOneOrFail(id);
        existUser.username = username;
        existUser.password = password;
        existUser.rol = rol;
    } catch (error) {
        return res.status(404).json({message: "User not found"});
    }

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(existUser, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    try {
        existUser.hashPassword();
        getRepository(User).save(existUser)
    } catch (error) {
        return res.status(409).json({message: 'Username already in use!'})
    }

    return res.status(200).json({message: 'User updated!'});
}