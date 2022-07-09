import { check, validationResult } from 'express-validator';
import type { NextApiRequest, NextApiResponse } from 'next'
import userDao from '../../../lib/dao/user.dao';
import api500 from '../../../lib/errors/api-500';
import withMiddleware, {inlineMiddleware} from '../../../lib/middlewares';
// import { morganAccessErrorLogging, morganAccessLogging } from '../../../lib/middlewares/morgan.middleware';
import validateBodyMiddleware from '../../../lib/middlewares/validate-body.middleware';
import dbConnect from '../../../lib/services/dbConnect';
import jwt from 'jsonwebtoken'
import withCors from '../../../lib/middlewares/cors.middleware';
import api405 from '../../../lib/errors/api-405';

interface IResponse {
    status: string,
    payload: any,
    hasNext?: boolean 
}

const handler = async (req: NextApiRequest, res: NextApiResponse<IResponse>)  => {
    switch(req.method) {
        case 'GET':
            await dbConnect();
            const users = await userDao.findUsers({}, {}, { sortBy: {createdAt: -1} });
            return res.status(200).json({status: 'SUCCESS', payload: users});

        case 'PUT':
            await dbConnect();
            
            await inlineMiddleware(req, res, [
                validateBodyMiddleware([
                    check('firstName').trim().isString().notEmpty().withMessage('firstName must be provided.'),
                    check('lastName').trim().isString().notEmpty().withMessage('lastName must be provided.'),
                    check('password').trim().isLength({min: 6, max: 60}).withMessage('password must be between 4 and 20 characters'),
                    check('email').isEmail().withMessage('email must be valid'),
                    check('username', 'username must: not have any symbols, atleast 3 characters, and up-to 14 characters').trim().isString().notEmpty().matches(/^(\d|\w)+$/)
                ], validationResult)]);

            const user = await userDao.createUser(req.body);

            const userJwt = jwt.sign({
                id: user.id,
                email: user.email
            }, process.env.JWT_KEY!);

            req.session = {jwt: userJwt}

            if (user instanceof Error) return api500(req, res, user);

           return res.status(201).json({status:'SUCCESS', payload: user});
        default:
            return api405(req, res);
    }
}

export default withMiddleware(withCors(handler))