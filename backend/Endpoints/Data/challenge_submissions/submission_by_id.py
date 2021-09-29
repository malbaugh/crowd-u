# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION, S3_CLIENT
from Models.Users.teams.team import TeamTable
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND
from Models.Users.users.user import UserTable
from Models.Challenges.challenges.challenge import ChallengeTable
from sqlalchemy import func

class SubmissionById(Resource):
  def get(self,sid):
    db_session = DB_SESSION()

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(username=username).first()
      challenge_submission = db_session.query(ChallengeSubmissionTable).filter_by(id=sid).first()
      logged_out = False

    else: 
      logged_out = True

    if ((logged_out == False) and (challenge_submission != None)):
      teams = db_session.query(TeamTable).filter(func.array_to_string(TeamTable.members,',','*').ilike('%' + username + '%')).filter(TeamTable.leader!=username).all()
      
      team_ids = []
      for team in teams:
        team_ids.append(team.id)
      
      if challenge_submission.team_id in team_ids:
        in_team = True
      else:
        in_team = False

      challenge = db_session.query(ChallengeTable).filter_by(id=challenge_submission.challenge_id).first()
      challenge_owner = db_session.query(ChallengeUserTable).filter_by(username=challenge.owner).first()
      if (challenge.is_confidential == True):
        confidential = True
      else:
        confidential = False

      if (challenge_submission.challenge_type == 'contract'):
        confidential = True

    elif ((logged_out == True) and (challenge_submission != None)):
      in_team = False

      challenge = db_session.query(ChallengeTable).filter_by(id=challenge_submission.challenge_id).first()
      challenge_owner = db_session.query(ChallengeUserTable).filter_by(username=challenge.owner).first()
      if (challenge.is_confidential == True):
        confidential = True
      else:
        confidential = False

      if (challenge_submission.challenge_type == 'contract'):
        confidential = True

    else:
      db_session.close()
      return NOT_FOUND

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif ((logged_out == False) and ((user.username == username) and check_password_hash(user.password, password) and ((challenge_submission.follower_id == user.id) or (in_team))) or ((challenge_owner.username == username) and check_password_hash(challenge_owner.password, password))):
      files = []
      file_names = []
      members = []
      team_name = ""

      if (challenge_submission.team_id != None):
        team = db_session.query(TeamTable).filter_by(id=challenge_submission.team_id).first()
        members = team.members
        team_name = team.name

      else:
        participant = db_session.query(ParticipantUserTable).filter_by(parent_id=challenge_submission.follower_id).first()
        members = [participant.username]

      if (challenge_submission.submission != None):
        for submitted_file in challenge_submission.submission:
          bucket_name = submitted_file.split('//')[1].split('.')[0]
          filename = submitted_file.split('.com/')[1]

          url = S3_CLIENT.generate_presigned_url(ClientMethod='get_object',Params={'Bucket':bucket_name,'Key':filename},ExpiresIn=3600)
          files.append(url)
          file_names.append(filename.split('/')[5])

      submission = [{'id':challenge_submission.id,'challenge_type': challenge_submission.challenge_type,'submitted':challenge_submission.submitted,'follower_id':challenge_submission.follower_id,'team_id':challenge_submission.team_id,'challenge_id':challenge_submission.challenge_id,'name':challenge_submission.name,'files':files,'filenames':file_names,'team_name':team_name,'members':members,'photo':challenge_submission.photo,'description':challenge_submission.description,'about':challenge_submission.about,'winner':challenge_submission.winner,'winner_type':challenge_submission.winner_type}]

      db_session.close()

      response = jsonify(submission)
      response.status_code = 200
      return response

    elif ((logged_out == True) and (challenge_submission.submitted == True) and (confidential == False)):
      members = []
      team_name = ""

      if (challenge_submission.team_id != None):
        team = db_session.query(TeamTable).filter_by(id=challenge_submission.team_id).first()
        members = team.members
        team_name = team.name

      else:
        participant = db_session.query(ParticipantUserTable).filter_by(parent_id=challenge_submission.follower_id).first()
        members = [participant.username]

      submission = [{'id':challenge_submission.id,'challenge_type': challenge_submission.challenge_type,'submitted':challenge_submission.submitted,'follower_id':challenge_submission.follower_id,'team_id':challenge_submission.team_id,'challenge_id':challenge_submission.challenge_id,'name':challenge_submission.name,'team_name':team_name,'members':members,'photo':challenge_submission.photo,'description':challenge_submission.description,'about':challenge_submission.about,'winner':challenge_submission.winner,'winner_type':challenge_submission.winner_type}]

      db_session.close()

      response = jsonify(submission)
      response.status_code = 200
      return response
    
    else:
      db_session.close()
      return UNAUTHORIZED

  def post(self,sid):
    pass
    
  def put(self,sid):
    pass

  def delete(self,sid):
    pass