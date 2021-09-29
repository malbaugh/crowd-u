# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from datetime import datetime
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable, ChallengeFollowerTableSchema
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NO_CONTENT

class FollowChallenge(Resource):
  def get(self,cid):
    pass
    
  def post(self,cid):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']

      uid = request.get_json()['follower_id']

      db_session = DB_SESSION()

      corrected_data = {
        'follower_id': uid,
        'challenge_id': cid
      }

      user = db_session.query(UserTable).filter_by(id=uid).first()

    else: 
      return UNAUTHORIZED
    
    if ((user.username == username) and (check_password_hash(user.password, password))):
      posted_follower = ChallengeFollowerTableSchema(only=('follower_id','challenge_id','date'))\
        .load(corrected_data)
      follower = ChallengeFollowerTable(**posted_follower.data, date=datetime.now())
      follower.submitted = False

      db_session.add(follower)
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