# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify, request
from Models.entity import DB_SESSION
from Models.Users.participant_users.participant_user import ParticipantProfileTable, ParticipantUserTable, ParticipantUserTableSchema
from sqlalchemy import func

class Search(Resource):
  def get(self):
    db_session = DB_SESSION()

    participant_user_objects = db_session.query(ParticipantUserTable).filter_by(email_confirmed=True)

    if (request.args.get('query')):
      search = request.args.get('query').split(' ')
      
      for word in search:
        participant_user_objects = participant_user_objects.filter(ParticipantUserTable.search.ilike('%' + word + '%'))

    if (request.args.get('major')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(ParticipantProfileTable.major == request.args.get('major'))
    
    if (request.args.get('educationStatus')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(ParticipantProfileTable.education_status == request.args.get('educationStatus'))
    
    if (request.args.get('travelAvailability')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(ParticipantProfileTable.travel_availability == request.args.get('travelAvailability'))
    
    if (request.args.get('university')):
      participant_user_objects = participant_user_objects.filter(ParticipantUserTable.university == request.args.get('university'))
    
    if (request.args.get('city')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(ParticipantProfileTable.city.ilike('%' + request.args.get('city') + '%'))
    
    if (request.args.get('state')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(ParticipantProfileTable.state == request.args.get('state'))

    if (request.args.get('concentration1')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(func.array_to_string(ParticipantProfileTable.concentration,',','*').ilike('%' + request.args.get('concentration1') + '%'))

    if (request.args.get('concentration2')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(func.array_to_string(ParticipantProfileTable.concentration,',','*').ilike('%' + request.args.get('concentration2') + '%'))

    if (request.args.get('concentration3')):
      participant_user_objects = participant_user_objects.join(ParticipantUserTable.participant_profile_data).filter(func.array_to_string(ParticipantProfileTable.concentration,',','*').ilike('%' + request.args.get('concentration3') + '%'))

    part_schema = ParticipantUserTableSchema(many=True, exclude=('password','date_of_birth','address','email','phone',))
    participant_users = part_schema.dump(participant_user_objects)

    db_session.close()

    response = jsonify(participant_users.data)
    response.status_code = 200
    return response

  def post(self):
    pass

  def put(self):
    pass

  def delete(self):
    pass