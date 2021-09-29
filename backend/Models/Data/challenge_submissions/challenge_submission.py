# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, Boolean, String, Integer, Float, DateTime
from ...entity import BASE
from ...sqlal_mutable_array import MutableList
from marshmallow import fields, Schema
from sqlalchemy.dialects.postgresql import ARRAY

class ChallengeSubmissionTable(BASE):
    __tablename__ = 'challenge_submissions'

    id = Column(Integer, primary_key=True)
    follower_id = Column(Integer)
    team_id = Column(Integer)
    challenge_id = Column(Integer)
    challenge_type = Column(String)
    submission_time = Column(DateTime)
    submission = Column(MutableList.as_mutable(ARRAY(String)))
    winner = Column(Boolean)
    winner_type = Column(String)
    photo = Column(String)
    description = Column(String)
    about = Column(String)
    name = Column(String)
    submitted = Column(Boolean)
    
    search = Column(String)

    def __init__(self,follower_id,challenge_id):
        self.follower_id = follower_id
        self.challenge_id = challenge_id
        self.winner = False
        self.submitted = False

class ChallengeSubmissionTableSchema(Schema):
    id = fields.Number()
    follower_id = fields.Number()
    team_id = fields.Number()
    challenger_id = fields.Number()
    challenge_type = fields.Str()
    submission_time = fields.DateTime()
    submission = fields.List(fields.Str())
    winner = fields.Boolean()
    winner_type = fields.Str()
    photo = fields.Str()
    description = fields.Str()
    about = fields.Str()
    name = fields.Str()
    submitted = fields.Boolean()