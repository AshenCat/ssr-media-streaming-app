import { NextApiRequest, NextApiResponse } from "next";

export default function api422(req: NextApiRequest, res: NextApiResponse, errors?: Array<any>) {
    return res.status(422).json({
        status: 'ERROR',
        errors: errors?.map((err: {msg: any, param: any}) => ({
            msg: err.msg, field: err.param
        }))
    })
}