# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from datetime import datetime

class AllContracts(Resource):
  def get(self):
    db_session = DB_SESSION()

    contract_objects = db_session.query(ContractTable).filter((ContractTable.submit_date >= datetime.now()) & (ContractTable.completed == False)).all()
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