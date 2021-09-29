# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from ...entity import BASE
from marshmallow import fields, Schema

class ChallengeRegistrationTable(BASE):
    __tablename__ = 'challenge_registrations'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer) 
    challenge_id = Column(Integer)
    date = Column(DateTime)

    def __init__(self, user_id, challenge_id, date):
        self.user_id = user_id
        self.challenge_id = challenge_id
        self.date = date

class ChallengeRegistrationTableSchema(Schema):
    id = fields.Number()
    user_id = fields.Number()
    challenge_id = fields.Number()
    date = fields.DateTime()