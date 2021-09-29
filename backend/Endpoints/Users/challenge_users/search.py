# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request, jsonify
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeOwnerProfileTable, ChallengeUserTable, ChallengeUserTableSchema

class Search(Resource):
  def get(self):
    db_session = DB_SESSION()

    challenge_user_objects = db_session.query(ChallengeUserTable).filter_by(email_confirmed=True)

    if (request.args.get('query')):
      search = request.args.get('query').split(' ')
      
      for word in search:
        challenge_user_objects = challenge_user_objects.filter(ChallengeUserTable.search.ilike('%' + word + '%'))

    if (request.args.get('industry')):
      challenge_user_objects = challenge_user_objects.join(ChallengeUserTable.challenge_owner_profile_data).filter(ChallengeOwnerProfileTable.industry == request.args.get('industry'))
    
    if (request.args.get('city')):
      challenge_user_objects = challenge_user_objects.join(ChallengeUserTable.challenge_owner_profile_data).filter(ChallengeOwnerProfileTable.city.ilike('%' + request.args.get('city') + '%'))
    
    if (request.args.get('state')):
      challenge_user_objects = challenge_user_objects.join(ChallengeUserTable.challenge_owner_profile_data).filter(ChallengeOwnerProfileTable.state == request.args.get('state'))

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