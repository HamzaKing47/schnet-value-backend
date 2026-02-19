import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/auth.middleware.js';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.use(protect); // All routes below require authentication

// Update profile validation
const updateProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('Vorname darf nicht leer sein'),
  body('lastName').optional().notEmpty().withMessage('Nachname darf nicht leer sein'),
  body('company').optional().trim(),
  body('phone').optional().trim(),
];

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileValidation), updateProfile);

// Change password validation
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Aktuelles Passwort ist erforderlich'),
  body('newPassword').isLength({ min: 8 }).withMessage('Neues Passwort muss mindestens 8 Zeichen lang sein'),
];

router.put('/password', validate(changePasswordValidation), changePassword);

export default router;