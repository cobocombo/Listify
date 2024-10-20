////////////////////////////////////////////////////////////////////////

// Functionality to toggle the password field type in order to show / hide the new password.
let passwordField = document.getElementById('password-field');
let togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', function() 
{
  if(passwordField.type === "password") 
  {
    passwordField.type = "text";
    this.setAttribute('uk-icon', 'icon: eye-slash');
  } 
  else 
  {
    passwordField.type = "password";
    this.setAttribute('uk-icon', 'icon: eye');
  }
});

////////////////////////////////////////////////////////////////////////

// Function called when the user hits the sign up button on signup.html.
document.addEventListener('DOMContentLoaded', function () 
{
  let form = document.getElementById('signup-form');
  form.addEventListener('submit', function (event) 
  {
    event.preventDefault();
    var baseUrl = '';
    let formData = new FormData(form);
    let userData = Object.fromEntries(formData.entries());
    let firstName = userData['first-name'];
    let lastName = userData['last-name'];
    let email = userData['email'];
    let password = userData['password'];
    let pin = userData['pin'];
    let platform = 'web';

    let firstNameValidationResult = validateName(firstName);
    let lastNameValidationResult = validateName(lastName);
    let emailValidationResult = validateEmail(email);
    let passwordValidationResult = validateNewPassword(password);
    let pinValidationResult = validatePin(pin);

    if(checkFirstAndLastNameValidationResultsSignup(firstNameValidationResult, lastNameValidationResult) == false) { return; }
    if(checkEmailValidationResultSignup(emailValidationResult) == false) { return; }
    if(checkPasswordValidationResultSignup(passwordValidationResult) == false) { return; }
    if(checkPinValidationResultSignup(pinValidationResult) == false) { return; }
    if(checkForTermsCheckboxValidation(document.getElementById("terms-checkbox").checked) == false) { return; }

    if(DEBUG_MODE == true) { baseUrl = DEBUG_BASE_URL; }
    else { baseUrl = PROD_BASE_URL }

    showSpinnerWithOverlay();

    fetch(baseUrl + 'shared/api/signup', 
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'first-name': firstName, 'last-name': lastName, 'email': email, 'password': password, 'pin': pin, 'platform': platform })
    })
    .then(response => response.json()
      .then(data => 
      {
        if(response.status === 200) 
        { 
          sessionStorage.setItem('session-token', data.token)
          window.location.href = '/dashboard'; 
        }
        else if(response.status === 400) { UIkit.notification({ message: 'MUST FILL OUT ALL DATA FIELDS', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else if(response.status === 409) { UIkit.notification({ message: 'EMAIL IS ALREADY IN USE. LOGIN INSTEAD?', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else { UIkit.notification({ message: 'UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500}); }
        hideSpinnerWithOverlay();
      })
      .catch(err => { console.error('Error parsing response JSON', err); })
    )
    .catch(err => 
    { 
      console.error('Fetch error:', err);
      hideSpinnerWithOverlay(); 
    });
  });
});

////////////////////////////////////////////////////////////////////////

// Function to check the first and last name validation results and notify the user based on each type of result can be returned 
// from the name validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkFirstAndLastNameValidationResultsSignup(firstNameValidationResult, lastNameValidationResult)
{
  if(firstNameValidationResult == NAME_VALIDATION_STATUSES.EMPTY)
  {
    UIkit.notification({ message: 'EMPTY FIRST NAME', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(firstNameValidationResult == NAME_VALIDATION_STATUSES.TOO_SHORT)
  {
    UIkit.notification({ message: 'FIRST NAME MUST BE ATLEAST 2 CHARACTERS', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(firstNameValidationResult == NAME_VALIDATION_STATUSES.TOO_LONG)
  {
    UIkit.notification({ message: 'FIRST NAME MUST BE LESS THAN 50 CHARACTERS', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(firstNameValidationResult == NAME_VALIDATION_STATUSES.INVALID_CHARACTER)
  {
    UIkit.notification({ message: 'FIRST NAME CONTAINED AN INVALID CHARACTER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(firstNameValidationResult == NAME_VALIDATION_STATUSES.CONTAINS_NUMBER)
  {
    UIkit.notification({ message: 'FIRST NAME CONTAINED A NUMBER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }

  if(lastNameValidationResult == NAME_VALIDATION_STATUSES.EMPTY)
  {
    UIkit.notification({ message: 'EMPTY LAST NAME', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(lastNameValidationResult == NAME_VALIDATION_STATUSES.TOO_SHORT)
  {
    UIkit.notification({ message: 'LAST NAME MUST BE ATLEAST 2 CHARACTERS', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(lastNameValidationResult == NAME_VALIDATION_STATUSES.TOO_LONG)
  {
    UIkit.notification({ message: 'LAST NAME MUST BE LESS THAN 50 CHARACTERS', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(lastNameValidationResult == NAME_VALIDATION_STATUSES.INVALID_CHARACTER)
  {
    UIkit.notification({ message: 'LAST NAME CONTAINED AN INVALID CHARACTER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(lastNameValidationResult == NAME_VALIDATION_STATUSES.CONTAINS_NUMBER)
  {
    UIkit.notification({ message: 'LAST NAME CONTAINED A NUMBER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  return true;
}

////////////////////////////////////////////////////////////////////////

// Function to check the email validation result and notify the user based on each type of result can be returned 
// from the email validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkEmailValidationResultSignup(emailValidationResult)
{
  if(emailValidationResult == EMAIL_VALIDATION_STATUSES.EMPTY)
  {
    UIkit.notification({ message: 'EMPTY EMAIL ADDRESS', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(emailValidationResult == EMAIL_VALIDATION_STATUSES.INVALID_FORMAT)
  {
    UIkit.notification({ message: 'INVALID EMAIL ADDRESS FORMAT', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  return true;
}

////////////////////////////////////////////////////////////////////////

// Function to check the password validation result and notify the user based on each type of result can be returned 
// from the password validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkPasswordValidationResultSignup(passwordValidationResult)
{
  if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.EMPTY)
  {
    UIkit.notification({ message: 'EMPTY PASSWORD', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.TOO_SHORT)
  {
    UIkit.notification({ message: 'PASSWORD NEEDS TO BE ATLEAST 8 CHARACTERS', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.NO_UPPERCASE)
  {
    UIkit.notification({ message: 'PASSWORD NEEDS TO HAVE ATLEAST 1 UPPERCASE LETTER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.NO_LOWERCASE)
  {
    UIkit.notification({ message: 'PASSWORD NEEDS TO HAVE ATLEAST 1 LOWERCASE LETTER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.NO_NUMBER)
  {
    UIkit.notification({ message: 'PASSWORD NEEDS TO HAVE ATLEAST 1 NUMBER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.NO_SPECIAL_CHAR)
  {
    UIkit.notification({ message: 'PASSWORD NEEDS TO HAVE ATLEAST 1 SPECIAL CHARACTER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  return true;
}

////////////////////////////////////////////////////////////////////////

// Function to check the 4 digit pin code validation result and notify the user based on each type of result can be returned 
// from the pin code validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkPinValidationResultSignup(pinValidationResult)
{
  if(pinValidationResult == PIN_VALIDATION_STATUSES.EMPTY)
  {
    UIkit.notification({ message: 'EMPTY PIN CODE', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(pinValidationResult == PIN_VALIDATION_STATUSES.TOO_SHORT)
  {
    UIkit.notification({ message: 'PIN CODE TOO SHORT', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(pinValidationResult == PIN_VALIDATION_STATUSES.TOO_LONG)
  {
    UIkit.notification({ message: 'PIN CODE TOO LONG', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else if(pinValidationResult == PIN_VALIDATION_STATUSES.INVALID_CHARACTER)
  {
    UIkit.notification({ message: 'PIN CODE CONTAINED AN INVALID CHARACTER', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  return true;
}

////////////////////////////////////////////////////////////////////////

// Function to check for the current state of the terms of service & privacy policy checkbox, and notify the user if it is not selected.
// Returns false if the current state of the checkbox comes back unchecked or false. 
function checkForTermsCheckboxValidation(termsChecked)
{
  if(termsChecked == false) 
  {
    UIkit.notification({ message: 'MUST AGREE TO TERMS OF SERVICE & PRIVACY POLICY', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
  else { return true; }
}

////////////////////////////////////////////////////////////////////////

// Keep the user from opening up a context menu.
document.addEventListener('contextmenu', event => event.preventDefault());

////////////////////////////////////////////////////////////////////////

// Function to force an automatic refresh of the page if the user navigates away.
window.addEventListener('pageshow', function(event) 
{
  if(event.persisted) { window.location.reload(); }
});

////////////////////////////////////////////////////////////////////////