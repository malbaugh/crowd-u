# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from ...entity import BASE
from marshmallow import fields, Schema

class SubmissionFavoriteTable(BASE):
    __tablename__ = 'submission_favorites'

    id = Column(Integer, primary_key=True)
    follower_id = Column(Integer)
    submission_id = Column(Integer)
    date = Column(DateTime)

    def __init__(self, follower_id, submission_id, date):
        self.follower_id = follower_id
        self.submission_id = submission_id
        self.date = date

class SubmissionFavoriteTableSchema(Schema):
    id = fields.Number()
    follower_id = fields.Number()
    submission_id = fields.Number()
    date = fields.DateTime()