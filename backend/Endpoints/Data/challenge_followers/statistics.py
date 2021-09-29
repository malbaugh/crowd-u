# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable

class Statistics(Resource):
  def get(self,cid):
    db_session = DB_SESSION()

    users_following = db_session.query(ChallengeFollowerTable).filter_by(challenge_id=cid).all()
    
    follower_count = 0

    for user in users_following:
      follower_count = follower_count + 1

    number_submitted = db_session.query(ChallengeFollowerTable).filter_by(challenge_id=cid,submitted=True).all()
    
    submitted_count = 0

    for submission in number_submitted:
      submitted_count = submitted_count + 1

    db_session.close()

    response = jsonify({'follower_count': follower_count, 'submission_count': submitted_count})
    response.status_code = 200
    return response

  def post(self,sid):
    pass

  def put(self,sid):
    pass

  def delete(self,sid):
    pass