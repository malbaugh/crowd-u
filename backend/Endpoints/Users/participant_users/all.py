# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Users.participant_users.participant_user import ParticipantUserTable, ParticipantUserTableSchema

class All(Resource):
  def get(self):
    db_session = DB_SESSION()

    participant_user_objects = db_session.query(ParticipantUserTable).filter_by(email_confirmed=True).all()
    part_schema = ParticipantUserTableSchema(many=True, exclude=('password','date_of_birth','address','email','phone',))
    participant_users = part_schema.dump(participant_user_objects)

    db_session.close()
    
    response = jsonify(participant_users.data)
    response.status_code = 200
    return response

  def post(self):
    pass

  def put(self):
    pass

  def delete(self):
    pass