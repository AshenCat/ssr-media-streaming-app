import { NextApiRequest, NextApiResponse } from "next";

export default function api404(req: NextApiRequest, res: NextApiResponse) {
    return res.status(404).json({
        status: 'ERROR',
        errors: [{msg: 'RESOURCE NOT FOUND'}]
    })
}