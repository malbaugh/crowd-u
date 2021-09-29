# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable, ChallengeSubmissionTableSchema
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, FORBIDDEN
from Models.Users.users.user import UserTable
from Models.Challenges.challenges.challenge import ChallengeTable

class InitializeSubmission(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    challenge_id = request.get_json()['challenge_id']
    user_id = request.get_json()['user_id']
    challenge_type = request.get_json()['challenge_type']
    
    challenge = db_session.query(ChallengeTable).filter_by(id=int(challenge_id)).first()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (challenge == None):
      db_session.close()
      return NOT_FOUND

    if (user.email_confirmed == False):
      db_session.close()
      return FORBIDDEN

    elif ((int(user_id) == user.id) and check_password_hash(user.password, password)):
      data = {
        'follower_id': user_id,
        'challenge_id': challenge_id
      }
      posted_submission = ChallengeSubmissionTableSchema(only=('follower_id','challenge_id'))\
        .load(data)
      file_submission = ChallengeSubmissionTable(**posted_submission.data)

      if (request.get_json()['team_id']):
        file_submission.team_id = request.get_json()['team_id']
      file_submission.name = ""
      file_submission.description = ""
      file_submission.about = ""
      file_submission.challenge_type = challenge_type

      db_session.add(file_submission)
      db_session.commit()
      file_id = file_submission.id
      db_session.close()

      response = jsonify({'id':file_id})
      response.status_code = 200
      return response
    
    else:
      db_session.close()
      return UNAUTHORIZED

  def put(self):
    pass

  def delete(self):
    pass
