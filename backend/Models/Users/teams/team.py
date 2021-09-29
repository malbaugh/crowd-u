# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from ...sqlal_mutable_array import MutableList
from ...entity import Entity, DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields

class TeamTable(Entity, BASE):
    __tablename__ = 'teams'

    id = Column(Integer, primary_key=True)
    leader = Column(String)
    members = Column(MutableList.as_mutable(ARRAY(String)))
    name = Column(String, unique=True)
    challenges = Column(MutableList.as_mutable(ARRAY(Integer)))

    def __init__(self, leader, members, name, created_by):
        Entity.__init__(self, created_by)
        self.leader = leader
        self.members = members
        self.name = name

class TeamTableSchema(Schema):
    id = fields.Number()
    leader = fields.Str()
    members = fields.List(fields.Str())
    name = fields.Str()
    challenges = fields.List(fields.Number())

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()