# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.teams.team import TeamTable, TeamTableSchema
from Models.entity import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED, NOT_FOUND, FORBIDDEN, CONFLICT

class Register(Resource):
  def get(self):
    pass
  
  def post(self):
    leader = request.get_json()['leader']
    members = request.get_json()['members']
    name = request.get_json()['name']
    
    token = request.headers.get("Authorization")
    if (token != None):
      current_username = SERIALIZER.loads(token)['username']
      current_password = SERIALIZER.loads(token)['password']
      user_type = SERIALIZER.loads(token)['user_type']

    else: 
      return UNAUTHORIZED
    
    db_session = DB_SESSION()
    user = db_session.query(UserTable).filter_by(username=leader).first()

    if (user == None):
      db_session.close()
      return NOT_FOUND

    elif (user.email_confirmed == False):
      db_session.close()
      return FORBIDDEN

    elif ((current_username == leader) and check_password_hash(user.password, current_password) and (user_type == "participant")):
      if (db_session.query(TeamTable).filter_by(name=name).first() == None):

        corrected_data = {
          'members': members,
          'name': name,
          'leader': leader
        }

        posted_team = TeamTableSchema(only=('members','name','leader'))\
          .load(corrected_data)

        team = TeamTable(**posted_team.data ,created_by="HTTP post request")
        
        db_session.add(team)

        db_session.commit()
        db_session.close()
        return NO_CONTENT
      
      else:
        db_session.close()
        return CONFLICT

    else:
      db_session.close()
      return UNAUTHORIZED

  def put(self):
    pass

  def delete(self):
    pass