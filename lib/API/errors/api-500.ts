import { NextApiRequest, NextApiResponse } from "next";

export default function api500(req: NextApiRequest, res: NextApiResponse, error?: any) {
    
    return res.status(500).json({
        status: 'ERROR',
        errors: [error]
    })
}