# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from ...entity import Entity, DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
from ...Challenges.challenges.challenge import ChallengeTable, ChallengeTableSchema

class ContractTable(ChallengeTable):
    __tablename__ = 'contracts'

    _id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('challenges.id'))
    
    def __init__(self, name, photo, owner, prize_total, description, about, concentration, register_date, submit_date, is_confidential, created_by):
        ChallengeTable.__init__(self, name, photo, owner, prize_total, description, about, concentration, register_date, submit_date, is_confidential, created_by)

class ContractTableSchema(Schema):
    _id = fields.Number()
    parent_id = fields.Number()

    name = fields.Str()
    owner = fields.Str()
    banner = fields.Str()
    photo = fields.Str()
    prize_total = fields.Number()
    description = fields.Str()
    about = fields.Str()
    eligibility = fields.Str()
    requirements = fields.Str()
    judges = fields.List(fields.Number())
    judging_criteria = fields.Str()
    rules = fields.Str()
    resources = fields.Str()
    prizes = fields.Str()
    virtual = fields.Boolean()
    concentration = fields.List(fields.Str())
    bronze_sponsors = fields.List(fields.Number())
    silver_sponsors = fields.List(fields.Number())
    gold_sponsors = fields.List(fields.Number())
    register_date = fields.DateTime()
    submit_date = fields.DateTime()
    is_confidential = fields.Boolean()
    nda_path = fields.List(fields.Str())
    contract_path = fields.List(fields.Str())
    approved = fields.Boolean()
    completed = fields.Boolean()
    winner_selected = fields.Boolean()
    user_limit = fields.Number()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()