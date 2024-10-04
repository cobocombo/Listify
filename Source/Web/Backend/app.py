########################################################################

from flask import Flask, jsonify, request, g
import sqlite3
import os
import hashlib

########################################################################

DEBUG_MODE = True
SHARED_SIGNUP_ROUTE = '/shared/api/signup'
SHARED_LOGIN_ROUTE = '/shared/api/login'
DEBUG_DATABASE = os.path.join(os.path.dirname(__file__), 'Database/debug.db')
PROD_DATABASE = os.path.join(os.path.dirname(__file__), 'Database/prod.db')
app = Flask(__name__, static_folder='../Frontend', static_url_path='/')

########################################################################

# Function to return the correct path to connect to the DB.
def get_db():
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

# Function to hash the password using SHA-256
def hash_password(password):
  return hashlib.sha256(password.encode('utf-8')).hexdigest()

#########################################

# Function to automatically close the DB after any backend request is made.
@app.teardown_appcontext
def close_db(error):
  db = g.pop('db', None)
  if db is not None:
    db.close()

#########################################

# Route called when the user accesses the index page of the web site.
@app.route('/')
def index():
  return app.send_static_file('index.html')

#########################################

# Route called when the user goes to a page that does not exist for web. Returns 404 page.
@app.errorhandler(404)
def page_not_found(e):
  return app.send_static_file('Pages/404.html')

#########################################

# Route called when the user is signing up for Listify either from the web or from mobile.
@app.route(SHARED_SIGNUP_ROUTE, methods=['POST'])
def signup():
  data = request.get_json()
  first_name = data.get('first-name')
  last_name = data.get('last-name')
  email = data.get('email')
  password = data.get('password')

  if not all([first_name, last_name, email, password]):
    return jsonify({'error': 'Missing required fields'}), 400

  hashed_password = hash_password(password)
  sql = """INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)"""

  db = get_db()
  try:
    cursor = db.cursor()
    cursor.execute(sql, (first_name, last_name, email, hashed_password))
    db.commit()
  except sqlite3.Error as e:
    if "UNIQUE constraint failed: users.email" in str(e):
        return jsonify({'error': 'Email already in use'}), 409
    db.rollback()
    return jsonify({'error': 'Database error occurred'}), 500

  return jsonify({'message': 'User signed up successfully'}), 200

#########################################

# Route called when the user is logging into Listify either from the web or from mobile.
@app.route(SHARED_LOGIN_ROUTE, methods=['POST'])
def login():
  print('Logging in the user...')
  return 'Logging in the user...'

########################################################################

if __name__ == '__main__':
  app.run(debug=DEBUG_MODE)

########################################################################