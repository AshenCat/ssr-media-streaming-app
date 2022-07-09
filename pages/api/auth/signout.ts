
import type { NextApiRequest, NextApiResponse } from 'next'
import api405 from '../../../lib/errors/api-405';
import withMiddleware from '../../../lib/middlewares';
import withCors from '../../../lib/middlewares/cors.middleware';

type Data = {
    status: string,
}

async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            req.session = null

            return res.status(200).json({status: 'SUCCESS'});
        default:
            return api405(req, res);
    }
}

export default withMiddleware(withCors(handler))