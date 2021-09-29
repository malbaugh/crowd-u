# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED
from Models.entity import SERIALIZER
from Models.Users.users.user import UserTable
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

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif ((current_username == username) and check_password_hash(user.password, current_password) and (user_type == "participant")):
      participant_user_object = db_session.query(ParticipantUserTable).filter_by(username=username).first()

      participant_user_object.email = data['registration']['email']
      participant_user_object.first_name = data['registration']['firstName']
      participant_user_object.last_name = posted_last_name
      participant_user_object.university = data['registration']['university']
      participant_user_object.updated_at = datetime.now()
      participant_user_object.last_updated_by = "HTTP put request"

      participant_user_object.participant_profile_data[0].photo = data['profile']['photo']
      participant_user_object.participant_profile_data[0].description = data['profile']['description']
      participant_user_object.participant_profile_data[0].about = data['profile']['about']
      participant_user_object.participant_profile_data[0].address = data['profile']['address']
      participant_user_object.participant_profile_data[0].city = data['profile']['city']
      participant_user_object.participant_profile_data[0].state = data['profile']['state']
      participant_user_object.participant_profile_data[0].postal_code = data['profile']['postalCode']
      participant_user_object.participant_profile_data[0].linkedin = data['profile']['linkedin']
      participant_user_object.participant_profile_data[0].website = data['profile']['website']
      participant_user_object.participant_profile_data[0].phone = data['profile']['phone']
      participant_user_object.participant_profile_data[0].major = data['profile']['major']
      participant_user_object.participant_profile_data[0].education_status = data['profile']['educationStatus']
      participant_user_object.participant_profile_data[0].enrollment_status = data['profile']['enrollmentStatus']
      participant_user_object.participant_profile_data[0].travel_availability = data['profile']['travelAvailability']
      participant_user_object.participant_profile_data[0].concentration = data['profile']['concentration']

      if (data['registration'].get('lastName') == None):
        participant_user_object.search = request.get_json()['registration']['firstName']+' '+username+' '+request.get_json()['profile']['description']

      else:
        participant_user_object.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['lastName']+' '+username+' '+request.get_json()['profile']['description']

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    elif ((current_username == username) and check_password_hash(user.password, current_password) and (user_type == "challenger")):
      db_session.close()
      return BAD_REQUEST

    else: 
      db_session.close()
      return UNAUTHORIZED

  def delete(self,username):
    pass