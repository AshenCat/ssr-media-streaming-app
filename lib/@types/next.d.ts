import {IncomingMessage} from 'http';

declare module 'next' {
    export interface NextApiRequest extends IncomingMessage {
        session: {
            jwt: string
        } | null,
        currentUser: {
            id: string,
            email: string,
            username: string
        }
    }
}

export interface ICurrentUser {
    id: string,
    email: string,
    username: string
}