import Cors from 'cors';
import { NextApiResponse, NextApiRequest } from 'next';

export function corsMiddleware(setting: object = {}) {
    return Cors(setting)
}


const withCors = (next: Function) => (req: NextApiRequest, res: NextApiResponse) => {
    new Promise((resolve, reject) => {
        Cors({})(req, res, (result: any) => result instanceof Error ? reject(result) : resolve(result));
    });
    return next(req, res)
}

export default withCors;