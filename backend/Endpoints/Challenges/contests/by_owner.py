# coding=utf-8

from os import path
from datetime import datetime
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Challenges.contests.contest import ContestTable, ContestTableSchema

class ContestsByOwner(Resource):
  def get(self,username):
    db_session = DB_SESSION()
    
    challenge_objects = db_session.query(ContestTable).filter((ContestTable.owner==username) & (ContestTable.submit_date >= datetime.now()) & (ContestTable.completed == False)).all()
    challenge_schema = ContestTableSchema(many=True, exclude=('nda_path','contract_path',))
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