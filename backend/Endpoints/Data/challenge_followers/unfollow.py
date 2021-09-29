# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NO_CONTENT

class UnfollowChallenge(Resource):
  def get(self,uid,cid):
    pass

  def post(self,uid,cid):
    pass
    
  def put(self,uid,cid):
    pass

  def delete(self,uid,cid):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      db_session = DB_SESSION()
      user = db_session.query(UserTable).filter_by(id=uid).first()

    else: 
      return UNAUTHORIZED
    
    if ((user.username == username) and (check_password_hash(user.password, password))):
      db_session.query(ChallengeFollowerTable).filter_by(follower_id=uid, challenge_id=cid).delete()

      db_session.commit()
      db_session.close()
      
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED
