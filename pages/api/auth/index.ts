import type { NextApiRequest, NextApiResponse } from 'next'
import userDao from '../../../lib/API/dao/user.dao';
import api400 from '../../../lib/API/errors/api-400';
import api405 from '../../../lib/API/errors/api-405';
import withMiddleware from '../../../lib/API/middlewares';
import withCors from '../../../lib/API/middlewares/cors.middleware';
import dbConnect from '../../../lib/API/services/dbConnect';

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

export default withMiddleware(withCors(handler))