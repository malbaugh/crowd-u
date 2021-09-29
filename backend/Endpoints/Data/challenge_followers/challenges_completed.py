# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Challenges.contests.contest import ContestTable, ContestTableSchema
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED

class ChallengesCompletedByUser(Resource):
  def get(self,uid):
    db_session = DB_SESSION()
    
    follower_objects = db_session.query(ChallengeFollowerTable).filter_by(follower_id=uid,submitted=True).all()
    
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(username=username).first()
    
    else: 
      db_session.close()
      return UNAUTHORIZED

    if ((user.id == int(uid)) and (check_password_hash(user.password, password))):
      contests = []
      contracts = []

      for follower in follower_objects:
        challenge_id = follower.challenge_id

        if (db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()):
          contest_schema = ContestTableSchema(exclude=('nda_path','contract_path',))

          contest_object = db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()
          contest = contest_schema.dump(contest_object)

          contests.append(contest.data)

        elif (db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()):
          contract_schema = ContractTableSchema(exclude=('nda_path','contract_path',))

          contract_object = db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()
          contract = contract_schema.dump(contract_object)
          
          contracts.append(contract.data)

      db_session.close()

      response = jsonify({'contests': contests, 'contracts': contracts})
      response.status_code = 200
      return response

    else:
      db_session.close()
      return UNAUTHORIZED

  def post(self,uid):
    pass
    
  def put(self,uid):
    pass

  def delete(self,uid):
    pass