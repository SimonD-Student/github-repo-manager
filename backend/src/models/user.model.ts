import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript pour l'autocomplétion
export interface IUser extends Document {
    email: string;
    passwordHash: string;
    githubTokenEncrypted: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    githubTokenEncrypted: {
        type: String,
        default: null
    }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);