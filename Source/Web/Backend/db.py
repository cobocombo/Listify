########################################################################
# IMPORTS
########################################################################
from flask import g # type: ignore
import os
import sqlite3
from env import DEBUG_MODE

########################################################################
# CONSTANTS
########################################################################
DEBUG_DATABASE = os.path.join(os.path.dirname(__file__), 'Database/debug.db')
PROD_DATABASE = os.path.join(os.path.dirname(__file__), 'Database/prod.db')

########################################################################
# FUNCTIONS
########################################################################
def get_db():
  """Function to return the correct path to connect to the DB."""
  db_path = None
  if(DEBUG_MODE):
    db_path = DEBUG_DATABASE
  else:
    db_path = PROD_DATABASE
  if 'db' not in g:
    g.db = sqlite3.connect(db_path)
    g.db.row_factory = sqlite3.Row
  return g.db

#########################################

def close_db(error):
  """Function to close the DB connection after each request"""
  db = g.pop('db', None)
  if db is not None:
      db.close()

########################################################################