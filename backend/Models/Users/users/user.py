# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ...entity import Entity, DB_SESSION, ENGINE, BASE
from marshmallow import Schema, fields
import random, string

class ProfileTable(BASE):
    __tablename__ = 'profile_data'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("UserTable", back_populates="profile_data")

    photo = Column(String)
    banner = Column(String)
    description = Column(String)
    about = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    postal_code = Column(Float)
    linkedin = Column(String)
    website = Column(String)

    def __init__(self, photo, description, about, address,  city, state, postal_code, linkedin, website):
        self.photo = photo
        self.description = description
        self.about = about
        self.address = address
        self.city = city
        self.state = state
        self.postal_code = postal_code
        self.linkedin = linkedin
        self.website = website

class UserTable(Entity, BASE):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    username = Column(String, unique=True)
    profile_data = relationship("ProfileTable", back_populates="user", cascade="all, delete, delete-orphan")
    
    email_confirmed = Column(Boolean)
    
    search = Column(String)

    def __init__(self, first_name, last_name, email, password, username, created_by):
        Entity.__init__(self, created_by)
        self.email = email
        self.password = password
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email_confirmed = False

class ProfileTableSchema(Schema):
    id = fields.Number()
    user = fields.Nested("UserTableSchema", many=True, exclude=("profile_data",))

    photo = fields.Str()
    banner = fields.Str()
    description = fields.Str()
    about = fields.Str()
    address = fields.Str()
    city = fields.Str()
    state = fields.Str()
    postal_code = fields.Number()
    linkedin = fields.Str()
    website = fields.Str()

class UserTableSchema(Schema):
    id = fields.Number()
    profile_data = fields.Nested(ProfileTableSchema, many=True, exclude=("user",))

    email = fields.Str()
    password = fields.Str()
    username = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()

    email_confirmed = fields.Boolean()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()