import User from "../../models/user.model";
import CONSTANTS from "../constants";

const userDaoError = (err: any, fnName: string) => {
    console.error(`userDaoError: ${fnName}:`, err)
    return err;
}

const userDao = {
    findUsers: async (match: object, project: object = {}, options: object = {}) => {
        try {
            const users = await User.find(match, {...project, ...CONSTANTS.USER_SAFE_PROJECTION}, options);
            return users;
        } catch(err) {
            return userDaoError(err, 'findUsers')
        }
    },
    findUser: async (match: object, project: object, options: object = {}) => {
        try {
            const users = await User.findOne(match, {...project, ...CONSTANTS.USER_SAFE_PROJECTION}, options);
            return users;
        } catch(err) {
            return userDaoError(err, 'findUser')
        }
    },
    createUser: async (attributes: {[key: string]: any}) => {
        try {
            const userAttrs = {
                ...attributes,
                plan: {
                    type: 'FREE'
                }
            }
            const user = await User.create(userAttrs);
            return user
        } catch (err) {
            return userDaoError(err, 'createUser')
        }
    }
}

export default userDao