function validateRegistration({ name, email, phone, photoType }) {
  const errors = [];
  if (!name || !name.trim()) errors.push('Full name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) errors.push('Enter a valid email address.');
  const digits = (phone || '').replace(/[\s+-]/g, '').replace(/^91(?=\d{10}$)/, '');
  if (!/^\d{10}$/.test(digits)) errors.push('Enter a valid 10-digit phone number.');
  if (!/^image\//.test(photoType || '')) errors.push('Upload a passport-size photo (image file).');
  return errors;
}
if (typeof module !== 'undefined') module.exports = { validateRegistration };
