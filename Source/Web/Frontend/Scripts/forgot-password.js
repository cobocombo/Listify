////////////////////////////////////////////////////////////////////////

var EMAIL_VALIDATED = false;

////////////////////////////////////////////////////////////////////////

// Function called when the user hits the validate button on forgot-password.html page.
document.addEventListener('DOMContentLoaded', function () 
{
  let form = document.getElementById('forgot-password-form');
  form.addEventListener('submit', function (event) 
  {
    event.preventDefault();
    var baseUrl = '';
    let formData = new FormData(form);
    let userData = Object.fromEntries(formData.entries());
    let email = userData['email'];

    if(DEBUG_MODE == true) { baseUrl = DEBUG_BASE_URL; }
    else { baseUrl = PROD_BASE_URL }

    if(EMAIL_VALIDATED == false)
    {
      showSpinnerWithOverlay();
      fetch(baseUrl + 'shared/api/validate-email', 
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'email': email})
      })
      .then(response => 
      {
        if(response.status === 200) 
        {
          modifyForgotPasswordForm();
          EMAIL_VALIDATED = true;
        }
        else if(response.status === 400) { UIkit.notification({ message: 'EMAIL EMPTY', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else if(response.status === 404)  { UIkit.notification({ message: 'EMAIL NOT FOUND', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else { UIkit.notification({ message: 'UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500}); }
        hideSpinnerWithOverlay();
      })
      .catch(error => 
      {
        console.error('Fetch error:', err);
        hideSpinnerWithOverlay();
      });
    }
    else
    {
      let pin = userData['pin'];
      let password = userData['password'];
      let pinValidationResult = validatePin(pin);
      let passwordValidationResult = validateNewPassword(password);
      if(checkPinValidationResultReset(pinValidationResult) == false) { return; }
      if(checkPasswordValidationResultReset(passwordValidationResult) == false) { return; }

      showSpinnerWithOverlay();
      fetch(baseUrl + 'shared/api/reset-password', 
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'email': email, 'pin': pin, 'password': password})
      })
      .then(response => 
      {
        if(response.status === 200) 
        {
          UIkit.notification({ message: 'PASSWORD RESET SUCCESSFULLY', status: 'success', pos: 'top-center', timeout: 2500});
          showSpinnerWithOverlay();
          setTimeout(function() { window.location.href = '/login'; }, 2000);
        }
        else if(response.status === 400) { UIkit.notification({ message: 'MUST FILL OUT ALL DATA FIELDS', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else if(response.status === 401) { UIkit.notification({ message: 'INCORRECT PIN CODE', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else if(response.status === 404)  { UIkit.notification({ message: 'EMAIL NOT FOUND', status: 'danger', pos: 'top-center', timeout: 2500}); }
        else { UIkit.notification({ message: 'UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500}); }
        hideSpinnerWithOverlay();
      })
      .catch(error => 
      {
        console.error('Fetch error:', err);
        hideSpinnerWithOverlay();
      });
    }
  })
})

////////////////////////////////////////////////////////////////////////

function modifyForgotPasswordForm()
{
  let instructionText = document.getElementById('instruction-text');
  instructionText.textContent = 'Please enter your 4-digit PIN and a new password.';

  let validationEmail = document.getElementById('validation-email');
  validationEmail.setAttribute('readonly', true);
  validationEmail.classList.add('uk-disabled');

  if(!document.querySelector('input[name="pin"]')) 
  {
    let pinField = document.createElement('div');
    pinField.classList.add('uk-margin');
    pinField.innerHTML = `
      <input class="uk-input" type="number" name="pin" placeholder="4-Digit Security PIN" minlength="4" maxlength="4" oninput="if(this.value.length > 4) this.value = this.value.slice(0, 4);">
    `;
    validationEmail.parentNode.after(pinField);
  }

  if (!document.querySelector('input[name="password"]')) 
  {
    let passwordField = document.createElement('div');
    passwordField.classList.add('uk-margin');
    passwordField.innerHTML = `
      <input class="uk-input" type="password" name="password" placeholder="New Password">
    `;
    document.querySelector('input[name="pin"]').parentNode.after(passwordField);
  }

  let submitButton = document.getElementById('submit-button');
  submitButton.textContent = "Reset Password";
}

////////////////////////////////////////////////////////////////////////

// Function to check the 4 digit pin code validation result and notify the user based on each type of result can be returned 
// from the pin code validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkPinValidationResultReset(pinValidationResult)
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

// Function to check the password validation result and notify the user based on each type of result can be returned 
// from the password validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkPasswordValidationResultReset(passwordValidationResult)
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

// Function to force an automatic refresh of the page if the user navigates away.
window.addEventListener('pageshow', function(event) 
{
  if(event.persisted) { window.location.reload(); }
});

////////////////////////////////////////////////////////////////////////