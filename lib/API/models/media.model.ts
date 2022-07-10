import mongoose from "mongoose";

interface MediaDoc extends mongoose.Document {
    localPath: string,
    uploadPath: string,
    originalFileName: string,
    metaData: object,
}


const mediaSchema = new mongoose.Schema({
    localPath: {
        type: String,
    },
    uploadPath: {
        type: String
    },
    originalFileName: {
        type: String,
        required: true,
        unique: true,
    },
    metaData: Object
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

const User = mongoose.models['User'] || mongoose.model<MediaDoc>('User', mediaSchema);

export default User;
export type {MediaDoc};