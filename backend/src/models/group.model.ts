import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
    courseId: mongoose.Types.ObjectId;
    name: string;
    repoUrl: string;
    members: Array<{
        fullName: string;
        githubId: string;
    }>;
}

const groupSchema = new Schema<IGroup>({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true },
    repoUrl: { type: String, required: true },
    members: [{
        fullName: { type: String, required: true },
        githubId: { type: String, required: true }
    }]
}, { timestamps: true });

export const Group = mongoose.model<IGroup>('Group', groupSchema);