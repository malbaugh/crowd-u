# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from Models.entity import SERIALIZER
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, FORBIDDEN

class RegisterContract(Resource):
  def get(self):
    pass

  def post(self):
    data = request.get_json()
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (user.email_confirmed == False):
      db_session.close()
      return FORBIDDEN

    elif ((username == data['ownerUsername']) and check_password_hash(user.password, password)):
      corrected_data = {
        'name': data['name'], 
        'about': data['about'], 
        'concentration': data['concentrations'], 
        'description': data['description'], 
        'is_confidential': data['isConfidential'],
        'prize_total': data['prizeTotal'],
        'register_date': data['registerDate'],
        'submit_date': data['submitDate'],
        'owner': data['ownerUsername'],
        'photo': data['photo']
      }

      posted_contract = ContractTableSchema(only=('name', 'about', 'concentration', 'description', 'is_confidential', 'prize_total', 'register_date', 'submit_date', 'owner', 'photo'))\
        .load(corrected_data)
      contract = ContractTable(**posted_contract.data, created_by="HTTP post request")

      contract.search = data['name']+' '+data['description']+' '+data['ownerUsername']

      contract.user_limit = data['userLimit']

      db_session = DB_SESSION()

      db_session.add(contract)
      db_session.commit()

      cid = contract.parent_id

      db_session.close()

      response = jsonify({'id': cid})
      response.status_code = 201
      return response

    else: 
      db_session.close()
      return UNAUTHORIZED

    
  def put(self):
    pass

  def delete(self):
    pass