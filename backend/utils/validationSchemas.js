import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special character.'
    }),
  // MODIFICATION: Removed 'role' from the signup validation schema.
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const storeSchema = Joi.object({
  name: Joi.string().min(1).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  owner_id: Joi.number().integer().required(),
});

export const ratingSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});

// MODIFICATION: Add a new schema for admin user creation
export const adminCreateUserSchema = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string().min(8).max(16).required(),
  role: Joi.string().valid('admin', 'normal', 'owner').required()
});