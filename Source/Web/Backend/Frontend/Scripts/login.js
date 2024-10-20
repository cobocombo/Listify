////////////////////////////////////////////////////////////////////////

// Functionality to toggle the password field type in order to show / hide the password.
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

// Function called when the user hits the login button on login.html.
// It validates the appropriate input, and then calls the shared login api route.
// It also handles all server responses appropriately.
document.addEventListener('DOMContentLoaded', function () 
{
  let form = document.getElementById('login-form');
  form.addEventListener('submit', function (event) 
  {
    event.preventDefault();
    var baseUrl = '';
    let formData = new FormData(form);
    let userData = Object.fromEntries(formData.entries());
    let email = userData['email'];
    let password = userData['password'];
    let platform = 'web';

    let emailValidationResult = validateEmail(email);
    let passwordValidationResult = validateCurrentPasssword(password);
    let rememberMeValidationResult = document.getElementById("remember-me-checkbox").checked;

    if(checkEmailValidationResultLogin(emailValidationResult) == false) { return; }
    if(checkPasswordValidationResultLogin(passwordValidationResult) == false) { return; }

    if (DEBUG_MODE == true) { baseUrl = DEBUG_BASE_URL; } 
    else { baseUrl = PROD_BASE_URL; }

    showSpinnerWithOverlay();

    fetch(baseUrl + 'shared/api/login', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'email': email, 'password': password, 'platform': platform })
    })
    .then(response => response.json()
      .then(data => 
      {
        if(response.status === 200) 
        {
          if(rememberMeValidationResult == true) { localStorage.setItem('remember-me-email', email); }
          else { localStorage.setItem('remember-me-email', 'none'); }
          sessionStorage.setItem('session-token', data.token)
          window.location.href = '/dashboard';
        }
        else if(response.status === 400) { UIkit.notification({ message: 'MUST FILL OUT ALL DATA FIELDS', status: 'danger', pos: 'top-center', timeout: 2500}); } 
        else if(response.status === 401) { UIkit.notification({ message: 'INVALID PASSWORD. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500 });} 
        else if(response.status === 404) { UIkit.notification({ message: 'INVALID EMAIL. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500 });} 
        else { UIkit.notification({ message: 'UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500 });}
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

// Function to check the email validation result and notify the user based on each type of result can be returned 
// from the email validation. Returns false if any of the results came back as anything but valid. See inputValidator.js.
function checkEmailValidationResultLogin(emailValidationResult)
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

// Function to check the current password validation and notify the user if the password is empty.
// Returns false if empty result comes back as anything but valid. See inputValidator.js.
function checkPasswordValidationResultLogin(passwordValidationResult)
{
  if(passwordValidationResult == PASSWORD_VALIDATION_STATUSES.EMPTY)
  {
    UIkit.notification({ message: 'EMPTY PASSWORD', status: 'danger', pos: 'top-center', timeout: 2500});
    return false;
  }
}

////////////////////////////////////////////////////////////////////////

// Remember me functionality.
if(localStorage.getItem('remember-me-email') === null) { localStorage.setItem('remember-me-email', 'none'); }
else if(localStorage.getItem('remember-me-email') === 'none') 
{ 
  document.getElementById('remember-me-checkbox').checked = false;
  document.getElementById('email-input').value = '';
}
else
{
  document.getElementById('remember-me-checkbox').checked = true;
  document.getElementById('email-input').value = localStorage.getItem('remember-me-email');
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
