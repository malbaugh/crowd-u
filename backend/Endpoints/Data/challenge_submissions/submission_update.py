# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT
from Models.Users.users.user import UserTable

class UpdateSubmission(Resource):
  def get(self,sid):
    pass

  def post(self,sid):
    pass
    
  def put(self,sid):
    data = request.get_json()['submission']
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
      submission.name = data['name']
      submission.description = data['description']
      submission.about = data['about']

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,sid):
    pass