import type { NextApiRequest, NextApiResponse } from 'next'
import api405 from '../../lib/errors/api-405';

type Data = {
    name: string
}

export default function index (req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return res.status(200).send('Media Streaming App v0.0.0');
        default:
            return api405(req, res);
    }
}