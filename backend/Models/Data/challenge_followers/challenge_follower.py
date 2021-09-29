# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from ...entity import BASE
from marshmallow import fields, Schema

class ChallengeFollowerTable(BASE):
    __tablename__ = 'challenge_followers'

    id = Column(Integer, primary_key=True)
    follower_id = Column(Integer)
    challenge_id = Column(Integer)
    date = Column(DateTime)
    submitted = Column(Boolean)

    def __init__(self, follower_id, challenge_id, date):
        self.follower_id = follower_id
        self.challenge_id = challenge_id
        self.date = date

class ChallengeFollowerTableSchema(Schema):
    id = fields.Number()
    follower_id = fields.Number()
    challenge_id = fields.Number()
    date = fields.DateTime()
    submitted = fields.Boolean()