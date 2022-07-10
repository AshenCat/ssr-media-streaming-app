import type { NextApiRequest, NextApiResponse } from 'next'
import userDao from '../../../lib/API/dao/user.dao';
import api404 from '../../../lib/API/errors/api-404';
import api405 from '../../../lib/API/errors/api-405';
import api501 from '../../../lib/API/errors/api-501';
import withMiddleware, { inlineMiddleware } from '../../../lib/API/middlewares';
import dbConnect from '../../../lib/API/services/dbConnect'
import { UserDoc } from '../../../lib/API/models/user.model';

type Data = {
    status: string,
    user: UserDoc
}

async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    // await inlineMiddleware(req, res, [corsMiddleware()]);
    switch (req.method) {
        case 'GET':
            await dbConnect();
            const {id} = req.query;
            const user = await userDao.findUser({_id: id}, {}, {});
            if (user instanceof Error) return api404(req, res);
            return res.status(200).json({status: 'SUCCESS', user: user});
        case 'PATCH':
            return api501(req, res);
        default:
            return api405(req, res);
    }
}

export default withMiddleware(handler)