# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from Models.entity import DB_SESSION
from werkzeug.security import check_password_hash
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND

class VerifyEmail(Resource):
  def get(self,token):
    db_session = DB_SESSION()
    username = SERIALIZER.loads(token)['username']
    password = SERIALIZER.loads(token)['password']
    user_type = SERIALIZER.loads(token)['user_type']

    if (user_type=="challenger"):
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()
      if (user and check_password_hash(user.password, password)):
        user.email_confirmed = True
        db_session.commit()
        db_session.close()
        return NO_CONTENT

      else:
        db_session.close()
        return NOT_FOUND

    elif (user_type=="participant"):
      user = db_session.query(ParticipantUserTable).filter_by(username=username).first()
      if (user and check_password_hash(user.password, password)):
        user.email_confirmed = True
        db_session.commit()
        db_session.close()
        return NO_CONTENT

      else:
        db_session.close()
        return NOT_FOUND
            
    else:
      db_session.close()
      return NOT_FOUND

  def post(self,token):
    pass

  def put(self,token):
    pass

  def delete(self,token):
    pass