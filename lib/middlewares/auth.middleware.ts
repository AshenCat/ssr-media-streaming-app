import { NextApiResponse, NextApiRequest } from "next"
import jwt from 'jsonwebtoken'
import { ICurrentUser } from "../@types/next";

const withAuth = (next: Function) => (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.session?.jwt) return next(req, res);
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as ICurrentUser;
        req.currentUser = payload
    } catch(err) {
        console.error(err)
    } finally {
        return next(req, res)
    }
}

export default withAuth