# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from datetime import datetime

class ClosedContractsByOwner(Resource):
  def get(self,username):
    db_session = DB_SESSION()

    challenge_objects = db_session.query(ContractTable).filter(ContractTable.owner==username).filter((ContractTable.submit_date < datetime.now()) | (ContractTable.completed == True)).all()
    challenge_schema = ContractTableSchema(many=True, exclude=('nda_path','contract_path',))
    challenges = challenge_schema.dump(challenge_objects)

    db_session.close()
    
    response = jsonify(challenges.data)
    response.status_code = 200
    return response

  def post(self,username):
    pass
    
  def put(self,username):
    pass

  def delete(self,username):
    pass