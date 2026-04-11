const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

export const validateAuthForm = (mode, formData) => {
  if (mode === 'register') {
    if (normalizeText(formData.name).length < 3 || normalizeText(formData.name).length > 80) {
      return 'Full name must be between 3 and 80 characters.';
    }
  }

  if (!EMAIL_REGEX.test(normalizeText(formData.email))) {
    return 'Please enter a valid email address.';
  }

  if (String(formData.password || '').length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (!['student', 'admin'].includes(formData.role)) {
    return 'Please select a valid role.';
  }

  return '';
};

export const validateFeeForm = (formState) => {
  const title = normalizeText(formState.title);
  const roomFlowBasis = normalizeText(formState.roomFlowBasis);
  const utilityType = normalizeText(formState.utilityType);
  const description = normalizeText(formState.description);
  const amount = Number(formState.amount);
  const lateFeeAmount = Number(formState.lateFeeAmount || 0);

  if (title.length < 3 || title.length > 120) {
    return 'Fee title must be between 3 and 120 characters.';
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Amount must be greater than 0.';
  }

  if (!formState.dueDate || Number.isNaN(new Date(formState.dueDate).getTime())) {
    return 'Please select a valid due date.';
  }

  if (!Number.isFinite(lateFeeAmount) || lateFeeAmount < 0) {
    return 'Late payment amount cannot be negative.';
  }

  if (formState.category === 'room_flow' && (roomFlowBasis.length < 3 || roomFlowBasis.length > 120)) {
    return 'Room-flow basis must be between 3 and 120 characters.';
  }

  if (formState.category === 'utilities' && (utilityType.length < 3 || utilityType.length > 80)) {
    return 'Utility type must be between 3 and 80 characters.';
  }

  if (description && (description.length < 5 || description.length > 500)) {
    return 'Description must be between 5 and 500 characters when provided.';
  }

  return '';
};

export const validateBankSlipPayment = ({ reference, file }) => {
  const normalizedReference = normalizeText(reference);

  if (normalizedReference.length < 3 || normalizedReference.length > 80) {
    return 'Reference number must be between 3 and 80 characters.';
  }

  if (!file) {
    return 'Payment proof is required.';
  }

  return '';
};
