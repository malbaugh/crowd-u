# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Data.user_followers.user_follower import UserFollowerTable, UserFollowerTableSchema
from datetime import datetime
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED

class Follow(Resource):
  def get(self,uid):
    pass

  def post(self,uid):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']

      fid = request.get_json()['follower_id']

      db_session = DB_SESSION()

      corrected_data = {
        'follower_id': fid,
        'user_id': uid
      }

      user = db_session.query(UserTable).filter_by(id=fid).first()

    else: 
      return NO_CONTENT
    
    if ((user.username == username) and (check_password_hash(user.password, password))):
      posted_follower = UserFollowerTableSchema(only=('follower_id','user_id','date'))\
        .load(corrected_data)
      follower = UserFollowerTable(**posted_follower.data, date=datetime.now())
      follower.submitted = False

      db_session.add(follower)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def put(self,uid):
    pass

  def delete(self,uid):
    pass