# coding=utf-8

from os import path
from datetime import datetime

from flask_restful import Resource
from flask import jsonify

from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Challenges.contests.contest import ContestTable, ContestTableSchema
from Models.Challenges.contracts.contract import ContractTable, ContractTableSchema
from Statuses.statuses import NOT_FOUND

class ChallengesByOwner(Resource):
  def get(self,username):
    db_session = DB_SESSION()

    user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    else:
      departments_contests_open = []
      departments_contracts_open = []
      departments_contests_closed = []
      departments_contracts_closed = []

      contest_schema = ContestTableSchema(exclude=('nda_path','contract_path',))
      contract_schema = ContractTableSchema(exclude=('nda_path','contract_path',))

      if (user.org_lead == True):
        for department in db_session.query(ChallengeUserTable).filter_by(lead_id=user.parent_id).all():
          for contest_d1 in db_session.query(ContestTable).filter((ContestTable.owner==department.username) & (ContestTable.submit_date >= datetime.now()) & (ContestTable.completed == False)).all():
            department_contests = contest_schema.dump(contest_d1)
            departments_contests_open.append(department_contests.data)

          for contract_d1 in db_session.query(ContractTable).filter((ContractTable.owner==department.username) & (ContractTable.submit_date >= datetime.now()) & (ContractTable.completed == False)).all():
            department_contracts = contract_schema.dump(contract_d1)
            departments_contracts_open.append(department_contracts.data)

          for contest_d2 in db_session.query(ContestTable).filter(ContestTable.owner==department.username).filter((ContestTable.submit_date < datetime.now()) | (ContestTable.completed == True)).all():
            department_contests2 = contest_schema.dump(contest_d2)
            departments_contests_closed.append(department_contests2.data)

          for contract_d2 in db_session.query(ContractTable).filter(ContractTable.owner==department.username).filter((ContractTable.submit_date < datetime.now()) | (ContractTable.completed == True)).all():
            department_contracts2 = contract_schema.dump(contract_d2)
            departments_contracts_closed.append(department_contracts2.data)

      contest_schema = ContestTableSchema(many=True, exclude=('nda_path','contract_path',))
      contract_schema = ContractTableSchema(many=True, exclude=('nda_path','contract_path',))

      contest_objects = db_session.query(ContestTable).filter((ContestTable.owner==username) & (ContestTable.submit_date >= datetime.now()) & (ContestTable.completed == False)).all()
      contests = contest_schema.dump(contest_objects)

      contract_objects = db_session.query(ContractTable).filter((ContractTable.owner==username) & (ContractTable.submit_date >= datetime.now()) & (ContestTable.completed == False)).all()
      contracts = contract_schema.dump(contract_objects)

      contest_objects_closed = db_session.query(ContestTable).filter(ContestTable.owner==username).filter((ContestTable.submit_date < datetime.now()) | (ContestTable.completed == True)).all()
      contests2 = contest_schema.dump(contest_objects_closed)

      contract_objects_closed = db_session.query(ContractTable).filter(ContractTable.owner==username).filter((ContractTable.submit_date < datetime.now()) | (ContractTable.completed == True)).all()
      contracts2 = contract_schema.dump(contract_objects_closed)

      db_session.close()
      response = jsonify({'contests': contests.data, 'contracts': contracts.data, 'closed_contests': contests2.data, 'closed_contracts': contracts2.data, 'departments_contests': departments_contests_open, 'departments_contracts': departments_contracts_open, 'departments_closed_contests': departments_contests_closed, 'departments_closed_contracts': departments_contracts_closed})
      response.status_code = 200
      return response

  def post(self,username):
    pass
    
  def put(self,username):
    pass

  def delete(self,username):
    pass