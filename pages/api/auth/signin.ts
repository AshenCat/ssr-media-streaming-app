import { check, oneOf, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next'
import api400 from '../../../lib/errors/api-400';
import api404 from '../../../lib/errors/api-404';
import api405 from '../../../lib/errors/api-405';
import withMiddleware, { inlineMiddleware } from '../../../lib/middlewares';
import withCors from '../../../lib/middlewares/cors.middleware';
import validateBodyMiddleware from '../../../lib/middlewares/validate-body.middleware';
import dbConnect from '../../../lib/services/dbConnect'
import { Password } from '../../../lib/services/password';
import User, { UserDoc } from '../../../models/user.model';

type Data = {
    status: string,
    user: UserDoc
}

async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            await dbConnect();
            await inlineMiddleware(req, res, [
                validateBodyMiddleware([
                    oneOf([
                        check('email').exists().isString(),
                        check('username').exists().isString()
                    ], 'email or username is required'),
                    check('password', 'password is required').trim().notEmpty()
                ], validationResult)]);
                
            const {email, username, password} = req.body;

            const user = await User.findOne({$or: [
                {email: email},
                {username: username},
            ]});

            if (!user || user instanceof Error) return api404(req, res);

            const passwordsMatch = await Password.compare(user.password, password)
            if (!passwordsMatch) return api400(req, res, 'Invalid Credentials');

            const userJwt = jwt.sign({
                id: user.id,
                email: user.email,
            }, process.env.JWT_KEY!)

            req.session = {jwt: userJwt}

            return res.status(200).json({status: 'SUCCESS', user: user});
        default:
            return api405(req, res);
    }
}

export default withMiddleware(withCors(handler))