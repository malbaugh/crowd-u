# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Challenges.contracts.contract import ContractTable
from Models.entity import SERIALIZER
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from werkzeug.security import check_password_hash
from datetime import datetime
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class UpdateContract(Resource):
  def get(self,challenge_id):
    pass

  def post(self,challenge_id):
    pass
    
  def put(self,challenge_id):
    db_session = DB_SESSION()
    challenge = db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (challenge == None):
      db_session.close()
      return NOT_FOUND

    elif ((username == challenge.owner) and check_password_hash(user.password, password)):
      data = request.get_json()['contract']

      contract = db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()

      contract.name = data['name']
      contract.about = data['about']
      contract.is_confidential = data['isConfidential']
      contract.concentration = data['concentrations']
      contract.description = data['description']
      contract.prize_total = data['prizeTotal']
      contract.register_date = data['registerDate']
      contract.submit_date = data['submitDate']
      contract.owner_username = data['ownerUsername']
      contract.photo = data['photo']
      contract.prizes = data['prizes']
      contract.eligibility = data['eligibility']
      contract.rules = data['rules']
      contract.requirements = data['requirements']
      contract.judging_criteria = data['judgingCriteria']
      contract.resources = data['resources']

      # TODO: Add judges and sponsors in a seperate API call

      contract.updated_at = datetime.now()
      contract.last_updated_by = "HTTP put request"

      contract.search = data['name']+' '+data['description']+' '+username
      contract.user_limit = data['userLimit']

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,challenge_id):
    pass