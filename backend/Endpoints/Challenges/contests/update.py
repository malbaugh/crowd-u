# coding=utf-8

from os import path
from Models.entity import SERIALIZER
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.challenge_users.challenge_user import ChallengeUserTable
from Models.Challenges.contests.contest import ContestTable
from datetime import datetime
from werkzeug.security import check_password_hash
from Statuses.statuses import UNAUTHORIZED, NOT_FOUND, NO_CONTENT

class UpdateContest(Resource):
  def get(self,challenge_id):
    pass

  def post(self,challenge_id):
    pass
    
  def put(self,challenge_id):
    db_session = DB_SESSION()

    challenge = db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()

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

    elif ((username == challenge.owner) and check_password_hash(user.password, password)):
      data = request.get_json()['contest']

      contest = db_session.query(ContestTable).filter_by(parent_id=challenge_id).first()

      contest.name = data['name']
      contest.about = data['about']
      contest.is_confidential = data['isConfidential']
      contest.concentration = data['concentrations']
      contest.description = data['description']
      contest.prize_total = data['prizeTotal']
      contest.register_date = data['registerDate']
      contest.submit_date = data['submitDate']
      contest.owner_username = data['ownerUsername']
      contest.photo = data['photo']
      contest.prizes = data['prizes']
      contest.eligibility = data['eligibility']
      contest.rules = data['rules']
      contest.requirements = data['requirements']
      contest.judging_criteria = data['judgingCriteria']
      contest.resources = data['resources']
      
      # TODO: Add judges and sponsors in a seperate API call

      contest.updated_at = datetime.now()
      contest.last_updated_by = "HTTP put request"

      contest.search = data['name']+' '+data['description']+' '+username
      contest.user_limit = data['userLimit']

      db_session.commit()
      db_session.close()

      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,challenge_id):
    pass