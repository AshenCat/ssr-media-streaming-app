import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ICurrentUser } from '../../@types/next';
import api401 from '../errors/api-401';

export default jwtMiddleware;

function jwtMiddleware(req: NextApiRequest, res: NextApiResponse) {
    return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
        try {
            if (!req.headers["x-access-token"] || req.headers["x-access-token"] === '' || !req.headers["x-access-token"].toString().startsWith('Bearer ')) {
                return api401(req, res)
            }
            let auth: string = "";
            if (Array.isArray(req.headers["x-access-token"])) auth = req.headers["x-access-token"].join(' ');
            else auth = req.headers["x-access-token"].slice(7);
            const decoded = await jwt.verify(auth, process.env.JWT_KEY!) as ICurrentUser;
            if (new Date(decoded.exp * 1000) <= new Date()) {
                return api401(req, res)
            }
            req.currentUser = decoded;
            next();
        } catch (err) {
            return api401(req, res)
        }
    }
}