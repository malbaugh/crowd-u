# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.submission_favorites.submission_favorite import SubmissionFavoriteTable

class Statistics(Resource):
  def get(self,sid):
    db_session = DB_SESSION()

    favorites = db_session.query(SubmissionFavoriteTable).filter_by(submission_id=sid).all()
    
    favorite_count = 0

    for user in favorites:
      favorite_count = favorite_count + 1

    db_session.close()

    response = jsonify({'favorites': favorite_count})
    response.status_code = 200
    return response

  def post(self,sid):
    pass

  def put(self,sid):
    pass

  def delete(self,sid):
    pass