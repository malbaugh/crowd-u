# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND, UNAUTHORIZED
from werkzeug.security import check_password_hash

class Delete(Resource):
  def get(self,username):
    pass

  def post(self,username):
    pass

  def put(self,username):
    pass

  def delete(self,username):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      lead_username = SERIALIZER.loads(token)['username']
      lead_password = SERIALIZER.loads(token)['password']
      user_type = SERIALIZER.loads(token)['user_type']

    department = db_session.query(ChallengeUserTable).filter_by(username=username).first()
    
    if ((department == None) or (user_type != "challenger") or (department.org_lead == True)):
      db_session.close()
      return NOT_FOUND

    else: 
      leader = db_session.query(ChallengeUserTable).filter_by(parent_id=department.lead_id).first()

    if ((leader.username == lead_username) and check_password_hash(leader.password, lead_password)):
      db_session.delete(department)

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED
