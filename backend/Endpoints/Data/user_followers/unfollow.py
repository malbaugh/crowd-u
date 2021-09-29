# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Data.user_followers.user_follower import UserFollowerTable
from Models.entity import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED

class Unfollow(Resource):
  def get(self,fid,uid):
    pass

  def post(self,fid,uid):
    pass

  def put(self,fid,uid):
    pass

  def delete(self,fid,uid):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      db_session = DB_SESSION()
      user = db_session.query(UserTable).filter_by(id=fid).first()

    else: 
      return UNAUTHORIZED
    
    if ((user.username == username) and (check_password_hash(user.password, password))):
      db_session.query(UserFollowerTable).filter_by(follower_id=fid, user_id=uid).delete()

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

