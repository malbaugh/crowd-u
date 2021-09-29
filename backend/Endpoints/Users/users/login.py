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
from Statuses.statuses import NOT_FOUND, BAD_REQUEST, UNAUTHORIZED

class Login(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    email = request.get_json()['email']
    password = request.get_json()['password']

    user = db_session.query(UserTable).filter_by(email=email).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (user.email == email and check_password_hash(user.password, password)):
      if (db_session.query(ParticipantUserTable).filter_by(email=email).first()):
        token = {'token': SERIALIZER.dumps({'username': user.username, 'password': password, 'user_type': "participant"}).decode("utf-8")}

        participant_schema = ParticipantUserTableSchema(exclude=('password','date_of_birth',))
        participant_user_object = db_session.query(ParticipantUserTable).filter_by(email=email).first()
        participant_user = participant_schema.dump(participant_user_object)

        db_session.close()

        response = jsonify(token, participant_user)
        response.status_code = 200
        return response

      elif (db_session.query(ChallengeUserTable).filter_by(email=email).first()):
        token = {'token': SERIALIZER.dumps({'username': user.username, 'password': password, 'user_type': "challenger"}).decode("utf-8")}

        challenger_schema = ChallengeUserTableSchema(exclude=('password',))
        challenge_user_object = db_session.query(ChallengeUserTable).filter_by(email=email).first()
        challenge_user = challenger_schema.dump(challenge_user_object)

        db_session.close()

        response = jsonify(token, challenge_user)
        response.status_code = 200
        return response

      else:
        db_session.close()
        return BAD_REQUEST

    else:
      db_session.close()
      return UNAUTHORIZED

  def put(self):
    pass

  def delete(self):
    pass