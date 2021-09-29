# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.user_followers.user_follower import UserFollowerTable

class UserFollowed(Resource):
  def get(self,fid,uid):
    db_session = DB_SESSION()

    follower = db_session.query(UserFollowerTable).filter_by(follower_id=fid, user_id=uid).first()

    db_session.close()

    if (follower != None):
      response = jsonify({'following': True})
      response.status_code = 200
      return response

    else:
      response = jsonify({'following': False})
      response.status_code = 200
      return response

  def post(self,fid,uid):
    pass

  def put(self,fid,uid):
    pass

  def delete(self,fid,uid):
    pass