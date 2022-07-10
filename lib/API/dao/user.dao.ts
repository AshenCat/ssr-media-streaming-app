import User, { UserDoc } from "../models/user.model";
import CONSTANTS from "../../constants";
import { Types } from "mongoose";

const userDaoError = (err: any, fnName: string): Error => {
    console.error(`userDaoError: ${fnName}:`, err)
    return err;
}

const userDao = {
    findUsers: async (match: object, project: object = {}, options: object = {}): Promise<any> => {
        try {
            return await User.find(match, {...project, ...CONSTANTS.USER_SAFE_PROJECTION}, options);
        } catch(err) {
            return userDaoError(err, 'findUsers')
        }
    },
    findUser: async (match: object, project: object, options: object = {}): Promise<any> => {
        try {
            return await User.findOne(match, {...project, ...CONSTANTS.USER_SAFE_PROJECTION}, options);
        } catch(err) {
            return userDaoError(err, 'findUser')
        }
    },
    createUser: async (attributes: {[key: string]: any}): Promise<any> => {
        try {
            const userAttrs = {
                ...attributes,
                plan: {
                    type: 'FREE'
                }
            }
            return await User.create(userAttrs);
        } catch (err) {
            return userDaoError(err, 'createUser')
        }
    }
}

export default userDao