# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION, S3_RESOURCE
from Models.Users.challenge_users.challenge_user import ChallengeOwnerProfileTable, ChallengeUserTable, ChallengeOwnerProfileTableSchema, ChallengeUserTableSchema
from Models.Users.users.user import UserTable
from Statuses.statuses import NO_CONTENT, NOT_FOUND, CONFLICT, UNAUTHORIZED
from werkzeug.security import check_password_hash, generate_password_hash
import base64

def challenger_from_request(posted_registration_data):
  if (posted_registration_data.get('lastName') == None):
    posted_last_name = ""

  else:
    posted_last_name = posted_registration_data['lastName']

  corrected_registration_data = {
    'email': posted_registration_data['email'], 
    'password': generate_password_hash(posted_registration_data['password']), 
    'username': posted_registration_data['username'], 
    'first_name': posted_registration_data['firstName'], 
    'last_name': posted_last_name,
    'poc_first_name': posted_registration_data['pocFirstName'], 
    'poc_last_name': posted_registration_data['pocLastName'],
    'poc_phone': posted_registration_data['pocPhone']
  }

  posted_challenge_user = ChallengeUserTableSchema(only=('email', 'password', 'username', 'first_name', 'last_name', 'poc_first_name', 'poc_last_name', 'poc_phone'))\
    .load(corrected_registration_data)

  challenge_user = ChallengeUserTable(**posted_challenge_user.data, created_by="HTTP post request")
  return challenge_user

def register_challenger_profile_from_request(username, posted_profile_data, photo):
  filename = "media/" + username + "/" + "profile_picture.png"

  bucket = S3_RESOURCE.Bucket(name='crowd-u-challenge-users')
  bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
  bucket_object.put(Body=base64.b64decode(photo),ACL='public-read')

  file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

  corrected_profile_data = { 
    'photo': file_url, 
    'description': posted_profile_data['description'],
    'about': posted_profile_data['about'],
    'address': posted_profile_data['address'],
    'city': posted_profile_data['city'],
    'state': posted_profile_data['state'],
    'postal_code': posted_profile_data['postalCode'],
    'linkedin': posted_profile_data['linkedin'],
    'website': posted_profile_data['website'],
    'industry': posted_profile_data['industry'] 
  }

  posted_challenge_profile = ChallengeOwnerProfileTableSchema(only=('photo','description','about','address','city','state','postal_code','linkedin','website','industry'))\
    .load(corrected_profile_data)

  profile_data = ChallengeOwnerProfileTable(**posted_challenge_profile.data)
  return profile_data

def challenger_profile_from_request(posted_profile_data):
  corrected_profile_data = { 
    'photo': posted_profile_data['photo'], 
    'description': posted_profile_data['description'],
    'about': posted_profile_data['about'],
    'address': posted_profile_data['address'],
    'city': posted_profile_data['city'],
    'state': posted_profile_data['state'],
    'postal_code': posted_profile_data['postalCode'],
    'linkedin': posted_profile_data['linkedin'],
    'website': posted_profile_data['website'],
    'industry': posted_profile_data['industry'] 
  }

  posted_challenge_profile = ChallengeOwnerProfileTableSchema(only=('photo','description','about','address','city','state','postal_code','linkedin','website','industry'))\
    .load(corrected_profile_data)

  profile_data = ChallengeOwnerProfileTable(**posted_challenge_profile.data)
  return profile_data

class Register(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user_type = SERIALIZER.loads(token)['user_type']

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user_type == "challenger"):
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user.email_confirmed == False):
      db_session.close()
      return NOT_FOUND

    if (db_session.query(UserTable).filter_by(email=request.get_json()['registration']['email']).first() == None):
      if (db_session.query(UserTable).filter_by(username=request.get_json()['registration']['username']).first() == None):
        if ((user.org_lead == True) and (user.parent_id == request.get_json()['leaderId']) and check_password_hash(user.password, password)):
          challenge_user = challenger_from_request(request.get_json()['registration'])
          profile_data = challenger_profile_from_request(request.get_json()['profile'])

          challenge_user.org_lead = False
          challenge_user.email_confirmed = True

          if (request.get_json()['registration'].get('lastName') == None):
            challenge_user.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['username']+' '+request.get_json()['name']+' '+request.get_json()['profile']['description']
          else:
            challenge_user.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['lastName']+' '+request.get_json()['registration']['username']+' '+request.get_json()['name']+' '+request.get_json()['profile']['description']
          
          challenge_user.lead_id = request.get_json()['leaderId']
          challenge_user.department = request.get_json()['name']
          challenge_user.challenge_owner_profile_data = [profile_data]
          
          db_session.add(challenge_user)
          db_session.commit()
          db_session.close()
          return NO_CONTENT

        else:
          db_session.close()
          return UNAUTHORIZED

      else:
          db_session.close()
          return CONFLICT

    else: 
      db_session.close()
      return CONFLICT

  def put(self):
    pass

  def delete(self):
    pass