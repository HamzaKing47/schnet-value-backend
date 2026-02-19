import express from 'express';
import { body } from 'express-validator';
import { register, login, verifyToken, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Register validation
const registerValidation = [
  body('firstName').notEmpty().withMessage('Vorname ist erforderlich'),
  body('lastName').notEmpty().withMessage('Nachname ist erforderlich'),
  body('email').isEmail().withMessage('Ungültige E-Mail-Adresse').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Passwort muss mindestens 8 Zeichen lang sein'),
  body('company').optional().trim(),
  body('phone').optional().trim(),
];

router.post('/register', validate(registerValidation), register);

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Ungültige E-Mail-Adresse').normalizeEmail(),
  body('password').notEmpty().withMessage('Passwort ist erforderlich'),
];

router.post('/login', validate(loginValidation), login);

router.get('/verify', verifyToken);

// Forgot password validation
const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Ungültige E-Mail-Adresse').normalizeEmail(),
];

router.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);

// Reset password validation
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token fehlt'),
  body('newPassword').isLength({ min: 8 }).withMessage('Passwort muss mindestens 8 Zeichen lang sein'),
];

router.post('/reset-password', validate(resetPasswordValidation), resetPassword);

export default router;