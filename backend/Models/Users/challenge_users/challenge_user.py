# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ...entity import BASE
from ...Users.users.user import UserTable, ProfileTable, ProfileTableSchema, UserTableSchema
from marshmallow import fields, Schema

class ChallengeOwnerProfileTable(ProfileTable):
    __tablename__ = 'challenge_owner_profile_data'

    _id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('profile_data.id'))
    challenge_user_id = Column(Integer, ForeignKey('challenge_users._id'))

    industry = Column(String)
    challenge_user = relationship("ChallengeUserTable", back_populates="challenge_owner_profile_data")

    def __init__(self, photo, description, about, address, city, state, postal_code, linkedin, website, industry):
        ProfileTable.__init__(self, photo, description, about, address, city, state, postal_code, linkedin, website)
        self.industry = industry

class ChallengeUserTable(UserTable):
    __tablename__ = 'challenge_users'

    _id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('users.id'))

    poc_first_name = Column(String)
    poc_last_name = Column(String)
    poc_phone = Column(Float)

    department = Column(String)
    org_lead = Column(Boolean)
    lead_id = Column(Integer)

    challenge_owner_profile_data = relationship("ChallengeOwnerProfileTable", order_by=ChallengeOwnerProfileTable._id, back_populates="challenge_user", cascade="all, delete, delete-orphan")
    
    def __init__(self, first_name, last_name, email, password, username,  poc_first_name, poc_last_name, poc_phone, created_by):
        UserTable.__init__(self, first_name, last_name, email, password, username, created_by)
        self.poc_first_name = poc_first_name
        self.poc_last_name = poc_last_name
        self.poc_phone = poc_phone

class ChallengeOwnerProfileTableSchema(Schema):
    _id = fields.Number()
    parent_id = fields.Number()
    challenge_user_id = fields.Number()
    challenge_user = fields.Nested("ChallengeUserTableSchema", many=True, exclude=("challenge_owner_profile_data",))

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
    
    industry = fields.Str()

class ChallengeUserTableSchema(Schema):
    _id = fields.Number()
    parent_id = fields.Number()
    challenge_owner_profile_data = fields.Nested(ChallengeOwnerProfileTableSchema, many=True, exclude=("challenge_user",))

    email = fields.Str()
    password = fields.Str()
    username = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()

    poc_first_name = fields.Str()
    poc_last_name = fields.Str()
    poc_phone = fields.Number()

    department = fields.Str()
    org_lead = fields.Boolean()
    lead_id = fields.Number()
    email_confirmed = fields.Boolean()

    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()