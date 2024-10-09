////////////////////////////////////////////////////////////////////////

// Enum to hold name validation statuses.
const NAME_VALIDATION_STATUSES = Object.freeze({
  EMPTY: 'Empty',
  TOO_SHORT: 'Too Short',
  TOO_LONG: 'Too Long',
  INVALID_CHARACTER: 'Invalid Character',
  CONTAINS_NUMBER: 'Contain Numbers',
  VALID: 'Valid'
});

////////////////////////////////////////////////////////////////////////

// Enum to hold email validation statuses.
const EMAIL_VALIDATION_STATUSES = Object.freeze({
  EMPTY: 'Empty',
  INVALID_FORMAT: 'Invalid Format',
  VALID: 'Valid'
});

////////////////////////////////////////////////////////////////////////

// Enum to hold password validation statuses.
const PASSWORD_VALIDATION_STATUSES = Object.freeze({
  EMPTY: 'Empty',
  TOO_SHORT: 'Too Short',
  NO_UPPERCASE: 'No Uppercase Letter',
  NO_LOWERCASE: 'No Lowercase Letter',
  NO_NUMBER: 'No Number',
  NO_SPECIAL_CHAR: 'No Special Character',
  VALID: 'Valid'
});

////////////////////////////////////////////////////////////////////////

// Function to validate a first or last name passed into a form.
function validateName(name) 
{
  name = name.trim();
  if (!name) { return NAME_VALIDATION_STATUSES.EMPTY; }
  if (name.length < 2) { return NAME_VALIDATION_STATUSES.TOO_SHORT; }
  if (name.length > 49) { return NAME_VALIDATION_STATUSES.TOO_LONG; }
  let namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  if (!namePattern.test(name)) { return NAME_VALIDATION_STATUSES.INVALID_CHARACTER; }
  if (/\d/.test(name)) { return NAME_VALIDATION_STATUSES.CONTAINS_NUMBER; }
  return NAME_VALIDATION_STATUSES.VALID;
}

////////////////////////////////////////////////////////////////////////

// Function to validate an email address passed into a form.
function validateEmail(email) 
{
  email = email.trim();
  if (!email) { return EMAIL_VALIDATION_STATUSES.EMPTY; }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) { return EMAIL_VALIDATION_STATUSES.INVALID_FORMAT; }
  return EMAIL_VALIDATION_STATUSES.VALID;
}

////////////////////////////////////////////////////////////////////////

// Function to validate a new password passed into a signup form.
function validateNewPassword(password) 
{
  password = password.trim();
  if (!password) { return PASSWORD_VALIDATION_STATUSES.EMPTY; }
  if (password.length < 8) { return PASSWORD_VALIDATION_STATUSES.TOO_SHORT; }
  if (!/[A-Z]/.test(password)) { return PASSWORD_VALIDATION_STATUSES.NO_UPPERCASE; }
  if (!/[a-z]/.test(password)) { return PASSWORD_VALIDATION_STATUSES.NO_LOWERCASE; }
  if (!/[0-9]/.test(password)) { return PASSWORD_VALIDATION_STATUSES.NO_NUMBER; }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) { return PASSWORD_VALIDATION_STATUSES.NO_SPECIAL_CHAR; }
  return PASSWORD_VALIDATION_STATUSES.VALID;
}

////////////////////////////////////////////////////////////////////////

// Function to validate a current password passed into a login form.
function validateCurrentPasssword(password)
{
  password = password.trim();
  if (!password) { return PASSWORD_VALIDATION_STATUSES.EMPTY; }
  return PASSWORD_VALIDATION_STATUSES.VALID;
}

////////////////////////////////////////////////////////////////////////