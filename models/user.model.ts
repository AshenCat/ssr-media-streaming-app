import mongoose from "mongoose";
import CONSTANTS from "../lib/constants";
import { Password } from "../lib/services/password";


interface UserAttrs {
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName:string,    
}

interface UserDoc extends mongoose.Document {
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName:string,
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 60
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        min: 6,
        max: 60
    },
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    plan: {
        type: {
            type: String,
            enum: CONSTANTS.USER_PLANS,
            default: 'FREE'
        },
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

const User = mongoose.models['User'] || mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
export type {UserDoc};