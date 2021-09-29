# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from datetime import datetime
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Data.challenge_registrations.challenge_registration import ChallengeRegistrationTable, ChallengeRegistrationTableSchema
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NO_CONTENT

class RegisterForChallenge(Resource):
  def get(self,cid):
    pass
    
  def post(self,cid):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']

      uid = request.get_json()['user_id']

      db_session = DB_SESSION()

      corrected_data = {
        'user_id': uid,
        'challenge_id': cid
      }

      user = db_session.query(UserTable).filter_by(id=uid).first()

    else: 
      return UNAUTHORIZED
    
    if ((user.username == username) and (check_password_hash(user.password, password))):
      posted_user = ChallengeRegistrationTableSchema(only=('user_id','challenge_id','date'))\
        .load(corrected_data)
      registered_user = ChallengeRegistrationTable(**posted_user.data, date=datetime.now())

      db_session.add(registered_user)
      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def put(self,cid):
    pass

  def delete(self,cid):
    pass