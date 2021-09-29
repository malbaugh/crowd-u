# coding=utf-8

from os import path
from flask_restful import Resource
from flask import jsonify
from Models.entity import DB_SESSION
from Models.Data.form_files.form_data import ConcentrationTable, ConcentrationTableSchema, UniversityTable, UniversityTableSchema, MajorTable, MajorTableSchema, IndustryTable, IndustryTableSchema

class Data(Resource):
  def get(self):
    db_session = DB_SESSION()

    industry_schema = IndustryTableSchema(many=True)
    concentration_schema = ConcentrationTableSchema(many=True)
    university_schema = UniversityTableSchema(many=True)
    major_schema = MajorTableSchema(many=True)

    industry_objects = db_session.query(IndustryTable).order_by(IndustryTable.industry).all()
    concentration_objects = db_session.query(ConcentrationTable).order_by(ConcentrationTable.concentration).all()
    university_objects = db_session.query(UniversityTable).order_by(UniversityTable.university).all()
    major_objects = db_session.query(MajorTable).order_by(MajorTable.major).all()

    industries = industry_schema.dump(industry_objects)
    concentrations = concentration_schema.dump(concentration_objects)
    universities = university_schema.dump(university_objects)
    majors = major_schema.dump(major_objects)

    db_session.close()

    response = jsonify({'industries': industries.data, 'concentrations': concentrations.data, 'universities': universities.data, 'majors': majors.data})
    response.status_code = 200
    return response

  def post(self):
    pass
    
  def put(self):
    pass

  def delete(self):
    pass