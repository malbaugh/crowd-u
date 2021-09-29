# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION, S3_RESOURCE
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND
from Models.Users.users.user import UserTable
import base64, random, string

class UpdateSubmissionPhoto(Resource):
  def get(self,sid):
    pass

  def post(self,sid):
    pass
    
  def put(self,sid):
    photo = request.get_json()['photo']

    rand_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(32)])

    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']

    submission = db_session.query(ChallengeSubmissionTable).filter_by(id=sid).first()
    
    if (submission == None):
      db_session.close()
      return NOT_FOUND

    else:
      user = db_session.query(UserTable).filter_by(id=submission.follower_id).first()
    
    if ((user.username == username) and check_password_hash(user.password, password) and (submission.submitted == False)):
      filename = "media/submission/" + sid + "/" + "profile_picture" + rand_string+ ".png"

      bucket = S3_RESOURCE.Bucket(name='crowd-u-contests')

      try:
        S3_RESOURCE.Object(bucket_name=bucket.name, key=filename).delete()
      except:
        pass

      bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
      bucket_object.put(Body=base64.b64decode(photo),ACL='public-read')

      file_url = "https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename)

      submission.photo = file_url

      db_session.commit()
      db_session.close()

      response = jsonify({'photo': file_url})
      response.status_code = 200
      return response

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,sid):
    pass