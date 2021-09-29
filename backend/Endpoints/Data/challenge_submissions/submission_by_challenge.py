# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION, S3_CLIENT
from Models.Users.teams.team import TeamTable
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Users.participant_users.participant_user import ParticipantUserTable
from Models.Challenges.challenges.challenge import ChallengeTable
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from werkzeug.security import check_password_hash
from Statuses.statuses import BAD_REQUEST, UNAUTHORIZED, NOT_FOUND

class SubmissionsByChallenge(Resource):
  def get(self,cid):
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
      challenge_submissions = db_session.query(ChallengeSubmissionTable).filter_by(challenge_id=cid,submitted=True).all()
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

      db_session.close()

      response = jsonify(submissions)
      response.status_code = 200
      return response

    else:
      db_session.close()
      return UNAUTHORIZED

  def post(self,cid):
    pass
    
  def put(self,cid):
    pass

  def delete(self,cid):
    pass