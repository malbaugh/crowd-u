# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Users.teams.team import TeamTable
from Models.entity import SERIALIZER
from Models.Users.users.user import UserTable
from werkzeug.security import check_password_hash
from Statuses.statuses import NO_CONTENT, UNAUTHORIZED

class Delete(Resource):
  def get(self,name):
    pass

  def post(self,name):
    pass

  def put(self,name):
    pass

  def delete(self,name):
    token = request.headers.get("Authorization")
    if (token != None):
      username = SERIALIZER.loads(token)['username']
      password = SERIALIZER.loads(token)['password']
    
    else: 
      return UNAUTHORIZED
    
    db_session = DB_SESSION()
    team = db_session.query(TeamTable).filter_by(name=name).first()
    user = db_session.query(UserTable).filter_by(username=username).first()

    if ((team.leader == username) and (check_password_hash(user.password, password))):
      db_session.query(TeamTable).filter_by(name=name).delete()

      db_session.commit()
      db_session.close()
      return NO_CONTENT

    else:
      db_session.close()
      return UNAUTHORIZED