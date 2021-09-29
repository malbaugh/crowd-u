# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable, ChallengeUserTableSchema

class All(Resource):
  def get(self):
    db_session = DB_SESSION()

    challenge_user_objects = db_session.query(ChallengeUserTable).filter_by(email_confirmed=True).all()
    challenge_user_schema = ChallengeUserTableSchema(many=True, exclude=('password','poc_first_name','poc_last_name','poc_phone','email',))
    challenge_users = challenge_user_schema.dump(challenge_user_objects)

    db_session.close()

    response = jsonify(challenge_users.data)
    response.status_code = 200
    return response

  def post(self):
    pass

  def put(self):
    pass

  def delete(self):
    pass