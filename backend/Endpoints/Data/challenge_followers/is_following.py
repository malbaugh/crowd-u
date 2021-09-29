# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable

class IsUserFollowingChallenge(Resource):
  def get(self,uid,cid):
    db_session = DB_SESSION()

    follower = db_session.query(ChallengeFollowerTable).filter_by(follower_id=uid, challenge_id=cid).first()

    db_session.close()

    if (follower != None):
      response = jsonify({'following': True, 'submitted': follower.submitted})
      response.status_code = 200
      return response

    else:
      response = jsonify({'following': False, 'submitted': False})
      response.status_code = 200
      return response

  def post(self,uid,cid):
    pass
    
  def put(self,uid,cid):
    pass

  def delete(self,uid,cid):
    pass