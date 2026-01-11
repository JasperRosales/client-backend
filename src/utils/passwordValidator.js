import validator from 'validator';

export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (!validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })) {
    errors.push('Password must contain at least one lowercase letter');
    errors.push('Password must contain at least one uppercase letter');
    errors.push('Password must contain at least one number');
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};


export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Password confirmation is required' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: null };
};


export const validatePassword = (password, confirmPassword) => {
  const errors = [];

  const matchResult = validatePasswordMatch(password, confirmPassword);
  if (!matchResult.isValid) {
    errors.push(matchResult.error);
  }

  const strengthResult = validatePasswordStrength(password);
  if (!strengthResult.isValid) {
    errors.push(...strengthResult.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

