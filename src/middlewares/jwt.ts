import { Request, Response, NextFunction } from 'express'
import Jwt from 'jsonwebtoken'
import config from '../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['auth'];
    let jwtPayload

    try {
        jwtPayload = <any>Jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload
    } catch (error) {
        return res.status(401).json({ message: 'Not Authorized!'});
    }

    const { userId, username } = jwtPayload;
    const newToken = Jwt.sign({ userId, username }, config.jwtSecret, { expiresIn: config.time })

    res.setHeader('token', newToken);

    next();
}