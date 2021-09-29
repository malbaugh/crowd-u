# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable, ChallengeUserTableSchema
from Models.Users.participant_users.participant_user import ParticipantUserTable, ParticipantUserTableSchema
from Models.entity import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NOT_FOUND

class ByUsername(Resource):
  def get(self,username):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      current_username = SERIALIZER.loads(token)['username']
      current_password = SERIALIZER.loads(token)['password']
      authorization = True

    else:
      authorization = False

    user = db_session.query(UserTable).filter_by(username=username).first()

    if (db_session.query(ParticipantUserTable).filter_by(username=username).first()):
      if (authorization and (current_username == username) and check_password_hash(user.password, current_password)):
        participant_schema = ParticipantUserTableSchema(exclude=('password','date_of_birth',))

      else:
        participant_schema = ParticipantUserTableSchema(exclude=('password','date_of_birth','address','email','phone',))

      participant_user_object = db_session.query(ParticipantUserTable).filter_by(username=username).first()
      participant_user = participant_schema.dump(participant_user_object)
      db_session.close()

      response = jsonify(participant_user)
      response.status_code = 200
      return response

    elif (db_session.query(ChallengeUserTable).filter_by(username=username).first()):
      if (authorization and (current_username == username) and check_password_hash(user.password, current_password)):
        challenger_schema = ChallengeUserTableSchema(exclude=('password',))

      else:
        challenger_schema = ChallengeUserTableSchema(exclude=('password','poc_first_name','poc_last_name','poc_phone','email',))

      challenge_user_object = db_session.query(ChallengeUserTable).filter_by(username=username).first()
      challenge_user = challenger_schema.dump(challenge_user_object)
      db_session.close()

      response = jsonify(challenge_user)
      response.status_code = 200
      return response

    else:
      db_session.close()
      return NOT_FOUND

  def post(self,username):
    pass

  def put(self,username):
    pass

  def delete(self,username):
    pass