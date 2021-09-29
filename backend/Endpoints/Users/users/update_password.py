# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Models.entity import SERIALIZER
from datetime import datetime
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash, generate_password_hash
from Statuses.statuses import NOT_FOUND, BAD_REQUEST, UNAUTHORIZED

class UpdatePassword(Resource):
  def get(self,username):
    pass

  def post(self,username):
    pass

  def put(self,username):
    db_session = DB_SESSION()

    data = request.get_json()

    old_password = data['old_password']
    new_password = data['new_password']

    user = db_session.query(UserTable).filter_by(username=username).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (not check_password_hash(user.password, old_password)):
      db_session.close()
      return UNAUTHORIZED

    elif (user.username == username and check_password_hash(user.password, old_password)):
      user.password = generate_password_hash(new_password)
      user.updated_at = datetime.now()
      user.last_updated_by = "HTTP put request"

      db_session.commit()

      if (db_session.query(ParticipantUserTable).filter_by(username=username).first()):
        user_type = "participant"

      elif (db_session.query(ChallengeUserTable).filter_by(username=username).first()):
        user_type = "challenger"

      else:
        user_type = ""

      token = {'token': SERIALIZER.dumps({'username': user.username, 'password': new_password, 'user_type': user_type}).decode("utf-8")}

      db_session.close()

      response = jsonify(token)
      response.status_code = 200
      return response

    else:
      db_session.close()
      return BAD_REQUEST

  def delete(self,username):
    pass