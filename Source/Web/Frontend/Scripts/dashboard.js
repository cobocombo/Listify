////////////////////////////////////////////////////////////////////////

// Function to set the content area of the dashboard to whatever html template specified.
function switchContentFromTemplate(templateId) 
{
  const template = document.getElementById(templateId);
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = template.innerHTML;
}

////////////////////////////////////////////////////////////////////////

// Function called when the page loads. Sets the default html template to home 
// and sets up the rest of the links allow the content area to be chnaged programatically.
document.addEventListener('DOMContentLoaded', function() 
{
  const links = document.querySelectorAll('.uk-nav li');
  const pageTitle = document.getElementById('page-title');

  function setActiveLink(clickedLink, pageName) 
  {
    links.forEach(link => link.classList.remove('uk-active'));
    clickedLink.classList.add('uk-active');
    pageTitle.innerText = pageName;
  }

  document.getElementById('home-link').addEventListener('click', function() 
  {
    setActiveLink(this.parentElement, 'Home');
    switchContentFromTemplate('home-template');
  });

  document.getElementById('settings-link').addEventListener('click', function() 
  {
    setActiveLink(this.parentElement, 'Settings');
    switchContentFromTemplate('settings-template');
  });

  switchContentFromTemplate('home-template');
  setActiveLink(document.getElementById('home-link').parentElement, 'Home');
});

////////////////////////////////////////////////////////////////////////

// Create off canvas element.
const offcanvasElement = UIkit.offcanvas('#offcanvas-nav');

// Function to close off-canvas when a link is clicked
document.querySelectorAll('#offcanvas-nav a').forEach(link => 
{
  link.addEventListener('click', function() { offcanvasElement.hide(); });
});

////////////////////////////////////////////////////////////////////////

// Keep the user from opening up a context menu.
document.addEventListener('contextmenu', event => event.preventDefault());

////////////////////////////////////////////////////////////////////////

