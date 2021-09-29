# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Users.users.user import UserTable
from Models.Challenges.contests.contest import ContestTable, ContestTableSchema
from Models.Data.challenge_followers.challenge_follower import ChallengeFollowerTable
from Models.Data.challenge_registrations.challenge_registration import ChallengeRegistrationTable
from datetime import datetime
from sqlalchemy import func

class SearchContests(Resource):
  def get(self):
    db_session = DB_SESSION()

    contest_objects = db_session.query(ContestTable)
    
    if (request.args.get('query')):
      search = request.args.get('query').split(' ')
      
      for word in search:
        contest_objects = contest_objects.filter(ContestTable.search.ilike('%' + word + '%'))

    if (request.args.get('owner')):
      contest_objects = contest_objects.filter(ContestTable.owner == request.args.get('owner'))

    if (request.args.get('complete')):
      if (request.args.get('complete')=="true"):
        contest_objects = contest_objects.filter((ContestTable.submit_date < datetime.now()) | (ContestTable.completed == True))
      else:
        contest_objects = contest_objects.filter((ContestTable.submit_date >= datetime.now()) & (ContestTable.completed == False))
    
    if (request.args.get('prizeMin')):
      contest_objects = contest_objects.filter(ContestTable.prize_total >= request.args.get('prizeMin'))

    if (request.args.get('prizeMax')):
      contest_objects = contest_objects.filter(ContestTable.prize_total <= request.args.get('prizeMax'))

    if (request.args.get('startDate')):
      contest_objects = contest_objects.filter(ContestTable.register_date >= request.args.get('startDate'))

    if (request.args.get('endDate')):
      contest_objects = contest_objects.filter(ContestTable.submit_date <= request.args.get('endDate'))

    if (request.args.get('concentration1')):
      contest_objects = contest_objects.filter(func.array_to_string(ContestTable.concentration,',','*').ilike('%' + request.args.get('concentration1') + '%'))

    if (request.args.get('concentration2')):
      contest_objects = contest_objects.filter(func.array_to_string(ContestTable.concentration,',','*').ilike('%' + request.args.get('concentration2') + '%'))

    if (request.args.get('concentration3')):
      contest_objects = contest_objects.filter(func.array_to_string(ContestTable.concentration,',','*').ilike('%' + request.args.get('concentration3') + '%'))
    
    if (request.args.get('follower')):
      user = db_session.query(UserTable).filter_by(username=request.args.get('follower')).first()

      if (request.args.get('registered')=="true"):
        registered_objects = db_session.query(ChallengeRegistrationTable).filter_by(user_id=user.id)

        ids1 = []
        for challenge in registered_objects:
          ids1.append(challenge.challenge_id)

        contest_objects = contest_objects.filter(ContestTable.parent_id.in_(ids1))

      elif (request.args.get('submitted')=="true"):
        follower_objects = db_session.query(ChallengeFollowerTable).filter_by(follower_id=user.id,submitted=True)

        ids2 = []
        for follower in follower_objects:
          ids2.append(follower.challenge_id)

        contest_objects = contest_objects.filter(ContestTable.parent_id.in_(ids2))

      elif (request.args.get('submitted')=="false"):
        follower_objects = db_session.query(ChallengeFollowerTable).filter_by(follower_id=user.id,submitted=False)

        ids3 = []
        for follower in follower_objects:
          ids3.append(follower.challenge_id)

        contest_objects = contest_objects.filter(ContestTable.parent_id.in_(ids3))

    contest_schema = ContestTableSchema(many=True, exclude=('nda_path','contract_path',))
    contests = contest_schema.dump(contest_objects)

    db_session.close()

    response = jsonify(contests.data)
    response.status_code = 200
    return response

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass