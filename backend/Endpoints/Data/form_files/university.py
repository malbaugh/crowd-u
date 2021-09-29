# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Data.form_files.form_data import UniversityTable
from Statuses.statuses import NO_CONTENT

class University(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    if ((request.get_json().get('university') == None) or (request.get_json()['university'] == ' ') or (request.get_json()['university'] == '')):
      db_session.close()
      return NO_CONTENT

    university = UniversityTable(university=request.get_json()['university'])

    try:
      db_session.add(university)
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