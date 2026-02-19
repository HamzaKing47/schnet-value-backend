import express from 'express';
import { body } from 'express-validator';
import { submitContact } from '../controllers/contact.controller.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

const contactValidation = [
  body('name').notEmpty().withMessage('Name ist erforderlich'),
  body('email').isEmail().withMessage('Ungültige E-Mail-Adresse').normalizeEmail(),
  body('subject').notEmpty().withMessage('Betreff ist erforderlich'),
  body('message').notEmpty().withMessage('Nachricht ist erforderlich'),
  body('company').optional().trim(),
  body('phone').optional().trim(),
];

router.post('/contact', validate(contactValidation), submitContact);

export default router;