# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.user_followers.user_follower import UserFollowerTable

class Statistics(Resource):
  def get(self,fid):
    db_session = DB_SESSION()

    following = db_session.query(UserFollowerTable).filter_by(follower_id=fid).all()
    followers = db_session.query(UserFollowerTable).filter_by(user_id=fid).all()

    following_count = 0
    follower_count = 0

    for user in following:
      following_count = following_count + 1

    for people in followers:
      follower_count = follower_count + 1

    db_session.close()
    
    response = jsonify({'following': following_count, 'followers': follower_count})
    response.status_code = 200
    return response

  def post(self,fid):
    pass

  def put(self,fid):
    pass

  def delete(self,fid):
    pass