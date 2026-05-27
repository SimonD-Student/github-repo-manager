import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // --- NOUVEAUX CHAMPS DE CONFIGURATION ---
    githubOrganization: { type: String, default: '' },
    minContributors: { type: Number, default: 2 },
    maxContributors: { type: Number, default: 4 },
    repoNameFormat: { type: String, default: 'Groupe{XX}' },
    participationUrl: { type: String, default: '' }, // Sera générée plus tard
    currentGroupCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);