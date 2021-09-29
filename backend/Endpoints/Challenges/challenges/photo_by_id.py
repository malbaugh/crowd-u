# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION, S3_RESOURCE
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Challenges.challenges.challenge import ChallengeTable
from Models.Challenges.contests.contest import ContestTable
from Models.Challenges.contracts.contract import ContractTable
from werkzeug.security import check_password_hash
import base64, random, string
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND

class ChallengePhotoById(Resource):
  def get(self,challenge_id):
    pass

  def post(self,challenge_id):
    pass
    
  def put(self,challenge_id):
    photo = request.get_json()['photo']

    rand_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(32)])

    db_session = DB_SESSION()

    challenge = db_session.query(ChallengeTable).filter_by(id=challenge_id).first()
    contest = db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()
    contract = db_session.query(ContractTable).filter_by(parent_id=challenge_id).first()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (challenge == None):
      db_session.close()
      return NOT_FOUND

    elif ((username == challenge.owner) and check_password_hash(user.password, password) and (contest != None)):
      filename = "media/" + contest.owner + "/" + challenge_id + "/" + "profile_picture" + rand_string+ ".png"

      bucket = S3_RESOURCE.Bucket(name='crowd-u-contests')

      try:
        S3_RESOURCE.Object(bucket_name=bucket.name, key=filename).delete()
      except:
        pass

      bucket_object = S3_RESOURCE.Object(bucket_name='crowd-u-contests', key=filename)
      bucket_object.put(Body=base64.b64decode(photo),ACL='public-read')

      file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

      contest.photo = file_url

      db_session.commit()
      db_session.close()

      response = jsonify({'photo': file_url})
      response.status_code = 200
      return response

    elif ((username == challenge.owner) and check_password_hash(user.password, password) and (contract != None)):
      filename = "media/" + contract.owner + "/" + challenge_id + "/" + "profile_picture" + rand_string+ ".png"
      bucket = S3_RESOURCE.Bucket(name='crowd-u-contracts')

      try:
        S3_RESOURCE.Object(bucket_name=bucket.name, key=filename).delete()
      except:
        pass

      bucket_object = S3_RESOURCE.Object(bucket_name='crowd-u-contracts', key=filename)
      bucket_object.put(Body=base64.b64decode(photo),ACL='public-read')

      file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

      contract.photo = file_url

      db_session.commit()
      db_session.close()

      response = jsonify({'photo': file_url})
      response.status_code = 200
      return response

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,challenge_id):
    pass