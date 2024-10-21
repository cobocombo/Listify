########################################################################
# IMPORTS
########################################################################
from flask import Blueprint, current_app as app # type: ignore

########################################################################
# CONSTANTS
########################################################################
WEB_ROUTES = Blueprint('web_routes', __name__)

########################################################################
# FUNCTIONS
########################################################################
@WEB_ROUTES.route('/')
def view_web_index_page():
  """Route called when the user accesses the index page of the web site."""
  return app.send_static_file('Pages/index.html')

#########################################

@WEB_ROUTES.route('/login')
def view_web_login_page():
  """Route called when the user accesses the login page of the web site."""
  return app.send_static_file('Pages/login.html')

#########################################

@WEB_ROUTES.route('/signup')
def view_web_signup_page():
  """Route called when the user accesses the signup page of the web site."""
  return app.send_static_file('Pages/signup.html')

#########################################

@WEB_ROUTES.route('/terms')
def view_web_terms_page():
  """Route called when the user accesses the terms page of the web site."""
  return app.send_static_file('Pages/terms.html')

#########################################

@WEB_ROUTES.route('/policy')
def view_web_policy_page():
  """Route called when the user accesses the privacy policy page of the web site."""
  return app.send_static_file('Pages/policy.html')

#########################################

@WEB_ROUTES.route('/forgot-password')
def view_web_reset_password_page():
  """Route called when the user accesses the reset password page of the web site."""
  return app.send_static_file('Pages/forgot-password.html')

#########################################

@WEB_ROUTES.route('/dashboard')
def view_web_dashboard_page():
  """Route called when the user accesses the dashboard page of the web site. It's assumed the user is already signed up or logged in."""
  return app.send_static_file('Pages/dashboard.html')

#########################################

@WEB_ROUTES.errorhandler(404)
def web_page_not_found(e):
  """Route called when the user goes to a page that does not exist for web. Returns 404 page."""
  return app.send_static_file('Pages/404.html')

########################################################################