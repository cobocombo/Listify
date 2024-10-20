////////////////////////////////////////////////////////////////////////

// Function to hide the spinner-overlay element programatically after the page is done making a request.
function hideSpinnerWithOverlay()
{
  document.querySelector('.spinner-overlay').style.display = 'none';
}

////////////////////////////////////////////////////////////////////////

// Function to show the spinner-overlay element, to show the page is making a request.
function showSpinnerWithOverlay()
{
  document.querySelector('.spinner-overlay').style.display = 'flex';
}

////////////////////////////////////////////////////////////////////////