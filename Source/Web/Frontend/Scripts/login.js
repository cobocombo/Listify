////////////////////////////////////////////////////////////////////////

// Function called when the user hits the login button on login.html.
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

    let emailValidationResult = validateEmail(email);
    let rememberMeValidationResult = document.getElementById("remember-me-checkbox").checked;

    if(checkEmailValidationResultLogin(emailValidationResult) == false) { return; }

    if(DEBUG_MODE == true) { baseUrl = DEBUG_BASE_URL; }
    else { baseUrl = PROD_BASE_URL }

    showSpinnerWithOverlay();

    fetch(baseUrl + 'shared/api/login', 
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'email': email, 'password': password})
    })
    .then(response => 
    {
      if(response.status === 401) { UIkit.notification({ message: 'INVALID EMAIL OR PASSWORD. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500}); }
      else if(response.status === 200) 
      { 
        window.location.href = '/dashboard';
      }
      else { UIkit.notification({ message: 'UNEXPECTED ERROR OCCURRED. PLEASE TRY AGAIN', status: 'danger', pos: 'top-center', timeout: 2500}); }
      hideSpinnerWithOverlay();
    })
    .catch(error => 
    {
      console.error('Error:', error);
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

document.addEventListener('contextmenu', event => event.preventDefault());

////////////////////////////////////////////////////////////////////////
