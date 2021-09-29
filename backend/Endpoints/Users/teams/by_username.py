# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Users.teams.team import TeamTable, TeamTableSchema
from sqlalchemy import func

class ByUsername(Resource):
  def get(self,username):
    db_session = DB_SESSION()

    team_objects = db_session.query(TeamTable).filter_by(leader=username).all()
    team_schema = TeamTableSchema(many=True)
    teams = team_schema.dump(team_objects)

    member_team_objects = db_session.query(TeamTable).filter(func.array_to_string(TeamTable.members,',','*').ilike('%' + username + '%')).filter(TeamTable.leader!=username)
    member_team_schema = TeamTableSchema(many=True)
    member_teams = member_team_schema.dump(member_team_objects)

    db_session.close()
    
    response = jsonify({'teams': teams.data,'member_teams': member_teams.data})
    response.status_code = 200
    return response

  def post(self,username):
    pass

  def put(self,username):
    pass

  def delete(self,username):
    pass