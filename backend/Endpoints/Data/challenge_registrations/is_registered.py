# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.challenge_registrations.challenge_registration import ChallengeRegistrationTable

class IsUserRegisteredForChallenge(Resource):
  def get(self,uid,cid):
    db_session = DB_SESSION()

    registered_user = db_session.query(ChallengeRegistrationTable).filter_by(user_id=uid, challenge_id=cid).first()

    db_session.close()

    if (registered_user != None):
      response = jsonify({'registered': True})
      response.status_code = 200
      return response

    else:
      response = jsonify({'registered': False})
      response.status_code = 200
      return response

  def post(self,uid,cid):
    pass
    
  def put(self,uid,cid):
    pass

  def delete(self,uid,cid):
    pass