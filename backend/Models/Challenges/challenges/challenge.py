# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from ...entity import Entity, DB_SESSION, ENGINE, BASE
from ...sqlal_mutable_array import MutableList
from marshmallow import Schema, fields

class ChallengeTable(Entity, BASE):
    __tablename__ = 'challenges'

    id = Column(Integer, primary_key=True)
    
    name = Column(String)
    owner = Column(String)
    photo = Column(String)
    banner = Column(String)
    prize_total = Column(Float)
    description = Column(String)
    about = Column(String)
    eligibility = Column(String)
    requirements = Column(String)
    judges = Column(MutableList.as_mutable(ARRAY(Integer)))
    judging_criteria = Column(String)
    rules = Column(String)
    resources = Column(String)
    prizes = Column(String)
    virtual = Column(Boolean)
    concentration = Column(MutableList.as_mutable(ARRAY(String)))
    bronze_sponsors = Column(MutableList.as_mutable(ARRAY(Integer)))
    silver_sponsors = Column(MutableList.as_mutable(ARRAY(Integer)))
    gold_sponsors = Column(MutableList.as_mutable(ARRAY(Integer)))
    register_date = Column(DateTime)
    submit_date = Column(DateTime)
    is_confidential = Column(Boolean)
    nda_path = Column(MutableList.as_mutable(ARRAY(String)))
    contract_path = Column(MutableList.as_mutable(ARRAY(String)))
    approved = Column(Boolean)
    completed = Column(Boolean)
    winner_selected = Column(Boolean)
    user_limit = Column(Integer)

    search = Column(String)
    
    def __init__(self, name, photo, owner, prize_total, description, about, concentration, register_date, submit_date, is_confidential, created_by):
        Entity.__init__(self, created_by)
        self.name = name
        self.owner = owner
        self.photo = photo
        self.prize_total = prize_total
        self.description = description
        self.about = about
        self.concentration = concentration
        self.register_date = register_date
        self.submit_date = submit_date
        self.is_confidential = is_confidential
        self.approved = False
        self.completed = False
        self.winner_selected = False

class ChallengeTableSchema(Schema):
    id = fields.Number()

    name = fields.Str()
    owner = fields.Str()
    photo = fields.Str()
    banner = fields.Str()
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