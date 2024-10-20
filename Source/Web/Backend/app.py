########################################################################
# IMPORTS
########################################################################
from flask import Flask # type: ignore
from web_routes import WEB_ROUTES as web_routes_blueprint
from shared_api import SHARED_API as shared_api_blueprint
from db import close_db

########################################################################
# FUNCTIONS
########################################################################
def create_app():
  """Factory function to create and configure the Flask app."""
  app = Flask(__name__, static_folder='Frontend', static_url_path='/')

  app.register_blueprint(web_routes_blueprint)
  app.register_blueprint(shared_api_blueprint)

  @app.teardown_appcontext
  def teardown_db(error):
    close_db(error)

  return app

########################################################################
