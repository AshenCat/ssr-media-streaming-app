import { NextApiRequest, NextApiResponse } from "next";

export default function api401(req: NextApiRequest, res: NextApiResponse) {
    return res.status(401).json({
        status: 'ERROR',
        errors: [{msg: 'UNAUTHORIZED'}]
    })
}