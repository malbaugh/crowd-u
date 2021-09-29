# coding=utf-8

from datetime import datetime
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import boto3
from itsdangerous import JSONWebSignatureSerializer

db_url = 'db URL here' # This is the testing Database
ENGINE = create_engine(db_url)
DB_SESSION = sessionmaker(bind=ENGINE)

FILE_KEY = b'key here'
PRIVATE_KEY = 'key here'
AWS_ACCESS_KEY = 'key here'
AWS_SECRET_KEY = 'key here'

SERIALIZER = JSONWebSignatureSerializer(PRIVATE_KEY)

S3_RESOURCE = boto3.resource('s3',aws_access_key_id=AWS_ACCESS_KEY,aws_secret_access_key=AWS_SECRET_KEY)
SES_CLIENT = boto3.client('ses',region_name='us-east-1',aws_access_key_id=AWS_ACCESS_KEY,aws_secret_access_key=AWS_SECRET_KEY)
S3_CLIENT = boto3.client('s3',aws_access_key_id=AWS_ACCESS_KEY,aws_secret_access_key=AWS_SECRET_KEY)

BASE = declarative_base()

class Entity():
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)

    def __init__(self, created_by):
        self.created_at = datetime.now() # UTC?
        self.updated_at = datetime.now()
        self.last_updated_by = created_by