# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.challenge_registrations.challenge_registration import ChallengeRegistrationTable

class Statistics(Resource):
  def get(self,cid):
    db_session = DB_SESSION()

    users_registered = db_session.query(ChallengeRegistrationTable).filter_by(challenge_id=cid).all()
    
    registration_count = 0

    for user in users_registered:
      registration_count = registration_count + 1

    db_session.close()

    response = jsonify({'count': registration_count})
    response.status_code = 200
    return response

  def post(self,sid):
    pass

  def put(self,sid):
    pass

  def delete(self,sid):
    pass