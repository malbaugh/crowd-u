# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.submission_favorites.submission_favorite import SubmissionFavoriteTable

class SubmissionFavorited(Resource):
  def get(self,fid,sid):
    db_session = DB_SESSION()

    follower = db_session.query(SubmissionFavoriteTable).filter_by(follower_id=fid, submission_id=sid).first()

    db_session.close()

    if (follower != None):
      response = jsonify({'favorited': True})
      response.status_code = 200
      return response

    else:
      response = jsonify({'favorited': False})
      response.status_code = 200
      return response

  def post(self,fid,sid):
    pass

  def put(self,fid,sid):
    pass

  def delete(self,fid,sid):
    pass