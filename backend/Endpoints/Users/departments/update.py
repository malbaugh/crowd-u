# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND, UNAUTHORIZED
from werkzeug.security import check_password_hash
from datetime import datetime

class Update(Resource):
  def get(self,username):
    pass

  def post(self,username):
    pass

  def put(self,username):
    db_session = DB_SESSION()

    data = request.get_json()

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
      department.department = data['department']['department']
      department.email = data['department']['challengerRegistrationData']['email']
      department.poc_first_name = data['department']['challengerRegistrationData']['pocFirstName']
      department.poc_last_name = data['department']['challengerRegistrationData']['pocLastName']
      department.poc_phone = data['department']['challengerRegistrationData']['pocPhone']
      department.updated_at = datetime.now()
      department.last_updated_by = "HTTP put request"   

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,username):
    pass