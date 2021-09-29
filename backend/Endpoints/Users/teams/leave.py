# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.teams.team import TeamTable
from Models.entity import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST

class Leave(Resource):
  def get(self,tid):
    pass

  def post(self,tid):
    pass

  def put(self,tid):
    token = request.headers.get("Authorization")
    username = request.get_json()['username']
    old_members = request.get_json()['members']

    if (token != None):
      current_username = SERIALIZER.loads(token)['username']
      current_password = SERIALIZER.loads(token)['password']
    
    else: 
      return UNAUTHORIZED
    
    db_session = DB_SESSION()
    team = db_session.query(TeamTable).filter_by(id=tid).first()
    user = db_session.query(UserTable).filter_by(username=username).first()

    if (team == None):
      db_session.close()
      return NOT_FOUND

    elif (user == None):
      db_session.close()
      return NOT_FOUND

    elif (old_members != team.members):
      db_session.close()
      return BAD_REQUEST

    elif ((current_username == username) and (check_password_hash(user.password, current_password))):
      old_members.remove(username)

      if (len(team.members) < 3):
        db_session.query(TeamTable).filter_by(id=tid).delete()

      else:
        team.members = old_members
      
      db_session.commit()
      
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED

  def delete(self,tid):
    pass