########################################################################
# LIBRARY IMPORTS
########################################################################

from flask import Flask, jsonify, request, g
import sqlite3
import secrets
from datetime import datetime
import os
import hashlib

########################################################################
# CONSTANTS
########################################################################

DEBUG_MODE = True
DEBUG_DATABASE = os.path.join(os.path.dirname(__file__), 'Database/debug.db')
PROD_DATABASE = os.path.join(os.path.dirname(__file__), 'Database/prod.db')
app = Flask(__name__, static_folder='../Frontend', static_url_path='/')

########################################################################
# DATABASE FUNCTIONALITY
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

# Function to hash the password using SHA-256.
def hash_password(password):
  return hashlib.sha256(password.encode('utf-8')).hexdigest()

#########################################

# Function to automatically close the DB after any backend request is made.
@app.teardown_appcontext
def close_db(error):
  db = g.pop('db', None)
  if db is not None:
    db.close()

########################################################################
# WEB PAGE ROUTES
########################################################################

# Route called when the user accesses the index page of the web site.
@app.route('/')
def view_web_index_page():
  return app.send_static_file('index.html')

#########################################

# Route called when the user accesses the login page of the web site.
@app.route('/login')
def view_web_login_page():
  return app.send_static_file('Pages/login.html')

#########################################

# Route called when the user accesses the signup page of the web site.
@app.route('/signup')
def view_web_signup_page():
  return app.send_static_file('Pages/signup.html')

#########################################

# Route called when the user accesses the terms page of the web site.
@app.route('/terms')
def view_web_terms_page():
  return app.send_static_file('Pages/terms.html')

#########################################

# Route called when the user accesses the privacy policy page of the web site.
@app.route('/policy')
def view_web_policy_page():
  return app.send_static_file('Pages/policy.html')

#########################################

# Route called when the user accesses the reset password page of the web site.
@app.route('/password')
def view_web_reset_password_page():
  return app.send_static_file('Pages/password.html')

#########################################

# Route called when the user accesses the dashboard page of the web site. It's assumed the user is already signed up or logged in.
@app.route('/dashboard')
def view_web_dashboard_page():
  return app.send_static_file('Pages/dashboard.html')

#########################################

# Route called when the user goes to a page that does not exist for web. Returns 404 page.
@app.errorhandler(404)
def web_page_not_found(e):
  return app.send_static_file('Pages/404.html')

########################################################################
# SHARED API ROUTES
########################################################################

# Route called when the user is signing up for Listify either from the web or from mobile.
@app.route('/shared/api/signup', methods=['POST'])
def shared_signup():
  data = request.get_json()
  first_name = data.get('first-name')
  last_name = data.get('last-name')
  email = data.get('email')
  password = data.get('password')

  if not all([first_name, last_name, email, password]):
    return jsonify({'error': 'Missing required fields'}), 400

  db = get_db()
  try:
    cursor = db.cursor()
    hashed_password = hash_password(password)
    insert_new_user_sql = """INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)"""
    cursor.execute(insert_new_user_sql, (first_name, last_name, email, hashed_password))
    db.commit()
    user_id = cursor.lastrowid
    token = secrets.token_urlsafe(64)
    insert_new_session_sql = "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)"
    token_created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute(insert_new_session_sql, (token, user_id, token_created_at))
    db.commit()
    return jsonify({'message': 'User signed up successfully', 'token': token}), 200

  except sqlite3.Error as e:
    if "UNIQUE constraint failed: users.email" in str(e):
        return jsonify({'error': 'Email already in use'}), 409
    db.rollback()
    return jsonify({'error': 'Database error occurred'}), 500

#########################################

# Route called when the user is logging into Listify either from the web or from mobile.
@app.route('/shared/api/login', methods=['POST'])
def shared_login():
  data = request.get_json()
  email = data.get('email')
  password = data.get('password')

  if not all([email, password]):
    return jsonify({'error': 'Missing required fields'}), 400

  db = get_db()
  try:
    cursor = db.cursor()
    return_saved_email_sql = "SELECT * FROM users WHERE email = ?"
    cursor.execute(return_saved_email_sql, (email,))
    user = cursor.fetchone()

    if user is None:
      return jsonify({'error': "Email not found"}), 404

    user_hashed_password = user['password']
    user_id = user['id']

    hashed_password = hash_password(password)
    passwords_match = (hashed_password == user_hashed_password)

    if passwords_match:
      token = secrets.token_urlsafe(64)
      insert_new_session_sql = "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)"
      token_created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
      cursor.execute(insert_new_session_sql, (token, user_id, token_created_at))
      db.commit()
      return jsonify({'message': 'Login successful', 'token': token}), 200

    else:
      return jsonify({'error': 'Invalid password'}), 401

  except sqlite3.Error as e:
    return jsonify({'error': 'Database error occurred'}), 500

########################################################################
# MAIN
########################################################################

if __name__ == '__main__':
  app.run(debug=DEBUG_MODE)

########################################################################