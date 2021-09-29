# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION, S3_RESOURCE, SES_CLIENT
from Models.Users.users.user import UserTable
from Models.Users.challenge_users.challenge_user import ChallengeOwnerProfileTable, ChallengeUserTable, ChallengeOwnerProfileTableSchema, ChallengeUserTableSchema
from werkzeug.security import generate_password_hash
from botocore.exceptions import ClientError
import base64
from Statuses.statuses import NO_CONTENT, NOT_FOUND, CONFLICT

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

    if (db_session.query(UserTable).filter_by(email=request.get_json()['registration']['email']).first() == None):
      if (db_session.query(UserTable).filter_by(username=request.get_json()['registration']['username']).first() == None):
        if (request.get_json()['photo'] == None):
          profile_data = challenger_profile_from_request(request.get_json()['profile'])

        else: 
          profile_data = register_challenger_profile_from_request(request.get_json()['registration']['username'], request.get_json()['profile'], request.get_json()['photo'])
        
        challenge_user = challenger_from_request(request.get_json()['registration'])
        challenge_user.challenge_owner_profile_data = [profile_data]
        challenge_user.org_lead = True
        challenge_user.email_confirmed = False

        token = SERIALIZER.dumps({'username': request.get_json()['registration']['username'], 'password': request.get_json()['registration']['password'], 'user_type': "challenger"}).decode("utf-8")
        
        body_html = """<html>
          <head>
            <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
          </head>
          <style type="text/css">
            body{background-color: #88BDBF;margin: 0px;}
          </style>
          <body>
            <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #FF7A5A;">
              <tr>
                <td>
                  <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                    <tr>
                      <td style="background-color:#FF7A5A;height:100px;font-size:50px;color:#fff;"><i class="fa fa-envelope-o" aria-hidden="true"></i></td>
                    </tr>
                    <tr>
                      <td>
                        <h1 style="padding-top:25px;">Email Confirmation</h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="padding:0px 100px;">
                          Verify your email to finish your registration for Crowd-U.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href='https://www.api.crowd-u.com/verify-email/"""+token+"""'  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#FF7A5A; ">Verify Email</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                    <tr>
                      <td>
                        <div style="margin-top: 20px;">
                          <span style="font-size:12px;">Crowd-U</span><br>
                          <span style="font-size:12px;">Copyright © 2019 Crowd-U</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>"""

        try:
          SES_CLIENT.send_email(
            Destination={
              'ToAddresses': [
                request.get_json()['registration']['email'],
              ],
            },
            Message={
              'Body': {
                'Html': {
                  'Charset': "UTF-8",
                  'Data': body_html,
                },
              },
              'Subject': {
                'Charset': "UTF-8",
                'Data': "Confirm Your Email | Crowd-U",
              },
            },
            Source="support@crowd-u.com",
          )
      
        except ClientError:
          return NOT_FOUND
      
        else:
          if (request.get_json()['registration'].get('lastName') == None):
            challenge_user.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['username']+' '+request.get_json()['profile']['description']
          
          else:
            challenge_user.search = request.get_json()['registration']['firstName']+' '+request.get_json()['registration']['lastName']+' '+request.get_json()['registration']['username']+' '+request.get_json()['profile']['description']
          
          db_session.add(challenge_user)
          db_session.commit()
          db_session.close()
          return NO_CONTENT

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