import { Request, response, Response } from "express"
import { getRepository } from 'typeorm'
import config from "../config/config";
import { transporter } from "../config/mailer"
import { User } from "../entity/User";
import Jwt from "jsonwebtoken";
import { validate } from "class-validator";

export const login = async (req: Request, res: Response): Promise<Response> => {
    const {username, password} = req.body;

    if(!(username && password)) {
        return res.status(400).json({message: 'User & Password are required!'})
    }

    let user: User;

    try {
        user = await getRepository(User).findOneOrFail({ where: {user: username}, relations: ["rol"]})
    } catch (error) {
        return res.status(400).json({message: 'Username or password are incorrect!'})
    }

    if(!user.checkPassword(password)) {
        return res.status(400).json({message: 'Username or Password are incorrect'})
    }

    const token = Jwt.sign({ userId: user.id, username: user.username}, config.jwtSecret, { expiresIn: '5m' })
    const refreshtoken = Jwt.sign({ userId: user.id, username: user.username}, config.jwtSecretReset, { expiresIn: config.time })

    user.refreshToken = refreshtoken;

    try {
        await getRepository(User).save(user);
    } catch (error) {
        return res.status(400).json({message: 'Something goes wrong!'})
    }

    return res.send({ message: 'OK', token, refreshtoken });
}

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = res.locals.jwtPayload;
    const { oldPassword, newPassword } = req.body;

    if(!(oldPassword && newPassword)) {
        return res.status(400).json({ message: 'Old password & new password are required' });
    }

    let user: User;

    try {
        user = await getRepository(User).findOneOrFail(userId);
    } catch (error) {
        return res.status(401).json({ message: 'Sometingh goes wrong!' });
    }

    if(!user.checkPassword(oldPassword)) {
        return res.status(401).json({ message: 'Check your old password!' })
    }

    user.password =  newPassword;

    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors);
    }

    user.hashPassword();
    getRepository(User).save(user);

    return res.json({ message: 'Password changed!' })
}

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const username = req.body;

    if (!(username)) {
        return res.status(404).json({message: 'Username is required!'});
    }

    const message = 'Check your email for a link to reset your password'
    let verificationLink;
    let emailStatus = 'OK';
    let user: User;

    try {
        user = await getRepository(User).findOneOrFail({where: {username}});
        const token = Jwt.sign({ userId: user.id, username: user.username}, config.jwtSecretReset, { expiresIn: '10m' });

        verificationLink = `http://localhost:8000/New-Password/${token}`
        user.resetToken =  token;
    } catch (error) {
        return res.status(404).json({message: 'Something goes wrong!'});
    }

    try {
        await transporter.sendMail({
            from: '"Forgot password!" <estancias.estadiasupgopmx@gmail.com>', // sender address
            to: user.username, // list of receivers
            subject: "Forgot password!", // Subject line
            html:
            `<b>Por favor de clic en el siguiente link para completar su proceso</b>
            <a href="${verificationLink}">${verificationLink}</a>`, // html body
        });
    } catch (error) {
        return res.status(400).json({message: 'Something goes wrong!'});
    }

    try {
        await getRepository(User).save(user);
    } catch (error) {
        return res.status(404).json({message: 'Something goes wrong!'})
    }

    return res.send({message, info: emailStatus, user})
}

export const createNewPassword = async (req: Request, res: Response): Promise<Response> => {
    const { newPassword } = req.body;
    const resetToken = req.headers.reset as string;

    if (!(resetToken && newPassword)) {
        return res.status(400).json({message: 'All the fields are required!'})
    }

    let user: User;
    let jwtPayload

    try {
        jwtPayload = Jwt.verify(resetToken, config.jwtSecretReset)
        user = await getRepository(User).findOneOrFail({where: {resetToken}});
    } catch (error) {
        return res.status(400).json({message: 'Something goes wrong!'})
    }

    user.password = newPassword;
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(user, validationOpt);

    if(errors.length > 0) {
        return res.status(400).json(errors);
    }

    try {
        user.hashPassword();
        await getRepository(User).save(user);
    } catch (error) {
        return res.status(401).json({message: 'Something goes wrong!'})
    }

    return res.json({message: 'Password change!'})
}

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.headers.refresh as string;

    if (!(refreshToken)) {
        return res.status(400).json({message: 'Something goes wrong!'})
    }

    let user: User;

    try {
        const verifyResult = Jwt.verify(refreshToken, config.jwtSecretReset);
        const { username } = verifyResult as User;
        user = await getRepository(User).findOneOrFail({where: {username}})
    } catch (error) {
        return res.status(400).json({message: 'Something goes wrong!'})
    }

    const token = Jwt.sign({userId: user.id, username: user.username}, config.jwtSecretReset, {expiresIn: config.time})

    return res.status(200).json({message: 'OK', token});
}