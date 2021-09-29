# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED
from datetime import datetime

class Update(Resource):
  def get(self,username):
    pass

  def post(self,username):
    pass

  def put(self,username):
    db_session = DB_SESSION()

    data = request.get_json()

    if (data['registration'].get('lastName') == None):
      posted_last_name = ""

    else:
      posted_last_name = data['registration']['lastName']

    token = request.headers.get("Authorization")
    if (token != None):
      current_username = SERIALIZER.loads(token)['username']
      current_password = SERIALIZER.loads(token)['password']
      user_type = SERIALIZER.loads(token)['user_type']

    else: 
      db_session.close()
      return UNAUTHORIZED

    user = db_session.query(UserTable).filter_by(username=username).first()
    challenge_user_object = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (challenge_user_object == None):
      db_session.close()
      return NOT_FOUND

    if ((current_username == username) and check_password_hash(user.password, current_password) and (user_type == "challenger") and (challenge_user_object.org_lead == True)):
      for department in db_session.query(ChallengeUserTable).filter_by(lead_id=challenge_user_object.parent_id).all():
        department.challenge_owner_profile_data[0].photo = data['profile']['photo']
        department.challenge_owner_profile_data[0].description = data['profile']['description']
        department.challenge_owner_profile_data[0].about = data['profile']['about']
        department.challenge_owner_profile_data[0].address = data['profile']['address']
        department.challenge_owner_profile_data[0].city = data['profile']['city']
        department.challenge_owner_profile_data[0].state = data['profile']['state']
        department.challenge_owner_profile_data[0].postal_code = data['profile']['postalCode']
        department.challenge_owner_profile_data[0].linkedin = data['profile']['linkedin']
        department.challenge_owner_profile_data[0].website = data['profile']['website']
        department.challenge_owner_profile_data[0].industry = data['profile']['industry']
        department.first_name = data['registration']['firstName']
        department.last_name = posted_last_name

        department.last_updated_by = "HTTP put request"
        department.updated_at = datetime.now()

        if (request.get_json()['registration'].get('lastName') == None):
          department.search = request.get_json()['registration']['firstName']+' '+department.username+' '+department.department+' '+request.get_json()['profile']['description']
        else:
          department.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['lastName']+' '+department.username+' '+department.department+' '+request.get_json()['profile']['description']
            
      challenge_user_object.email = data['registration']['email']
      challenge_user_object.first_name = data['registration']['firstName']
      challenge_user_object.last_name = posted_last_name
      challenge_user_object.poc_first_name = data['registration']['pocFirstName']
      challenge_user_object.poc_last_name = data['registration']['pocLastName']
      challenge_user_object.poc_phone = data['registration']['pocPhone']
      challenge_user_object.updated_at = datetime.now()
      challenge_user_object.last_updated_by = "HTTP put request"

      challenge_user_object.challenge_owner_profile_data[0].photo = data['profile']['photo']
      challenge_user_object.challenge_owner_profile_data[0].description = data['profile']['description']
      challenge_user_object.challenge_owner_profile_data[0].about = data['profile']['about']
      challenge_user_object.challenge_owner_profile_data[0].address = data['profile']['address']
      challenge_user_object.challenge_owner_profile_data[0].city = data['profile']['city']
      challenge_user_object.challenge_owner_profile_data[0].state = data['profile']['state']
      challenge_user_object.challenge_owner_profile_data[0].postal_code = data['profile']['postalCode']
      challenge_user_object.challenge_owner_profile_data[0].linkedin = data['profile']['linkedin']
      challenge_user_object.challenge_owner_profile_data[0].website = data['profile']['website']
      challenge_user_object.challenge_owner_profile_data[0].industry = data['profile']['industry']

      if (request.get_json()['registration'].get('lastName') == None):
        challenge_user_object.search = request.get_json()['registration']['firstName']+' '+username+' '+request.get_json()['profile']['description']
      else:
        challenge_user_object.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['lastName']+' '+username+' '+request.get_json()['profile']['description']
            
      db_session.commit()
      db_session.close()
      return NO_CONTENT
    
    elif ((current_username == username) and check_password_hash(user.password, current_password) and (user_type == "challenger") and (challenge_user_object.org_lead == False)):
      challenge_user_object = db_session.query(ChallengeUserTable).filter_by(username=username).first()

      challenge_user_object.email = data['registration']['email']
      challenge_user_object.poc_first_name = data['registration']['pocFirstName']
      challenge_user_object.poc_last_name = data['registration']['pocLastName']
      challenge_user_object.poc_phone = data['registration']['pocPhone']
      challenge_user_object.updated_at = datetime.now()
      challenge_user_object.last_updated_by = "HTTP put request"

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    elif ((current_username == username) and check_password_hash(user.password, current_password) and (user_type == "participant")):
      db_session.close()
      return BAD_REQUEST

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,username):
    pass