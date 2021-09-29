# coding=utf-8

from os import path
from Models.entity import SERIALIZER

from flask_restful import Resource
from flask import jsonify, request

from Models.entity import DB_SESSION
from Models.Challenges.challenges.challenge import ChallengeTable
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Challenges.contests.contest import ContestTable, ContestTableSchema
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from Statuses.statuses import NOT_FOUND
from werkzeug.security import check_password_hash

class ChallengesById(Resource):
  def get(self,challenge_id):
    db_session = DB_SESSION()

    challenge = db_session.query(ChallengeTable).filter_by(id=challenge_id).first()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()
      authorization = True

    else:
      authorization = False

    if (challenge == None):
      db_session.close()
      return NOT_FOUND

    elif (db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()):
      if (authorization and (username == challenge.owner) and check_password_hash(user.password, password)):
        contest_schema = ContestTableSchema(exclude=('nda_path','contract_path',))

      else:
        contest_schema = ContestTableSchema(exclude=('nda_path','contract_path',))

      contest_object = db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()
      contest = contest_schema.dump(contest_object)

      db_session.close()
      response = jsonify(contest)
      response.status_code = 200
      return response

    elif (db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()):
      if (authorization and (username == challenge.owner) and check_password_hash(user.password, password)):
        contract_schema = ContractTableSchema(exclude=('nda_path','contract_path',))

      else: 
        contract_schema = ContractTableSchema(exclude=('nda_path','contract_path',))

      contract_object = db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()
      contract = contract_schema.dump(contract_object)

      db_session.close()
      response = jsonify(contract)
      response.status_code = 200
      return response

  def post(self,challenge_id):
    pass
    
  def put(self,challenge_id):
    pass

  def delete(self,challenge_id):
    pass