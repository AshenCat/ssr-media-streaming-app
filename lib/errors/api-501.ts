import { NextApiRequest, NextApiResponse } from "next";

export default function api501(req: NextApiRequest, res: NextApiResponse, error?: any) {
    
    return res.status(501).json({
        status: 'ERROR',
        errors: [{msg: 'SERVICE UNAVAILABLE'}]
    })
}