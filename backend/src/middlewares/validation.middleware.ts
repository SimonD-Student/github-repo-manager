import Joi from 'joi';
import type { Request, Response, NextFunction } from 'express';

export const validateSchema = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ message: `Erreur de validation : ${errorMessage}` });
        }

        next();
    };
};

export const courseInfoSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).required()
});

export const courseConfigSchema = Joi.object({
    githubOrganization: Joi.string().allow('', null),
    minContributors: Joi.number().integer().min(1).required(),
    maxContributors: Joi.number().integer().min(Joi.ref('minContributors')).required(),
    repoNameFormat: Joi.string().required()
});

export const joinGroupSchema = Joi.object({
    participants: Joi.array().items(
        Joi.object({
            fullName: Joi.string().min(2).required(),
            githubId: Joi.string().min(1).required()
        })
    ).min(1).required()
});