# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND
from Models.Challenges.challenges.challenge import ChallengeTable

class SelectApplicationWinners(Resource):
  def get(self,cid):
    pass

  def post(self,cid):
    pass
    
  def put(self,cid):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(ChallengeUserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return UNAUTHORIZED

    if (user == None):
      db_session.close()
      return NOT_FOUND

    challenge = db_session.query(ChallengeTable).filter_by(id=cid).first()

    if (challenge == None):
      db_session.close()
      return NOT_FOUND

    elif challenge.winner_selected == True:
      db_session.close()
      return BAD_REQUEST

    elif ((username == challenge.owner) and check_password_hash(user.password, password)):
      data = request.get_json()
      for winner in data:
        team_id = winner['teamId']
        follower_id = winner['followerId']

        if (team_id != None):
          submission = db_session.query(ChallengeSubmissionTable).filter_by(challenge_id=cid,team_id=team_id).first()
          submission.winner = True
          submission.winner_type = winner['winnerType']
            
        else:
          submission = db_session.query(ChallengeSubmissionTable).filter_by(challenge_id=cid,follower_id=follower_id).first()
          submission.winner = True
          submission.winner_type = winner['winnerType']

      challenge.winner_selected = True

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else: 
      db_session.close()
      return UNAUTHORIZED

  def delete(self,cid):
    pass