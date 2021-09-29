# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Users.teams.team import TeamTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from Statuses.statuses import NOT_FOUND
from Models.Challenges.challenges.challenge import ChallengeTable

class SubmissionWinnersByChallenge(Resource):
  def get(self,cid):
    db_session = DB_SESSION()

    challenge = db_session.query(ChallengeTable).filter_by(id=cid).first()

    if (challenge == None):
      db_session.close()
      return NOT_FOUND
    
    challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(challenge_id=cid,winner=True).all()
    submissions = []
    for entry in challenge_submissions:
      members = []
      team_name = ""

      if (entry.team_id != None):
        team = db_session.query(TeamTable).filter_by(id=entry.team_id).first()
        members = team.members
        team_name = team.name

      else:
        participant = db_session.query(ParticipantUserTable).filter_by(parent_id=entry.follower_id).first()
        members = [participant.username]
      
      submissions.append({'id':entry.id,'challenge_type':entry.challenge_type,'submitted':entry.submitted,'follower_id':entry.follower_id,'team_id':entry.team_id,'challenge_id':entry.challenge_id,'name':entry.name,'team_name':team_name,'members':members,'photo':entry.photo,'description':entry.description,'about':entry.about,'winner':entry.winner,'winner_type':entry.winner_type})

    db_session.close()

    response = jsonify(submissions)
    response.status_code = 200
    return response

  def post(self,cid):
    pass
    
  def put(self,cid):
    pass

  def delete(self,cid):
    pass