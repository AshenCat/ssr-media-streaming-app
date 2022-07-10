import { NextApiRequest, NextApiResponse } from "next";
import api422 from "../errors/api-422";

export default function validateBodyMiddleware(validations: Array<any>, validationResult: any) {
    return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
        await Promise.all(validations.map(validation => validation.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next();
        }

        return api422(req, res, errors.array())
    }
}