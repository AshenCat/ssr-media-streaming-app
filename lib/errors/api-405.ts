import { NextApiRequest, NextApiResponse } from "next";

export default function api405(req: NextApiRequest, res: NextApiResponse) {
    return res.status(405).json({
        status: 'ERROR',
        errors: [{msg: `${req.method} METHOD NOT ALLOWED`}]
    })
}