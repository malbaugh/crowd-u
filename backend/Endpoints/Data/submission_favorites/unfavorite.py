# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Data.submission_favorites.submission_favorite import SubmissionFavoriteTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED

class Unfavorite(Resource):
  def get(self,fid,sid):
    pass

  def post(self,fid,sid):
    pass

  def put(self,fid,sid):
    pass

  def delete(self,fid,sid):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      db_session = DB_SESSION()
      user = db_session.query(UserTable).filter_by(id=fid).first()

    else: 
      return UNAUTHORIZED
    
    if ((user.username == username) and (check_password_hash(user.password, password))):
      db_session.query(SubmissionFavoriteTable).filter_by(follower_id=fid, submission_id=sid).delete()

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED
