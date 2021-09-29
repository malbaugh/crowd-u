# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer
from ...entity import BASE
from marshmallow import fields, Schema

class ConcentrationTable(BASE):
    __tablename__ = 'concentration'

    id = Column(Integer, primary_key=True)
    concentration = Column(String, unique=True)
    
class ConcentrationTableSchema(Schema):
    id = fields.Number()
    concentration = fields.Str()

class UniversityTable(BASE):
    __tablename__ = 'university'

    id = Column(Integer, primary_key=True)
    university = Column(String, unique=True)
    photo = Column(String)
    
class UniversityTableSchema(Schema):
    id = fields.Number()
    university = fields.Str()
    photo = fields.Str()

class MajorTable(BASE):
    __tablename__ = 'major'

    id = Column(Integer, primary_key=True)
    major = Column(String, unique=True)
    
class MajorTableSchema(Schema):
    id = fields.Number()
    major = fields.Str()

class IndustryTable(BASE):
    __tablename__ = 'industry'

    id = Column(Integer, primary_key=True)
    industry = Column(String, unique=True)
    
class IndustryTableSchema(Schema):
    id = fields.Number()
    industry = fields.Str()