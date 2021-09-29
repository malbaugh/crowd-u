# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ...entity import Entity, DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class MiscUserTable(Entity):
    __tablename__ = 'misc-users'

    id = Column(Integer, primary_key=True)
    
    name = Column(String)
    description = Column(String)
    photo = Column(String)
    link = Column(String)

    on_platform = Column(Boolean)
    connected_id = Column(Integer)
    
    search = Column(String)

    def __init__(self, name, created_by):
        Entity.__init__(self, created_by)
        self.name = name

class MiscUserTableSchema(Schema):
    id = fields.Number()

    name = fields.Str()
    description = fields.Str()
    photo = fields.Str()
    link = fields.Str()

    on_platform = fields.Boolean()
    connected_id = fields.Number()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()