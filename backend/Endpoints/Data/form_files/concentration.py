# coding=utf-8

from os import path
from flask_restful import Resource
from flask import request
from Models.entity import DB_SESSION
from Models.Data.form_files.form_data import ConcentrationTable
from Statuses.statuses import NO_CONTENT

class Concentration(Resource):
  def get(self):
    pass

  def post(self):
    db_session = DB_SESSION()

    if ((request.get_json().get('concentration') == None) or (request.get_json()['concentration'] == ' ') or (request.get_json()['concentration'] == '')):
      db_session.close()
      return NO_CONTENT

    concentration = ConcentrationTable(concentration=request.get_json()['concentration'])
    
    try:
      db_session.add(concentration)
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