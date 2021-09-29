# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION, S3_CLIENT
from Models.Users.teams.team import TeamTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND
from Models.Users.users.user import UserTable
from sqlalchemy import func

class SubmissionsByUser(Resource):
  def get(self,uid):
    db_session = DB_SESSION()

    if (request.args.get('complete')):
      if (request.args.get('complete')=="true"):
        submitted = True
      else:
        submitted = False

    user = db_session.query(UserTable).filter_by(id=uid).first()
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      logged_out = False
    
    else:
      logged_out = True

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif ((logged_out == False) and (user.username == username) and check_password_hash(user.password, password)):
      if (request.args.get('complete')):
        challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(follower_id=uid,submitted=submitted)
      else:
        challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(follower_id=uid)

      if (request.args.get('challenge_type')):
        challenge_submissions = challenge_submissions.filter_by(challenge_type=request.args.get('challenge_type'))

      submissions = []
      for entry in challenge_submissions:
        files = []
        file_names = []
        members = []
        team_name = ""

        if (entry.team_id != None):
          team = db_session.query(TeamTable).filter_by(id=entry.team_id).first()
          members = team.members
          team_name = team.name

        else:
          participant = db_session.query(ParticipantUserTable).filter_by(parent_id=entry.follower_id).first()
          members = [participant.username]

        if (entry.submission != None):
          for submitted_file in entry.submission:
            bucket_name = submitted_file.split('//')[1].split('.')[0]
            filename = submitted_file.split('.com/')[1]

            url = S3_CLIENT.generate_presigned_url(ClientMethod='get_object',Params={'Bucket':bucket_name,'Key':filename},ExpiresIn=3600)
            files.append(url)
            file_names.append(filename.split('/')[5])

        submissions.append({'id':entry.id,'challenge_type': entry.challenge_type,'submitted':entry.submitted,'follower_id':entry.follower_id,'team_id':entry.team_id,'challenge_id':entry.challenge_id,'name':entry.name,'files':files,'filenames':file_names,'team_name':team_name,'members':members,'photo':entry.photo,'description':entry.description,'about':entry.about,'winner':entry.winner,'winner_type':entry.winner_type})

      teams = db_session.query(TeamTable).filter(func.array_to_string(TeamTable.members,',','*').ilike('%' + username + '%')).filter(TeamTable.leader!=username).all()
      
      for team in teams:
        if (request.args.get('complete')):
          challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(team_id=team.id,submitted=submitted)
        else: 
          challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(team_id=team.id)

        if (request.args.get('challenge_type')):
          challenge_submissions = challenge_submissions.filter_by(challenge_type=request.args.get('challenge_type'))

        for entry in challenge_submissions:
          files = []
          file_names = []
          members = []
          team_name = ""

          if (entry.team_id != None):
            team = db_session.query(TeamTable).filter_by(id=entry.team_id).first()
            members = team.members
            team_name = team.name

          else:
            participant = db_session.query(ParticipantUserTable).filter_by(parent_id=entry.follower_id).first()
            members = [participant.username]
          if (entry.submission != None):
            for submitted_file in entry.submission:
              bucket_name = submitted_file.split('//')[1].split('.')[0]
              filename = submitted_file.split('.com/')[1]

              url = S3_CLIENT.generate_presigned_url(ClientMethod='get_object',Params={'Bucket':bucket_name,'Key':filename},ExpiresIn=3600)
              files.append(url)
              file_names.append(filename.split('/')[5])

          submissions.append({'id':entry.id,'challenge_type': entry.challenge_type,'submitted':entry.submitted,'follower_id':entry.follower_id,'team_id':entry.team_id,'challenge_id':entry.challenge_id,'name':entry.name,'files':files,'filenames':file_names,'team_name':team_name,'members':members,'photo':entry.photo,'description':entry.description,'about':entry.about,'winner':entry.winner,'winner_type':entry.winner_type})

      db_session.close()
      
      response = jsonify(submissions)
      response.status_code = 200
      return response

    else:
      challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(follower_id=uid,submitted=submitted).all()
      
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
        
        submissions.append({'id':entry.id,'challenge_type': entry.challenge_type,'submitted':entry.submitted,'follower_id':entry.follower_id,'team_id':entry.team_id,'challenge_id':entry.challenge_id,'name':entry.name,'team_name':team_name,'members':members,'photo':entry.photo,'description':entry.description,'winner':entry.winner,'winner_type':entry.winner_type})

      teams = db_session.query(TeamTable).filter(func.array_to_string(TeamTable.members,',','*').ilike('%' + user.username + '%')).filter(TeamTable.leader!=user.username).all()
      
      for team in teams:
        challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(team_id=team.id,submitted=submitted).all()
        
        for entry in challenge_submissions:
          files = []
          file_names = []
          members = []
          team_name = ""

          if (entry.team_id != None):
            team = db_session.query(TeamTable).filter_by(id=entry.team_id).first()
            members = team.members
            team_name = team.name

          else:
            participant = db_session.query(ParticipantUserTable).filter_by(parent_id=entry.follower_id).first()
            members = [participant.username]

          submissions.append({'id':entry.id,'challenge_type': entry.challenge_type,'submitted':entry.submitted,'follower_id':entry.follower_id,'team_id':entry.team_id,'challenge_id':entry.challenge_id,'name':entry.name,'team_name':team_name,'members':members,'photo':entry.photo,'description':entry.description,'winner':entry.winner,'winner_type':entry.winner_type})

      db_session.close()

      response = jsonify(submissions)
      response.status_code = 200
      return response

  def post(self,uid):
    pass
    
  def put(self,uid):
    pass

  def delete(self,uid):
    pass