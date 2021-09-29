# coding=utf-8

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from ...sqlal_mutable_array import MutableList
from ...entity import BASE
from ...Users.users.user import UserTable, ProfileTable, ProfileTableSchema, UserTableSchema
from marshmallow import fields, Schema

class ParticipantProfileTable(ProfileTable): # Model Commands
    __tablename__ = 'participant_profile_data'

    _id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('profile_data.id'))
    participant_user_id = Column(Integer, ForeignKey('participant_users._id'))

    phone = Column(Float)
    major = Column(String)
    education_status = Column(String)
    enrollment_status = Column(String)
    travel_availability = Column(String)
    concentration = Column(MutableList.as_mutable(ARRAY(String)))
    participant_user = relationship("ParticipantUserTable", back_populates="participant_profile_data")

    def __init__(self, photo, description, about, address, city, state, postal_code, linkedin, website, phone, major, education_status, enrollment_status, travel_availability, concentration):
        ProfileTable.__init__(self, photo, description, about, address, city, state, postal_code, linkedin, website)
        self.phone = phone
        self.major = major
        self.education_status = education_status
        self.enrollment_status = enrollment_status
        self.travel_availability = travel_availability
        self.concentration = concentration

class ParticipantUserTable(UserTable):
    __tablename__ = 'participant_users'

    _id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('users.id'))

    date_of_birth = Column(DateTime)
    university = Column(String)
    participant_profile_data = relationship("ParticipantProfileTable", order_by=ParticipantProfileTable._id, back_populates="participant_user", cascade="all, delete, delete-orphan")

    def __init__(self, first_name, last_name, email, password, username, date_of_birth, university, created_by):
        UserTable.__init__(self, first_name, last_name, email, password, username, created_by)
        self.date_of_birth = date_of_birth
        self.university = university

class ParticipantProfileTableSchema(Schema): 
    _id = fields.Number()
    parent_id = fields.Number()
    participant_user_id = fields.Number()
    participant_user = fields.Nested("ParticipantUserTableSchema", many=True, exclude=("participant_profile_data",))

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

    phone = fields.Number()
    major = fields.Str()
    education_status = fields.Str()
    enrollment_status = fields.Str()
    travel_availability = fields.Str()
    concentration = fields.List(fields.Str())

class ParticipantUserTableSchema(Schema):
    _id = fields.Number()
    parent_id = fields.Number()
    participant_profile_data = fields.Nested(ParticipantProfileTableSchema, many=True, exclude=("participant_user",))

    email = fields.Str()
    password = fields.Str()
    username = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()

    date_of_birth = fields.DateTime()
    university = fields.Str()
    email_confirmed = fields.Boolean()
    
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()