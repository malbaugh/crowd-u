# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Data.form_files.form_data import MajorTable
from Statuses.statuses import NO_CONTENT

class Major(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    if ((request.get_json().get('major') == None) or (request.get_json()['major'] == ' ') or (request.get_json()['major'] == '')):
      db_session.close()
      return NO_CONTENT

    major = MajorTable(major=request.get_json()['major'])

    try:
      db_session.add(major)
      db_session.commit()
      db_session.close()
      return NO_CONTENT

    except:
      db_session.close()
      return NO_CONTENT
    
  def put(self):
    pass

  def delete(self):
    pass