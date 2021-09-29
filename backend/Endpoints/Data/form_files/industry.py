# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Data.form_files.form_data import IndustryTable
from Statuses.statuses import NO_CONTENT

class Industry(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    if ((request.get_json().get('industry') == None) or (request.get_json()['industry'] == ' ') or (request.get_json()['industry'] == '')):
      db_session.close()
      return NO_CONTENT

    industry = IndustryTable(industry=request.get_json()['industry'])
    
    try:
      db_session.add(industry)
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