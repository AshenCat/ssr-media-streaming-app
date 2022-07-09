import type { NextApiRequest, NextApiResponse } from 'next'
import userDao from '../../../lib/dao/user.dao';
import api400 from '../../../lib/errors/api-400';
import api405 from '../../../lib/errors/api-405';
import withMiddleware from '../../../lib/middlewares';
import withAuth from '../../../lib/middlewares/auth.middleware';
import withCors from '../../../lib/middlewares/cors.middleware';
import dbConnect from '../../../lib/services/dbConnect';

type Data = {
    status: string,
    user: any
}

async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            await dbConnect();
            const user = userDao.findUser({_id: req.currentUser.id}, {} ,{});
            if (user instanceof Error) api400(req, res, 'Bad request');
            return res.status(200).json({status: 'SUCCESS', user: user})
        default:
            return api405(req, res);
    }
}

export default withMiddleware(withCors(withAuth(handler)))