# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask import request
from werkzeug.security import check_password_hash
from flask_restful import Resource
from Models.entity import DB_SESSION
from Models.Challenges.contests.contest import ContestTable
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class CloseChallenge(Resource):
  def get(self,cid):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user == None):
      db_session.close()
      return NOT_FOUND

    challenge = db_session.query(ContestTable).filter_by(parent_id=cid).first()

    if (challenge == None):
      db_session.close()
      return NOT_FOUND

    elif ((username == challenge.owner) and check_password_hash(user.password, password)):
      challenge.winner_selected = True

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def post(self,cid):
    pass
    
  def put(self,cid):
    pass

  def delete(self,cid):
    pass