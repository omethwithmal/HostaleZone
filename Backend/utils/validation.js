const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.normalizeText = (value) =>
  typeof value === 'string' ? value.trim() : '';

exports.isValidEmail = (email) => EMAIL_REGEX.test(normalizeText(email));

exports.isPositiveNumber = (value) =>
  Number.isFinite(Number(value)) && Number(value) > 0;

exports.isNonNegativeNumber = (value) =>
  Number.isFinite(Number(value)) && Number(value) >= 0;

exports.isValidDateInput = (value) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

exports.hasLengthBetween = (value, min, max) => {
  const text = normalizeText(value);
  return text.length >= min && text.length <= max;
};
