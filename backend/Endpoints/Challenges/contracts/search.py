# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from datetime import datetime
from Models.Users.users.user import UserTable
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable
from sqlalchemy import func

class SearchContracts(Resource):
  def get(self):
    db_session = DB_SESSION()

    contract_objects = db_session.query(ContractTable)

    if (request.args.get('query')):
      search = request.args.get('query').split(' ')
      
      for word in search:
        contract_objects = contract_objects.filter(ContractTable.search.ilike('%' + word + '%'))
    
    if (request.args.get('owner')):
      contract_objects = contract_objects.filter(ContractTable.owner == request.args.get('owner'))
    
    if (request.args.get('complete')):
      if (request.args.get('complete')=="true"):
        contract_objects = contract_objects.filter((ContractTable.submit_date < datetime.now()) | (ContractTable.completed == True))
      else:
        contract_objects = contract_objects.filter((ContractTable.submit_date >= datetime.now()) & (ContractTable.completed == False))
        
    if (request.args.get('prizeMin')):
      contract_objects = contract_objects.filter(ContractTable.prize_total >= request.args.get('prizeMin'))

    if (request.args.get('prizeMax')):
      contract_objects = contract_objects.filter(ContractTable.prize_total <= request.args.get('prizeMax'))

    if (request.args.get('startDate')):
      contract_objects = contract_objects.filter(ContractTable.register_date >= request.args.get('startDate'))

    if (request.args.get('endDate')):
      contract_objects = contract_objects.filter(ContractTable.submit_date <= request.args.get('endDate'))

    if (request.args.get('concentration1')):
      contract_objects = contract_objects.filter(func.array_to_string(ContractTable.concentration,',','*').ilike('%' + request.args.get('concentration1') + '%'))

    if (request.args.get('concentration2')):
      contract_objects = contract_objects.filter(func.array_to_string(ContractTable.concentration,',','*').ilike('%' + request.args.get('concentration2') + '%'))

    if (request.args.get('concentration3')):
      contract_objects = contract_objects.filter(func.array_to_string(ContractTable.concentration,',','*').ilike('%' + request.args.get('concentration3') + '%'))

    if (request.args.get('follower')):
      user = db_session.query(UserTable).filter_by(username=request.args.get('follower')).first()

      if (request.args.get('submitted')=="true"):
        follower_objects = db_session.query(ChallengeFollowerTable).filter_by(follower_id=user.id,submitted=True)

        ids = []
        for follower in follower_objects:
          ids.append(follower.challenge_id)

        contract_objects = contract_objects.filter(ContractTable.parent_id.in_(ids))
      
      else:
        follower_objects = db_session.query(ChallengeFollowerTable).filter_by(follower_id=user.id,submitted=False)

        ids = []
        for follower in follower_objects:
          ids.append(follower.challenge_id)

        contract_objects = contract_objects.filter(ContractTable.parent_id.in_(ids))

    contract_schema = ContractTableSchema(many=True, exclude=('nda_path','contract_path',))
    contracts = contract_schema.dump(contract_objects)

    db_session.close()
    
    response = jsonify(contracts.data)
    response.status_code = 200
    return response

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass