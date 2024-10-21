########################################################################
# IMPORTS
########################################################################
from flask import Blueprint, request, jsonify # type: ignore
from db import get_db
from utils import hash_text
import secrets
from datetime import datetime
import sqlite3

########################################################################
# CONSTANTS
########################################################################
SHARED_API = Blueprint('shared_api', __name__)

########################################################################
# FUNCTIONS
########################################################################
@SHARED_API.route('/shared/api/signup', methods=['POST'])
def shared_signup():
  """Route called when the user is signing up for Listify either from the web or from mobile."""
  data = request.get_json()
  first_name = data.get('first-name')
  last_name = data.get('last-name')
  email = data.get('email')
  password = data.get('password')
  pin = data.get('pin')
  platform = data.get('platform')

  if not all([first_name, last_name, email, password, pin]):
    return jsonify({'error': 'Missing required fields'}), 400

  db = get_db()
  try:
    cursor = db.cursor()
    hashed_password = hash_text(password)
    insert_new_user_sql = """INSERT INTO users (first_name, last_name, email, password, pin) VALUES (?, ?, ?, ?, ?)"""
    cursor.execute(insert_new_user_sql, (first_name, last_name, email, hashed_password, pin))
    db.commit()
    user_id = cursor.lastrowid
    token = secrets.token_urlsafe(64)
    insert_new_session_sql = "INSERT INTO sessions (token, user_id, created_at, platform) VALUES (?, ?, ?, ?)"
    token_created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute(insert_new_session_sql, (token, user_id, token_created_at, platform))
    db.commit()
    return jsonify({'message': 'User signed up successfully', 'token': token}), 200

  except sqlite3.Error as e:
    if "UNIQUE constraint failed: users.email" in str(e):
        return jsonify({'error': 'Email already in use'}), 409
    db.rollback()
    return jsonify({'error': 'Database error occurred'}), 500

#########################################

@SHARED_API.route('/shared/api/login', methods=['POST'])
def shared_login():
  """Route called when the user is logging into Listify either from the web or from mobile."""
  data = request.get_json()
  email = data.get('email')
  password = data.get('password')
  platform = data.get('platform')

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

    hashed_password = hash_text(password)
    passwords_match = (hashed_password == user_hashed_password)

    if passwords_match:
      delete_old_session_sql = "DELETE FROM sessions WHERE user_id = ? AND platform = ?"

      if platform == 'web':
        cursor.execute(delete_old_session_sql, (user_id, 'web'))
      else:
        cursor.execute(delete_old_session_sql, (user_id, 'mobile'))
      
      token = secrets.token_urlsafe(64)
      insert_new_session_sql = "INSERT INTO sessions (token, user_id, created_at, platform) VALUES (?, ?, ?, ?)"
      token_created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
      cursor.execute(insert_new_session_sql, (token, user_id, token_created_at, platform))
      db.commit()
      return jsonify({'message': 'Login successful', 'token': token}), 200

    else:
      return jsonify({'error': 'Invalid password'}), 401

  except sqlite3.Error as e:
    return jsonify({'error': 'Database error occurred'}), 500

#########################################

@SHARED_API.route('/shared/api/validate-email', methods=['POST'])
def shared_validate_email():
  """Route called when the user is validating their email on web or mobile."""
  data = request.get_json()
  email = data.get('email')

  if not email:
    return jsonify({'status': 'error', 'message': 'Email is required'}), 400

  db = get_db()
  try:
    cursor = db.cursor()
    get_user_sql = 'SELECT * FROM users WHERE email = ?'
    cursor.execute(get_user_sql, (email,))
    user = cursor.fetchone()
    if user:
      return jsonify({'status': 'success', 'message': 'Email is valid'}), 200
    else:
      return jsonify({'status': 'error', 'message': 'Email not found'}), 404
  except Exception as e:
    return jsonify({'status': 'error', 'message': str(e)}), 500

#########################################

@SHARED_API.route('/shared/api/reset-password', methods=['POST'])
def shared_reset_password():
  """Route called when the user is resetting their password after validating their email on web or mobile."""
  data = request.get_json()
  email = data.get('email')
  pin = data.get('pin')
  password = data.get('password')

  if not all([email, pin, password]):
    return jsonify({'error': 'Missing required fields'}), 400

  db = get_db()
  try:
    cursor = db.cursor()
    get_user_sql = 'SELECT * FROM users WHERE email = ?'
    cursor.execute(get_user_sql, (email,))
    user = cursor.fetchone()

    if user:
      pin_code = user['pin']
      if pin != pin_code:
        return jsonify({'status': 'error', 'message': 'PIN code does not match'}), 401
      
      hashed_password = hash_text(password)
      update_password_sql = 'UPDATE users SET password = ? WHERE email = ?'
      cursor.execute(update_password_sql, (hashed_password, email))
      db.commit()

      return jsonify({'status': 'success', 'message': 'Password reset successful'}), 200
    else:
      return jsonify({'status': 'error', 'message': 'Email not found'}), 404

  except Exception as e:
    return jsonify({'status': 'error', 'message': str(e)}), 500
  
########################################################################