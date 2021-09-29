# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION, S3_RESOURCE
from Models.Users.users.user import UserTable
from Models.Users.teams.team import TeamTable
from Models.Challenges.contests.contest import ContestTable
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable, ChallengeFollowerTableSchema
from Models.Data.challenge_submissions.challenge_submission import ChallengeSubmissionTable
from datetime import datetime
from werkzeug.security import check_password_hash
import base64
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED, NOT_FOUND, FORBIDDEN

class SubmitToContestAsTeam(Resource):
  def get(self,challenge_id,team_id):
    pass

  def post(self,challenge_id,team_id):
    pass
    
  def put(self,challenge_id,team_id):
    db_session = DB_SESSION()
    
    filenames = request.get_json()['submittedFileNames']
    files = request.get_json()['submittedFiles']

    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
      user = db_session.query(UserTable).filter_by(username=username).first()

    else: 
      db_session.close()
      return jsonify("You need to include a header with your authorization."), 401

    contest = db_session.query(ContestTable).filter_by(parent_id=int(challenge_id)).first()
    follower = db_session.query(ChallengeFollowerTable).filter_by(follower_id=int(user.id), challenge_id=int(challenge_id)).first()
    team = db_session.query(TeamTable).filter_by(id=team_id).first()

    if (contest == None):
      db_session.close()
      return NOT_FOUND
    
    elif (user.email_confirmed == False):
      db_session.close()
      return FORBIDDEN

    elif ((team.leader == username) and check_password_hash(user.password, password) and (follower != None)):
      follower.submitted = True

      bucket = S3_RESOURCE.Bucket(name='crowd-u-contests')
      file_urls = []
      for i in range(len(files)):
        filename = "submissions/" + contest.owner + "/" + challenge_id + "/teams/" + team.name + "/" + filenames[i]
        
        bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
        bucket_object.put(Body=base64.b64decode(files[i]),ACL='private')
        
        file_urls.append("https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename))

      file_submission = db_session.query(ChallengeSubmissionTable).filter_by(challenge_id=int(challenge_id), team_id=team.id).first()
      file_submission.submission = file_urls
      file_submission.photo = request.get_json()['photo']
      file_submission.description = request.get_json()['description']
      file_submission.about = request.get_json()['about']
      file_submission.name = request.get_json()['name']
      file_submission.submitted = True
      file_submission.submission_time = datetime.now()
      file_submission.search = request.get_json()['name']+' '+request.get_json()['description']

      if (team.challenges == None):
        team.challenges = [contest.parent_id]
      else:
        team.challenges.append(contest.parent_id)
      
      db_session.merge(team)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

    elif ((team.leader == username) and check_password_hash(user.password, password) and (follower == None)):
      corrected_data = {
        'follower_id': user.id,
        'challenge_id': int(challenge_id)
      }

      posted_follower = ChallengeFollowerTableSchema(only=('follower_id','challenge_id','date'))\
        .load(corrected_data)

      follower = ChallengeFollowerTable(**posted_follower.data, date=datetime.now())
      follower.submitted = True

      db_session.add(follower)
      
      bucket = S3_RESOURCE.Bucket(name='crowd-u-contests')
      file_urls = []
      for i in range(len(files)):
        filename = "submissions/" + contest.owner + "/" + challenge_id + "/teams/" + team.name + "/" + filenames[i]
        
        bucket_object = S3_RESOURCE.Object(bucket_name=bucket.name, key=filename)
        bucket_object.put(Body=base64.b64decode(files[i]),ACL='private')
        
        file_urls.append("https://{0}.s3.amazonaws.com/{1}".format(bucket.name,filename))

      file_submission = db_session.query(ChallengeSubmissionTable).filter_by(challenge_id=int(challenge_id), team_id=team.id).first()
      file_submission.submission = file_urls
      file_submission.photo = request.get_json()['photo']
      file_submission.description = request.get_json()['description']
      file_submission.about = request.get_json()['about']
      file_submission.name = request.get_json()['name']
      file_submission.submitted = True
      file_submission.submission_time = datetime.now()
      file_submission.search = request.get_json()['name']+' '+request.get_json()['description']

      if (team.challenges == None):
        team.challenges = [contest.parent_id]
      else:
        team.challenges.append(contest.parent_id)

      db_session.merge(team)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,challenge_id,team_id):
    pass