import { sendEmail } from '../services/email.service.js';

export const submitContact = async (req, res) => {
  const { name, email, company, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Bitte alle Pflichtfelder ausfüllen' });
  }

  try {
    // Send email to admin
    await sendEmail({
      to: process.env.CONTACT_EMAIL || 'info@immobilienbewertung.de',
      subject: `Kontaktformular: ${subject}`,
      text: `
Name: ${name}
E-Mail: ${email}
Unternehmen: ${company || '-'}
Telefon: ${phone || '-'}
Betreff: ${subject}
Nachricht:
${message}
      `,
    });

    // Optionally send auto-reply to user
    await sendEmail({
      to: email,
      subject: 'Ihre Nachricht an Immobilienbewertung',
      text: `Hallo ${name},\n\nvielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.\n\nIhr Team von Immobilienbewertung`,
    });

    res.json({ success: true, message: 'Nachricht gesendet' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ error: 'Nachricht konnte nicht gesendet werden' });
  }
};