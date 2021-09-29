# coding=utf-8

from os import path
from datetime import datetime
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Challenges.contests.contest import ContestTable, ContestTableSchema

class AllContests(Resource):
  def get(self):
    db_session = DB_SESSION()

    contest_objects = db_session.query(ContestTable).filter((ContestTable.submit_date >= datetime.now()) & (ContestTable.completed == False)).all()
    contest_schema = ContestTableSchema(many=True, exclude=('nda_path','contract_path',))
    contests = contest_schema.dump(contest_objects)

    db_session.close()

    response = jsonify(contests.data)
    response.status_code = 200
    return response

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass