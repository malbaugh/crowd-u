# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from ...entity import BASE
from marshmallow import fields, Schema

class UserFollowerTable(BASE):
    __tablename__ = 'user_followers'

    id = Column(Integer, primary_key=True)
    follower_id = Column(Integer)
    user_id = Column(Integer)
    date = Column(DateTime)

    def __init__(self, follower_id, user_id, date):
        self.follower_id = follower_id
        self.user_id = user_id
        self.date = date

class UserFollowerTableSchema(Schema):
    id = fields.Number()
    follower_id = fields.Number()
    user_id = fields.Number()
    date = fields.DateTime()