import type { NextApiRequest, NextApiResponse } from 'next';
// import { morganAccessErrorLogging, morganAccessLogging, morganLogging } from './morgan.middleware';
import { createWriteStream } from 'fs';
import morgan from 'morgan';
import path from 'path';
import { createStream } from 'rotating-file-stream';

export async function inlineMiddleware(req: NextApiRequest, res: NextApiResponse, middlewares: Array<any>) {

    const promises = middlewares.reduce((acc: any, middleware: Function) => {
        const promise = new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => result instanceof Error ? reject(result) : resolve(result));
        });
        return [...acc, promise];
    }, []);

    return await Promise.all(promises);

    // new Promise((resolve, reject) => {
    //     fn(req, res, (result: any) => {
    //         if (result instanceof Error) {
    //             return reject(result)
    //         }
    //         return resolve(result)
    //     })
    // })
}

export default function withMiddleware(next: Function) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            if (!process.env.JWT_KEY) {
                throw new Error('INIT ERROR: server JWT_KEY must be defined')
            }
            let accessErrorStrem = createStream('access_error.log', {
                interval: '1d', // rotate daily
                // path: path.join(__dirname, 'logs')
                path: './logs'
            })
            let accessLogStream = createWriteStream('./logs/access.log', { flags: 'a' });
            // creates a list of middlewares (not required, but also filters any conditional 
            // middlewares based upon current ENV)
            const middlewares = [
                morgan('combined', { stream: accessErrorStrem, skip: function (req, res) { return res.statusCode < 400 } }),
                morgan('combined', { stream: accessLogStream }),
                morgan('combined'),
            ].filter(Boolean);

            // each middleware will then be wrapped within its own promise
            const promises = middlewares.reduce((acc: any, middleware: Function) => {
                const promise = new Promise((resolve, reject) => {
                    middleware(req, res, (result: any) => result instanceof Error ? reject(result) : resolve(result));
                });
                return [...acc, promise];
            }, []);
            // promised middlewares get asynchronously resolved (this may need to be switched to a synchronous 
            // loop if a certain middleware function needs to be resolved before another)
            await Promise.all(promises);

            // returns the next wrapped function(s) to be executed (can be an API route or another additional middleware)
            return next(req, res);
        } catch (error) {
            // if any middleware fails, throws a 400 error
            return res.status(400).send(error);
        }

    }
}