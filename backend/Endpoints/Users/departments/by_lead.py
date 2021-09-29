# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request, jsonify
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable, ChallengeUserTableSchema
from werkzeug.security import check_password_hash
from Statuses.statuses import NOT_FOUND, UNAUTHORIZED

class ByLeader(Resource):
  def get(self,lead_id):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user_type = SERIALIZER.loads(token)['user_type']

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user_type == "challenger"):
      user = db_session.query(ChallengeUserTable).filter_by(parent_id=lead_id).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif ((user.username == username) and check_password_hash(user.password, password) and (user.org_lead == True)):
      challenge_user_objects = db_session.query(ChallengeUserTable).filter_by(lead_id=lead_id).all()
      challenge_user_schema = ChallengeUserTableSchema(many=True, exclude=('password',))
      challenge_users = challenge_user_schema.dump(challenge_user_objects)

      db_session.close()

      response = jsonify(challenge_users.data)
      response.status_code = 200
      return response

    else:
      challenge_user_objects = db_session.query(ChallengeUserTable).filter_by(lead_id=lead_id).all()
      challenge_user_schema = ChallengeUserTableSchema(many=True, exclude=('password','poc_first_name','poc_last_name','poc_phone','email',))
      challenge_users = challenge_user_schema.dump(challenge_user_objects)

      db_session.close()

      response = jsonify(challenge_users.data)
      response.status_code = 200
      return response

  def post(self,lead_id):
    pass

  def put(self,lead_id):
    pass

  def delete(self,lead_id):
    pass