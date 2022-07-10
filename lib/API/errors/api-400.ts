import { NextApiRequest, NextApiResponse } from "next";

export default function api400(req: NextApiRequest, res: NextApiResponse, message?: string) {
    return res.status(400).json({
        status: 'ERROR',
        errors: [{msg: message}]
    })
}